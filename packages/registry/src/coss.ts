import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { RegistryFile } from './manifest'

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

/** The only change allowed on top of COSS: its registry aliases become ours; the repo's own aliases become the given ones. */
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
      /(["'])@\/registry\/default\/(?:ui\/)?([^"']+)\1/g,
      `$1${aliases.ui}/$2$1`,
    )
    .replace(/(["'])@tc96\/utils\1/g, `$1${aliases.utils}$1`)
    .replace(/(["'])@tc96\/ui\//g, `$1${aliases.ui}/`)
}

/**
 * Paths under the ui directory where an installed COSS item leaves a trace: a
 * component at the root, a hook in hooks/, or a folder named after an item
 * with several files.
 */
export function cossInstalledPaths(name: string) {
  return [`${name}.tsx`, `hooks/${name}.ts`, name]
}

/**
 * Where a registry file goes under the ui directory: the registry/default
 * prefix and the ui/ segment are dropped, other folders are kept.
 */
export function cossPath(item: string, path: string) {
  const relative = path.match(/^registry\/default\/(?:ui\/)?(.+)$/)?.[1]
  if (!relative) throw new Error(`${item}: ${path} is outside registry/default`)
  if (relative === 'lib/utils.ts')
    throw new Error(`${item}: lib/utils.ts is the consumer's own utils`)
  return relative
}

/** Reads one ui item from the registry directory shipped with the CLI. */
export async function loadUiItem(registryDirectory: string, name: string) {
  try {
    return JSON.parse(
      await readFile(join(registryDirectory, 'ui', `${name}.json`), 'utf8'),
    ) as CossRegistryItem
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT')
      throw new Error(`Unknown ui component: ${name}`)
    throw error
  }
}

/**
 * ui items to install, following registryDependencies and skipping the
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
    const [, name] = dependency.match(/^(?:@(?:coss|ui)\/)?([a-z0-9-]+)$/) ?? []
    if (!name)
      throw new Error(`Unsupported ui registry dependency: ${dependency}`)
    if (items.has(name) || installed(name)) continue
    const item = await load(name)
    if (item.name !== name)
      throw new Error(`ui item ${name} is published as ${item.name}`)
    items.set(name, item)
    queue.push(...(item.registryDependencies ?? []))
  }
  return [...items.values()].sort((a, b) => a.name.localeCompare(b.name))
}

/** The item's files, with imports rewritten to the consumer's aliases. */
export function componentFiles(
  item: CossRegistryItem,
  aliases: CossAliases,
  directory: string,
): RegistryFile[] {
  for (const key of ['envVars', 'devDependencies', 'tailwind'] as const) {
    const value = item[key]
    if (value && Object.keys(value).length)
      throw new Error(`${item.name}: COSS items with ${key} are not supported`)
  }
  if (!item.files.length) throw new Error(`${item.name}: has no files`)
  return item.files.map((file) => {
    const path = cossPath(item.name, file.path)
    const content = normalizeImports(file.content, aliases)
    const unresolved = content.match(/(["'])(@\/[^"']*)\1/)
    if (unresolved)
      throw new Error(
        `${item.name}: import ${unresolved[2]} in ${path} has no alias`,
      )
    return {
      path: `ui/${path}`,
      type: 'registry:ui',
      content,
      target: `~/${directory}/${path}`,
    }
  })
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
