import { isAbsolute, normalize } from 'node:path'
import ts from 'typescript'

export const patternNames = [
  'collection-views',
  'properties',
  'detail-sheet',
  'editable',
] as const
export type PatternName = (typeof patternNames)[number]
export interface Destination {
  path: string
  alias: string
}
export interface InstallConfig {
  patterns: Destination
  elements: Destination
  ui: Destination
  utils: Destination
}
const destinationNames = ['patterns', 'elements', 'ui', 'utils'] as const
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
  $schema?: string
}
export const defaultConfig: InstallConfig = {
  patterns: { path: 'packages/patterns/src', alias: '@tc96/patterns' },
  elements: { path: 'packages/elements/src', alias: '@tc96/elements' },
  ui: { path: 'packages/ui/src', alias: '@tc96/ui' },
  utils: { path: 'packages/utils/src', alias: '@tc96/utils' },
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
  for (const name of destinationNames) {
    const destination = value[name]
    if (
      !destination ||
      typeof destination.path !== 'string' ||
      typeof destination.alias !== 'string'
    ) {
      throw new Error(
        `Invalid ${name} destination; path and alias are required.`,
      )
    }
    const path = normalize(destination.path).replaceAll('\\', '/')
    if (
      isAbsolute(path) ||
      path === '.' ||
      path.startsWith('../') ||
      path.includes('/node_modules/')
    ) {
      throw new Error(`${name} path must be inside the consumer workspace.`)
    }
    if (!destination.alias || !/^[@#a-zA-Z]/.test(destination.alias))
      throw new Error(`Invalid ${name} alias.`)
  }
  return value
}
export function prepareItem(
  item: RegistryItem,
  configuration: InstallConfig,
): RegistryItem {
  const config = validateConfig(configuration)
  const destinations: Record<string, Destination> = {
    parttens: config.patterns,
    elements: config.elements,
    ui: config.ui,
    utils: config.utils,
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
            const target = destinations[match[1] ?? '']
            if (target)
              edits.push({
                start: node.moduleSpecifier.getStart(ast) + 1,
                end: node.moduleSpecifier.getEnd() - 1,
                value: target.alias + (match[2] ?? ''),
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
        target: `~/${destination.path}/${suffix.join('/')}`,
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
  }
}
