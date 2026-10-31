import { isAbsolute, normalize } from 'node:path'
import ts from 'typescript'

export const patternNames = [
  'collection',
  'properties',
  'editable',
  'checklist',
  'record-dialog',
  'record-preview',
  'record-group',
  'widgets',
  'rich-text-editor',
  'state-surface',
  'settings',
  'chats-panel',
  'wizard',
  'flow-canvas',
  'flow-step-library',
  'flow-inspector',
  'chat-assistant',
] as const
export type PatternName = (typeof patternNames)[number]
/** Folder under packages/parttens/src, kept as the path in the consumer. */
export const patternSources: Record<PatternName, string> = {
  collection: 'collection',
  properties: 'properties',
  editable: 'editable',
  checklist: 'checklist',
  'record-dialog': 'records/dialog',
  'record-preview': 'records/preview',
  'record-group': 'records/group',
  widgets: 'widgets',
  'rich-text-editor': 'rich-text-editor',
  'state-surface': 'surfaces/state',
  settings: 'surfaces/settings',
  'chats-panel': 'chat/chats-panel',
  wizard: 'wizard',
  'flow-canvas': 'flow/canvas',
  'flow-step-library': 'flow/step-library',
  'flow-inspector': 'flow/inspector',
  'chat-assistant': 'chat/assistant',
}
export const templateNames = [
  'app-shell-1',
  'app-shell-2',
  'app-shell-3',
  'app-shell-4',
  'workflow-editor',
  'agent-builder',
] as const
export type TemplateName = (typeof templateNames)[number]
/** Folder under packages/templates/src, kept as the path in the consumer. */
export const templateSources: Record<TemplateName, string> = {
  'app-shell-1': 'application/shell/app-shell-1',
  'app-shell-2': 'application/shell/app-shell-2',
  'app-shell-3': 'application/shell/app-shell-3',
  'app-shell-4': 'application/shell/app-shell-4',
  'workflow-editor': 'application/flow/workflow-editor',
  'agent-builder': 'application/flow/agent-builder',
}
export type ItemName = PatternName | TemplateName
export function isTemplate(name: string): name is TemplateName {
  return templateNames.includes(name as TemplateName)
}
/** The consumer's components.json aliases the patterns import from. */
export interface Aliases {
  ui: string
  utils: string
  elements: string
  helpers: string
  patterns: string
  templates: string
}
export const aliasNames = [
  'ui',
  'utils',
  'elements',
  'helpers',
  'patterns',
  'templates',
] as const
/**
 * Directories the aliases resolve to. Only elements, helpers and patterns are
 * written;
 * ui is read to find the COSS components the consumer already has.
 */
export const pathNames = ['ui', 'elements', 'helpers', 'patterns'] as const
export type PathName = (typeof pathNames)[number]
export interface InstallConfig {
  aliases: Aliases
  /** templates is resolved only when a template is installed. */
  paths: Record<PathName, string> & { templates?: string }
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
  /** COSS components, as @coss/<item>; the CLI installs the missing ones. */
  registryDependencies?: string[]
  $schema?: string
}
export const defaultConfig: InstallConfig = {
  aliases: {
    ui: '@tc96/ui',
    utils: '@tc96/utils',
    elements: '@tc96/elements',
    helpers: '@tc96/helpers',
    patterns: '@tc96/patterns',
    templates: '@tc96/templates',
  },
  paths: {
    ui: 'packages/ui/src',
    elements: 'packages/elements/src',
    helpers: 'packages/helpers/src',
    patterns: 'packages/patterns/src',
    templates: 'packages/templates/src',
  },
}
export function selectItems(names: string[]): ItemName[] {
  if (!names.length) throw new Error('Choose at least one pattern or template.')
  return [
    ...new Set(
      names.map((name) => {
        const resolved = name === 'view' ? 'collection' : name
        if (
          !patternNames.includes(resolved as PatternName) &&
          !isTemplate(resolved)
        )
          throw new Error(`Unknown pattern or template: ${name}`)
        return resolved as ItemName
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
  for (const name of [...pathNames, 'templates'] as const) {
    const destination = value.paths?.[name]
    if (name === 'templates' && destination === undefined) continue
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
  const destinations: Record<string, string | undefined> = {
    parttens: config.paths.patterns,
    elements: config.paths.elements,
    helpers: config.paths.helpers,
    templates: config.paths.templates,
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
            /^@tc96\/(ui|utils|elements|helpers|parttens|patterns|templates)(\/.*)?$/,
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
// The consumer owns its COSS components, customized or not: the ones it
// already has are left out, so only the missing ones are installed.
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
