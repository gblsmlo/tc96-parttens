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
  'record-status-list',
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
  'list',
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
  'record-status-list': 'status-list',
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
  list: 'list',
}
export const blockNames = [
  'app-shell-1',
  'app-shell-2',
  'app-shell-3',
  'app-shell-4',
  'login-1',
  'login-2',
  'otp-1',
  'signup-1',
  'signup-2',
  'reset-password-1',
  'reset-password-2',
  'forgot-password-1',
  'forgot-password-2',
  'workflow-editor',
  'agent-builder',
  'settings-1',
  'settings-2',
  'settings-3',
  'settings-4',
  'settings-5',
  'settings-6',
  'settings-7',
  'settings-8',
  'settings-9',
  'settings-10',
  'settings-11',
  'settings-12',
  'settings-13',
  'settings-14',
  'settings-15',
  'settings-16',
  'settings-17',
  'settings-18',
  'settings-19',
  'settings-20',
  'settings-21',
  'settings-22',
  'settings-23',
  'stats-1',
  'stats-2',
  'stats-3',
  'stats-4',
  'stats-5',
  'stats-6',
  'card-1',
  'card-2',
  'card-3',
  'card-4',
  'card-5',
  'card-6',
] as const
export type BlockName = (typeof blockNames)[number]
/** Folder under packages/blocks/src, kept as the path in the consumer. */
export const blockSources: Record<BlockName, string> = {
  'app-shell-1': 'application/shell/app-shell-1',
  'app-shell-2': 'application/shell/app-shell-2',
  'app-shell-3': 'application/shell/app-shell-3',
  'app-shell-4': 'application/shell/app-shell-4',
  'login-1': 'auth/login-1',
  'login-2': 'auth/login-2',
  'otp-1': 'auth/otp-1',
  'signup-1': 'auth/signup-1',
  'signup-2': 'auth/signup-2',
  'reset-password-1': 'auth/reset-password-1',
  'reset-password-2': 'auth/reset-password-2',
  'forgot-password-1': 'auth/forgot-password-1',
  'forgot-password-2': 'auth/forgot-password-2',
  'workflow-editor': 'ai-agents/flow/workflow-editor',
  'agent-builder': 'ai-agents/flow/agent-builder',
  'settings-1': 'application/settings/settings-1',
  'settings-2': 'application/settings/settings-2',
  'settings-3': 'application/settings/settings-3',
  'settings-4': 'application/settings/settings-4',
  'settings-5': 'application/settings/settings-5',
  'settings-6': 'application/settings/settings-6',
  'settings-7': 'application/settings/settings-7',
  'settings-8': 'application/settings/settings-8',
  'settings-9': 'application/settings/settings-9',
  'settings-10': 'application/settings/settings-10',
  'settings-11': 'application/settings/settings-11',
  'settings-12': 'application/settings/settings-12',
  'settings-13': 'application/settings/settings-13',
  'settings-14': 'application/settings/settings-14',
  'settings-15': 'application/settings/settings-15',
  'settings-16': 'application/settings/settings-16',
  'settings-17': 'application/settings/settings-17',
  'settings-18': 'application/settings/settings-18',
  'settings-19': 'application/settings/settings-19',
  'settings-20': 'application/settings/settings-20',
  'settings-21': 'application/settings/settings-21',
  'settings-22': 'application/settings/settings-22',
  'settings-23': 'application/settings/settings-23',
  'stats-1': 'application/stats/stats-1',
  'stats-2': 'application/stats/stats-2',
  'stats-3': 'application/stats/stats-3',
  'stats-4': 'application/stats/stats-4',
  'stats-5': 'application/stats/stats-5',
  'stats-6': 'application/stats/stats-6',
  'card-1': 'application/card/card-1',
  'card-2': 'application/card/card-2',
  'card-3': 'application/card/card-3',
  'card-4': 'application/card/card-4',
  'card-5': 'application/card/card-5',
  'card-6': 'application/card/card-6',
}
export type ItemName = PatternName | BlockName
/** Areas under packages/parttens/src that ship with an item no file of it imports. */
export const itemAreas: Partial<Record<ItemName, string[]>> = {
  collection: ['toolbar'],
}
export function isBlock(name: string): name is BlockName {
  return blockNames.includes(name as BlockName)
}
/** The consumer's components.json aliases the patterns import from. */
export interface Aliases {
  ui: string
  utils: string
  helpers: string
  patterns: string
  blocks: string
}
export const aliasNames = [
  'ui',
  'utils',
  'helpers',
  'patterns',
  'blocks',
] as const
/**
 * Directories the aliases resolve to. Only helpers and patterns are written;
 * ui is read to find the COSS components the consumer already has.
 */
export const pathNames = ['ui', 'helpers', 'patterns'] as const
export type PathName = (typeof pathNames)[number]
export interface InstallConfig {
  aliases: Aliases
  /** blocks is resolved only when a block is installed. */
  paths: Record<PathName, string> & { blocks?: string }
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
  /** ui components, as @ui/<item>; the CLI installs the missing ones. */
  registryDependencies?: string[]
  $schema?: string
}
export const defaultConfig: InstallConfig = {
  aliases: {
    ui: '@tc96/ui',
    utils: '@tc96/utils',
    helpers: '@tc96/helpers',
    patterns: '@tc96/patterns',
    blocks: '@tc96/blocks',
  },
  paths: {
    ui: 'packages/ui/src',
    helpers: 'packages/helpers/src',
    patterns: 'packages/patterns/src',
    blocks: 'packages/blocks/src',
  },
}
export function selectItems(names: string[]): ItemName[] {
  if (!names.length) throw new Error('Choose at least one pattern or block.')
  return [
    ...new Set(
      names.map((name) => {
        const resolved = name === 'view' ? 'collection' : name
        if (
          !patternNames.includes(resolved as PatternName) &&
          !isBlock(resolved)
        )
          throw new Error(`Unknown pattern or block: ${name}`)
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
  for (const name of [...pathNames, 'blocks'] as const) {
    const destination = value.paths?.[name]
    if (name === 'blocks' && destination === undefined) continue
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
    helpers: config.paths.helpers,
    blocks: config.paths.blocks,
  }
  const aliases: Record<string, string> = {
    ...config.aliases,
    parttens: config.aliases.patterns,
    blocks: config.aliases.blocks,
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
            /^@tc96\/(ui|utils|helpers|parttens|patterns|blocks)(\/.*)?$/,
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
export function uiDependency(item: string) {
  return `@ui/${item}`
}
// The consumer owns its ui components, customized or not: the ones it
// already has are left out, so only the missing ones are installed.
export function omitInstalled(
  item: RegistryItem,
  installed: (component: string) => boolean,
): RegistryItem {
  return {
    ...item,
    registryDependencies: (item.registryDependencies ?? []).filter(
      (dependency) => {
        const [, component] = dependency.match(/^@ui\/(.+)$/) ?? []
        return !component || !installed(component)
      },
    ),
  }
}
