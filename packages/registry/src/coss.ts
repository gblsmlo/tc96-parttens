import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { RegistryFile } from './manifest'

/** The public COSS registry, used when components.json does not name one. */
export const cossRegistry = 'https://coss.com/ui/r/{name}.json'

export interface CossRegistryItem {
  name: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: { path: string; content: string }[]
  cssVars?: Partial<Record<'theme' | 'light' | 'dark', Record<string, string>>>
  css?: Record<string, unknown>
  envVars?: Record<string, string>
  devDependencies?: string[]
  tailwind?: Record<string, unknown>
}

export interface CossAliases {
  ui: string
  utils: string
}

export async function fetchItem(url: string): Promise<CossRegistryItem> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return (await response.json()) as CossRegistryItem
}

/** The only change allowed on top of COSS: its registry aliases become ours. */
export function normalizeImports(
  content: string,
  aliases: CossAliases = { ui: '@tc96/ui', utils: '@tc96/utils' },
) {
  return content
    .replace(
      /(["'])@\/(?:registry\/default\/)?lib\/utils\1/g,
      `$1${aliases.utils}$1`,
    )
    .replace(
      /(["'])@\/registry\/default\/ui\/([^"']+)\1/g,
      `$1${aliases.ui}/$2$1`,
    )
}

export function itemContent(item: CossRegistryItem) {
  const [file, ...rest] = item.files
  if (
    !file ||
    rest.length ||
    file.path !== `registry/default/ui/${item.name}.tsx`
  )
    throw new Error(
      `${item.name}: expected one file at registry/default/ui/${item.name}.tsx`,
    )
  return file.content
}

// components.json may point @coss at a mirror. Only the string form is read;
// the object form carries headers, which tc96 does not send.
export function cossSource(components: unknown) {
  const source = (components as { registries?: Record<string, unknown> } | null)
    ?.registries?.['@coss']
  if (source === undefined) return cossRegistry
  if (typeof source !== 'string')
    throw new Error(
      'components.json registries.@coss must be a URL or path with {name}; the object form with headers is not supported.',
    )
  const placeholders: string[] = source.match(/\{[^}]*\}/g) ?? []
  if (
    !placeholders.includes('{name}') ||
    placeholders.some((p) => p !== '{name}')
  )
    throw new Error(
      `components.json registries.@coss must contain {name} and no other placeholder: ${source}`,
    )
  return source
}

/** Reads one item from a URL template, or from a path relative to root. */
export async function loadItem(source: string, name: string, root: string) {
  const location = source.replaceAll('{name}', name)
  if (/^https?:\/\//.test(location)) return fetchItem(location)
  return JSON.parse(
    await readFile(resolve(root, location), 'utf8'),
  ) as CossRegistryItem
}

/**
 * COSS items to install, following registryDependencies and skipping the
 * components the consumer already has.
 */
export async function resolveItems(
  dependencies: string[],
  load: (name: string) => Promise<CossRegistryItem>,
  installed: (name: string) => boolean,
) {
  const queue = [...dependencies]
  const items = new Map<string, CossRegistryItem>()
  while (queue.length) {
    const dependency = queue.shift() as string
    const [, name] = dependency.match(/^(?:@coss\/)?([a-z0-9-]+)$/) ?? []
    if (!name)
      throw new Error(`Unsupported COSS registry dependency: ${dependency}`)
    if (items.has(name) || installed(name)) continue
    const item = await load(name)
    if (item.name !== name)
      throw new Error(`COSS item ${name} is published as ${item.name}`)
    items.set(name, item)
    queue.push(...(item.registryDependencies ?? []))
  }
  return [...items.values()].sort((a, b) => a.name.localeCompare(b.name))
}

/** The item's component, with imports rewritten to the consumer's aliases. */
export function componentFile(
  item: CossRegistryItem,
  aliases: CossAliases,
  directory: string,
): RegistryFile {
  for (const key of ['envVars', 'devDependencies', 'tailwind'] as const) {
    const value = item[key]
    if (value && Object.keys(value).length)
      throw new Error(`${item.name}: COSS items with ${key} are not supported`)
  }
  const content = normalizeImports(itemContent(item), aliases)
  const unresolved = content.match(/(["'])(@\/[^"']*)\1/)
  if (unresolved)
    throw new Error(`${item.name}: import ${unresolved[2]} has no alias`)
  return {
    path: `coss/${item.name}.tsx`,
    type: 'registry:ui',
    content,
    target: `~/${directory}/${item.name}.tsx`,
  }
}

export interface MissingTheme {
  item: string
  rules: string[]
}

function cssRule(selector: string, body: unknown, indent = ''): string {
  if (typeof body !== 'object' || body === null)
    return `${indent}${selector}: ${String(body)};`
  const inner = Object.entries(body)
    .map(([key, value]) => cssRule(key, value, `${indent}  `))
    .join('\n')
  return `${indent}${selector} {\n${inner}\n${indent}}`
}

// Theme tokens belong to the consumer, so the CLI never edits its CSS. It
// reports the tokens and rules an item declares that the stylesheet named in
// components.json does not mention.
export function missingTheme(
  items: CossRegistryItem[],
  stylesheet: string | undefined,
): MissingTheme[] {
  const defined = (name: string) => stylesheet?.includes(name) ?? false
  const result: MissingTheme[] = []
  for (const item of items) {
    const rules: string[] = []
    for (const [section, selector] of [
      ['light', ':root'],
      ['dark', '.dark'],
      ['theme', '@theme'],
    ] as const) {
      const entries = Object.entries(item.cssVars?.[section] ?? {})
        .map(([name, value]) => [
          name.startsWith('--') ? name : `--${name}`,
          value,
        ])
        .filter(([name]) => !defined(`${name}:`))
      if (entries.length)
        rules.push(cssRule(selector, Object.fromEntries(entries)))
    }
    for (const [selector, body] of Object.entries(item.css ?? {}))
      if (!defined(selector)) rules.push(cssRule(selector, body))
    if (rules.length) result.push({ item: item.name, rules })
  }
  return result
}
