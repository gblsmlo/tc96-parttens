import { isAbsolute, normalize } from 'node:path'
import ts from 'typescript'

export const patternNames = [
  'collection-views',
  'properties',
  'detail-sheet',
  'editable',
  'checklist',
] as const
export type PatternName = (typeof patternNames)[number]
/** The consumer's components.json aliases the patterns import from. */
export interface Aliases {
  ui: string
  utils: string
  elements: string
  patterns: string
}
export const aliasNames = ['ui', 'utils', 'elements', 'patterns'] as const
/**
 * Directories the aliases resolve to. Only elements and patterns are written;
 * ui is read to find the COSS components the consumer already has.
 */
export const pathNames = ['ui', 'elements', 'patterns'] as const
export type PathName = (typeof pathNames)[number]
export interface InstallConfig {
  aliases: Aliases
  paths: Record<PathName, string>
}
export interface RegistryFile {
  path: string
  type: string
  content: string
  target?: string
}
export interface RegistryItem {
  name: string
  type: string
  files: RegistryFile[]
  dependencies: string[]
  /** COSS components, as @coss/<item>; shadcn installs the missing ones. */
  registryDependencies?: string[]
  $schema?: string
}
export const defaultConfig: InstallConfig = {
  aliases: {
    ui: '@tc96/ui',
    utils: '@tc96/utils',
    elements: '@tc96/elements',
    patterns: '@tc96/patterns',
  },
  paths: {
    ui: 'packages/ui/src',
    elements: 'packages/elements/src',
    patterns: 'packages/patterns/src',
  },
}
export function selectPatterns(names: string[]): PatternName[] {
  if (!names.length) throw new Error('Choose at least one pattern.')
  return [
    ...new Set(
      names.map((name) => {
        const resolved = name === 'view' ? 'collection-views' : name
        if (!patternNames.includes(resolved as PatternName))
          throw new Error(`Unknown pattern: ${name}`)
        return resolved as PatternName
      }),
    ),
  ]
}
export function validateConfig(value: InstallConfig): InstallConfig {
  for (const name of aliasNames) {
    const alias = value.aliases?.[name]
    if (typeof alias !== 'string' || !/^[@#a-zA-Z]/.test(alias))
      throw new Error(`Invalid ${name} alias.`)
  }
  for (const name of pathNames) {
    const destination = value.paths?.[name]
    if (typeof destination !== 'string')
      throw new Error(`Invalid ${name} path.`)
    const path = normalize(destination).replaceAll('\\', '/')
    if (
      isAbsolute(path) ||
      path === '.' ||
      path.startsWith('../') ||
      path.includes('/node_modules/')
    ) {
      throw new Error(`${name} path must be inside the consumer workspace.`)
    }
  }
  return value
}
/** Fails when an item would ship the consumer's UI, its cn, or a theme. */
export function assertDistributable(item: RegistryItem) {
  for (const file of item.files) {
    const [pkg] = file.path.split('/')
    if (pkg === 'ui' || pkg === 'utils')
      throw new Error(
        `${item.name}: ${file.path} belongs to the consumer and is not distributed.`,
      )
    const theme = file.content.match(/:root|\.dark\b|@theme|@utility/)
    if (theme)
      throw new Error(
        `${item.name}: ${file.path} redefines the theme (${theme[0]}).`,
      )
  }
}
export function prepareItem(
  item: RegistryItem,
  configuration: InstallConfig,
): RegistryItem {
  const config = validateConfig(configuration)
  assertDistributable(item)
  const destinations: Record<string, string> = {
    parttens: config.paths.patterns,
    elements: config.paths.elements,
  }
  const aliases: Record<string, string> = {
    ...config.aliases,
    parttens: config.aliases.patterns,
  }
  return {
    ...item,
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    files: item.files.map((file) => {
      const [pkg, src, ...suffix] = file.path.split('/')
      const destination = destinations[pkg ?? '']
      if (!destination || src !== 'src' || suffix.includes('..'))
        throw new Error(`Invalid registry path: ${file.path}`)
      const ast = ts.createSourceFile(
        file.path,
        file.content,
        ts.ScriptTarget.Latest,
        true,
      )
      const edits: { start: number; end: number; value: string }[] = []
      function visit(node: ts.Node) {
        if (
          (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
          node.moduleSpecifier &&
          ts.isStringLiteral(node.moduleSpecifier)
        ) {
          const match = node.moduleSpecifier.text.match(
            /^@tc96\/(ui|utils|elements|parttens)(\/.*)?$/,
          )
          if (match) {
            const alias = aliases[match[1] ?? '']
            if (alias)
              edits.push({
                start: node.moduleSpecifier.getStart(ast) + 1,
                end: node.moduleSpecifier.getEnd() - 1,
                value: alias + (match[2] ?? ''),
              })
          }
        }
        ts.forEachChild(node, visit)
      }
      visit(ast)
      let content = file.content
      for (const edit of edits.sort((a, b) => b.start - a.start))
        content =
          content.slice(0, edit.start) + edit.value + content.slice(edit.end)
      return {
        ...file,
        content,
        type: 'registry:file',
        target: `~/${destination}/${suffix.join('/')}`,
      }
    }),
  }
}
export function combineItems(items: RegistryItem[]): RegistryItem {
  const files = new Map<string, RegistryFile>()
  for (const item of items)
    for (const file of item.files) {
      const existing = files.get(file.path)
      if (existing && existing.content !== file.content)
        throw new Error(`Conflicting shared file: ${file.path}`)
      files.set(file.path, file)
    }
  return {
    name: 'tc96-selected-patterns',
    type: 'registry:block',
    files: [...files.values()].sort((a, b) => a.path.localeCompare(b.path)),
    dependencies: [
      ...new Set(items.flatMap((item) => item.dependencies)),
    ].sort(),
    registryDependencies: [
      ...new Set(items.flatMap((item) => item.registryDependencies ?? [])),
    ].sort(),
  }
}
export function cossDependency(item: string) {
  return `@coss/${item}`
}
// shadcn asks before overwriting a COSS component the consumer customized,
// even with --yes, and stops without a terminal. Components the consumer
// already has are left out, so it only installs the missing ones.
export function omitInstalled(
  item: RegistryItem,
  installed: (component: string) => boolean,
): RegistryItem {
  return {
    ...item,
    registryDependencies: (item.registryDependencies ?? []).filter(
      (dependency) => {
        const [, component] = dependency.match(/^@coss\/(.+)$/) ?? []
        return !component || !installed(component)
      },
    ),
  }
}
