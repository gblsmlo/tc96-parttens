import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { files } from './files'

export interface CssRule {
  prelude: string
  declarations: [string, string][]
  children: CssRule[]
}

export interface ThemeFile {
  path: string
  rules: CssRule[]
}

export const themeRoot = 'apps/example/packages/ui/src'
export const codeRoots = [
  'packages/parttens/src',
  'packages/templates/src',
  'packages/elements/src',
  'packages/ui/src',
  'apps/storybook/src',
  'apps/storybook/.storybook',
]

const tailwindNamespaces =
  /^--(spacing$|(color|radius|text|font|font-weight|shadow|inset-shadow|drop-shadow|text-shadow|tw|breakpoint|container|ease|animate|default|leading|tracking|blur|perspective|aspect)-)/
// Base UI sets these on its parts at runtime, so no stylesheet declares them.
const baseUiRuntime =
  /^--(anchor|available|popup|positioner|transform-origin|nested-dialogs|scroll-area|toast|collapsible|accordion|active-tab|navigation-menu)(-|$)/
const tokenBlockMarker = '--background'
const tokenBlockProperties = new Set(['font-family', 'letter-spacing'])

export function parseCss(source: string): CssRule[] {
  const text = source.replace(/\/\*[\s\S]*?\*\//g, '')
  const root: CssRule = { prelude: '', declarations: [], children: [] }
  const stack = [root]
  let buffer = ''
  let quote = ''
  let depth = 0
  const declare = () => {
    const statement = buffer.trim()
    buffer = ''
    if (!statement) return
    const colon = statement.indexOf(':')
    const node = stack.at(-1) as CssRule
    if (statement.startsWith('@') || colon < 0)
      node.declarations.push([statement.split(/\s/)[0] ?? '', statement])
    else
      node.declarations.push([
        statement.slice(0, colon).trim(),
        statement.slice(colon + 1).trim(),
      ])
  }
  for (const char of text) {
    if (quote) {
      buffer += char
      if (char === quote) quote = ''
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      buffer += char
      continue
    }
    if (char === '(') depth++
    if (char === ')') depth--
    if (char === ';' && depth === 0) {
      declare()
      continue
    }
    if (char === '{' && depth === 0) {
      const rule: CssRule = {
        prelude: buffer.trim().replace(/\s+/g, ' '),
        declarations: [],
        children: [],
      }
      buffer = ''
      ;(stack.at(-1) as CssRule).children.push(rule)
      stack.push(rule)
      continue
    }
    if (char === '}' && depth === 0) {
      declare()
      stack.pop()
      continue
    }
    buffer += char
  }
  declare()
  return [{ ...root, prelude: ':scope' }]
}

const references = (value: string) =>
  [...value.matchAll(/var\(\s*(--[\w-]+)/g)].map((match) => match[1] as string)

const topLevel = (theme: ThemeFile[]) =>
  theme.flatMap(({ path, rules }) =>
    rules.flatMap((rule) =>
      rule.children.map((child) => ({ path, rule: child })),
    ),
  )

const isTokenBlock = (rule: CssRule) =>
  rule.declarations.some(([property]) => property === tokenBlockMarker)

const isPresetScope = (rule: CssRule) =>
  rule.prelude.includes('data-theme-preset') || /^:root\b/.test(rule.prelude)

export function themeContract(theme: ThemeFile[]) {
  const themeBlocks = topLevel(theme).filter(({ rule }) =>
    /^@theme\b/.test(rule.prelude),
  )
  const keys = new Set(
    themeBlocks.flatMap(({ rule }) =>
      rule.declarations.map(([property]) => property),
    ),
  )
  const color = new Set<string>()
  const shared = new Set<string>()
  for (const { rule } of themeBlocks) {
    if (!rule.prelude.includes('inline')) continue
    for (const [property, value] of rule.declarations)
      for (const name of references(value)) {
        if (keys.has(name) && name !== property) continue
        if (tailwindNamespaces.test(name)) continue
        ;(property.startsWith('--color-') ? color : shared).add(name)
      }
  }
  for (const name of color) shared.delete(name)
  return { color, shared, keys }
}

export function checkTheme(theme: ThemeFile[]): string[] {
  const problems: string[] = []
  const rules = topLevel(theme)
  const { color, shared, keys } = themeContract(theme)
  const declared = new Set(
    rules.flatMap(({ rule }) =>
      rule.declarations
        .map(([property]) => property)
        .filter((property) => property.startsWith('--')),
    ),
  )

  for (const { path, rule } of rules) {
    const at = rule.prelude.match(/^@([\w-]+)\s*([\w-]*)/)
    if (at?.[1] === 'utility')
      problems.push(
        `${path}: ${rule.prelude} declares a utility; the theme declares tokens, and components read them through the utilities Tailwind generates`,
      )
    if (at?.[1] === 'layer' && at[2] !== 'base')
      problems.push(
        `${path}: @layer ${at[2]} overrides utilities by source order; declare a token in :root and .dark and map it in @theme inline`,
      )
    if (at) continue

    const tokenBlock = isTokenBlock(rule)
    for (const [property] of rule.declarations) {
      if (property.startsWith('--')) continue
      if (tokenBlock && tokenBlockProperties.has(property)) continue
      problems.push(
        `${path}: ${rule.prelude} sets ${property}; outside @layer base a theme rule only declares tokens`,
      )
    }

    if (tokenBlock) {
      const dark = rule.prelude.includes('.dark')
      const required = dark ? color : new Set([...color, ...shared])
      const own = new Set(rule.declarations.map(([property]) => property))
      for (const name of required)
        if (!own.has(name))
          problems.push(
            `${path}: ${rule.prelude} does not declare ${name}, which @theme inline reads; every ${dark ? 'dark' : 'light'} theme block declares the whole contract`,
          )
    } else if (!isPresetScope(rule)) {
      for (const [property] of rule.declarations)
        if (
          property.startsWith('--') &&
          !color.has(property) &&
          !shared.has(property)
        )
          problems.push(
            `${path}: ${rule.prelude} sets ${property}, which is not a theme token; a scoped rule only remaps tokens @theme inline reads`,
          )
    }

    for (const [, value] of rule.declarations)
      for (const name of references(value))
        if (!declared.has(name) && !tailwindNamespaces.test(name))
          problems.push(
            `${path}: ${rule.prelude} reads ${name}, which no theme block declares`,
          )
  }

  for (const name of [...color, ...shared])
    if (!declared.has(name) && !keys.has(name))
      problems.push(
        `@theme inline reads ${name}, which no theme block declares`,
      )
  return problems
}

const assignedInCode = (source: string) =>
  [
    ...source.matchAll(/\[(--[\w-]+):/g),
    ...source.matchAll(/['"`](--[\w-]+)['"`]/g),
    ...source.matchAll(/(?:^|[\s{;])(--[\w-]+)\s*:/gm),
  ].map((match) => match[1] as string)

export function checkCode(
  theme: ThemeFile[],
  sources: { path: string; source: string }[],
): string[] {
  const declared = new Set(
    topLevel(theme).flatMap(({ rule }) =>
      rule.declarations.map(([property]) => property),
    ),
  )
  const assigned = new Set(
    sources.flatMap(({ source }) => assignedInCode(source)),
  )
  const problems: string[] = []
  for (const { path, source } of sources)
    source.split('\n').forEach((line, index) => {
      for (const match of line.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)) {
        const name = match[1] as string
        if (
          declared.has(name) ||
          assigned.has(name) ||
          tailwindNamespaces.test(name) ||
          baseUiRuntime.test(name)
        )
          continue
        problems.push(
          `${path}:${index + 1}: reads ${name}, which no theme block declares and no code assigns`,
        )
      }
    })
  return problems
}

export async function readTheme(root = themeRoot): Promise<ThemeFile[]> {
  const paths = [
    join(root, 'styles.css'),
    ...(await files(join(root, 'themes'))).filter((path) =>
      path.endsWith('.css'),
    ),
  ]
  return Promise.all(
    paths.map(async (path) => ({
      path,
      rules: parseCss(await readFile(path, 'utf8')),
    })),
  )
}

if (import.meta.main) {
  const theme = await readTheme()
  const sources = await Promise.all(
    (
      await Promise.all(
        codeRoots.filter((root) => existsSync(root)).map((root) => files(root)),
      )
    )
      .flat()
      .filter((path) => /\.(ts|tsx)$/.test(path))
      .map(async (path) => ({ path, source: await readFile(path, 'utf8') })),
  )
  const problems = [...checkTheme(theme), ...checkCode(theme, sources)]
  if (problems.length) {
    console.error(problems.join('\n'))
    process.exit(1)
  }
  const { color, shared } = themeContract(theme)
  console.log(
    `Theme verified: ${color.size + shared.size} tokens in ${theme.length} files, ${sources.length} source files read them.`,
  )
}
