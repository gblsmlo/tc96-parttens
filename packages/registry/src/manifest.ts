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
  'stats',
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
  'charts',
] as const
export type PatternName = (typeof patternNames)[number]
/** Folder under packages/ui/src/patterns, kept as the path in the consumer. */
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
  stats: 'stats',
  charts: 'charts',
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
  'flow-1',
  'flow-2',
  'settings-account-1',
  'settings-preference-1',
  'settings-preference-2',
  'settings-preference-3',
  'settings-workspace-1',
  'settings-workspace-2',
  'settings-catalog-1',
  'settings-catalog-2',
  'settings-catalog-3',
  'settings-catalog-4',
  'settings-catalog-5',
  'settings-catalog-6',
  'settings-catalog-7',
  'settings-catalog-8',
  'settings-catalog-9',
  'settings-catalog-10',
  'settings-security-1',
  'settings-role-permission-1',
  'settings-integration-1',
  'settings-notification-channel-1',
  'settings-integration-2',
  'settings-integration-3',
  'settings-integration-4',
  'settings-integration-5',
  'settings-integration-6',
  'settings-integration-7',
  'settings-integration-8',
  'settings-account-2',
  'stats-1',
  'stats-2',
  'stats-3',
  'stats-4',
  'stats-5',
  'stats-6',
  'stats-7',
  'card-1',
  'card-2',
  'card-3',
  'card-4',
  'card-5',
  'card-6',
  'card-7',
  'card-8',
  'card-9',
  'list-1',
  'list-2',
  'list-3',
  'list-4',
  'list-5',
  'list-6',
  'empty-state-1',
  'empty-state-2',
  'empty-state-3',
  'empty-state-4',
  'empty-state-5',
  'empty-state-6',
  'timeline-1',
  'timeline-2',
  'timeline-3',
  'timeline-4',
  'navbar-1',
  'navbar-2',
  'navbar-3',
  'navbar-4',
  'navbar-5',
  'navbar-6',
  'navbar-7',
  'navbar-8',
  'navbar-9',
  'navbar-10',
  'navbar-11',
  'navbar-12',
  'rich-text-editor-1',
  'rich-text-editor-2',
  'rich-text-editor-3',
  'rich-text-editor-4',
  'rich-text-editor-5',
  'onboarding-1',
  'onboarding-2',
  'onboarding-3',
  'dashboard-1',
  'dashboard-2',
  'dashboard-3',
  'dashboard-4',
  'login-3',
  'login-4',
  'login-5',
  'login-6',
  'login-7',
  'login-8',
  'login-9',
  'login-10',
  'signup-3',
  'signup-6',
  'reset-password-6',
  'magic-link-6',
  'flow-3',
  'flow-4',
  'ai-chat-1',
  'support-1',
  'support-2',
  'support-3',
  'support-4',
  'team-1',
  'team-2',
  'revenue-1',
  'revenue-2',
  'revenue-3',
  'revenue-4',
  'inventory-1',
  'inventory-2',
  'projects-1',
  'projects-2',
  'projects-3',
  'tasks-1',
  'tasks-2',
  'tasks-3',
  'tasks-4',
  'finance-1',
  'finance-2',
  'finance-3',
  'marketing-1',
  'marketing-2',
  'legal-1',
  'legal-2',
  'legal-3',
  'legal-4',
  'legal-5',
  'legal-6',
  'legal-7',
  'legal-8',
  'legal-9',
  'inbox-1',
  'crm-1',
  'crm-2',
  'crm-3',
  'dashboard-7',
  'dashboard-6',
  'dashboard-5',
  'documents-1',
  'agenda-1',
  'record-dialog-1',
  'record-dialog-2',
  'record-dialog-3',
  'record-dialog-4',
  'record-dialog-5',
  'record-dialog-6',
  'record-dialog-7',
] as const
export type BlockName = (typeof blockNames)[number]
/** Folder under packages/ui/src/blocks; the consumer receives it without the category. */
export const blockSources: Record<BlockName, string> = {
  'app-shell-1': 'application/shell/app-shell-1',
  'app-shell-2': 'application/shell/app-shell-2',
  'app-shell-3': 'application/shell/app-shell-3',
  'app-shell-4': 'application/shell/app-shell-4',
  'login-1': 'application/auth/login-1',
  'login-2': 'application/auth/login-2',
  'otp-1': 'application/auth/otp-1',
  'signup-1': 'application/auth/signup-1',
  'signup-2': 'application/auth/signup-2',
  'reset-password-1': 'application/auth/reset-password-1',
  'reset-password-2': 'application/auth/reset-password-2',
  'forgot-password-1': 'application/auth/forgot-password-1',
  'forgot-password-2': 'application/auth/forgot-password-2',
  'flow-1': 'application/flow/flow-1',
  'flow-2': 'application/flow/flow-2',
  'settings-account-1': 'application/settings/account/settings-account-1',
  'settings-preference-1':
    'application/settings/preference/settings-preference-1',
  'settings-preference-2':
    'application/settings/preference/settings-preference-2',
  'settings-preference-3':
    'application/settings/preference/settings-preference-3',
  'settings-workspace-1': 'application/settings/workspace/settings-workspace-1',
  'settings-workspace-2': 'application/settings/workspace/settings-workspace-2',
  'settings-catalog-1': 'application/settings/catalog/settings-catalog-1',
  'settings-catalog-2': 'application/settings/catalog/settings-catalog-2',
  'settings-catalog-3': 'application/settings/catalog/settings-catalog-3',
  'settings-catalog-4': 'application/settings/catalog/settings-catalog-4',
  'settings-catalog-5': 'application/settings/catalog/settings-catalog-5',
  'settings-catalog-6': 'application/settings/catalog/settings-catalog-6',
  'settings-catalog-7': 'application/settings/catalog/settings-catalog-7',
  'settings-catalog-8': 'application/settings/catalog/settings-catalog-8',
  'settings-catalog-9': 'application/settings/catalog/settings-catalog-9',
  'settings-catalog-10': 'application/settings/catalog/settings-catalog-10',
  'settings-security-1': 'application/settings/security/settings-security-1',
  'settings-role-permission-1':
    'application/settings/role-permission/settings-role-permission-1',
  'settings-integration-1':
    'application/settings/integration/settings-integration-1',
  'settings-notification-channel-1':
    'application/settings/notification-channel/settings-notification-channel-1',
  'settings-integration-2':
    'application/settings/integration/settings-integration-2',
  'settings-integration-3':
    'application/settings/integration/settings-integration-3',
  'settings-integration-4':
    'application/settings/integration/settings-integration-4',
  'settings-integration-5':
    'application/settings/integration/settings-integration-5',
  'settings-integration-6':
    'application/settings/integration/settings-integration-6',
  'settings-integration-7':
    'application/settings/integration/settings-integration-7',
  'settings-integration-8':
    'application/settings/integration/settings-integration-8',
  'settings-account-2': 'application/settings/account/settings-account-2',
  'stats-1': 'application/stats/stats-1',
  'stats-2': 'application/stats/stats-2',
  'stats-3': 'application/stats/stats-3',
  'stats-4': 'application/stats/stats-4',
  'stats-5': 'application/stats/stats-5',
  'stats-6': 'application/stats/stats-6',
  'stats-7': 'application/stats/stats-7',
  'card-1': 'application/card/card-1',
  'card-2': 'application/card/card-2',
  'card-3': 'application/card/card-3',
  'card-4': 'application/card/card-4',
  'card-5': 'application/card/card-5',
  'card-6': 'application/card/card-6',
  'card-7': 'application/card/card-7',
  'card-8': 'application/card/card-8',
  'card-9': 'application/card/card-9',
  'list-1': 'application/list/list-1',
  'list-2': 'application/list/list-2',
  'list-3': 'application/list/list-3',
  'list-4': 'application/list/list-4',
  'list-5': 'application/list/list-5',
  'list-6': 'application/list/list-6',
  'empty-state-1': 'application/empty-state/empty-state-1',
  'empty-state-2': 'application/empty-state/empty-state-2',
  'empty-state-3': 'application/empty-state/empty-state-3',
  'empty-state-4': 'application/empty-state/empty-state-4',
  'empty-state-5': 'application/empty-state/empty-state-5',
  'empty-state-6': 'application/empty-state/empty-state-6',
  'timeline-1': 'application/timeline/timeline-1',
  'timeline-2': 'application/timeline/timeline-2',
  'timeline-3': 'application/timeline/timeline-3',
  'timeline-4': 'application/timeline/timeline-4',
  'navbar-1': 'application/navbar/navbar-1',
  'navbar-2': 'application/navbar/navbar-2',
  'navbar-3': 'application/navbar/navbar-3',
  'navbar-4': 'application/navbar/navbar-4',
  'navbar-5': 'application/navbar/navbar-5',
  'navbar-6': 'application/navbar/navbar-6',
  'navbar-7': 'application/navbar/navbar-7',
  'navbar-8': 'application/navbar/navbar-8',
  'navbar-9': 'application/navbar/navbar-9',
  'navbar-10': 'application/navbar/navbar-10',
  'navbar-11': 'application/navbar/navbar-11',
  'navbar-12': 'application/navbar/navbar-12',
  'rich-text-editor-1': 'application/rich-text-editor/rich-text-editor-1',
  'rich-text-editor-2': 'application/rich-text-editor/rich-text-editor-2',
  'rich-text-editor-3': 'application/rich-text-editor/rich-text-editor-3',
  'rich-text-editor-4': 'application/rich-text-editor/rich-text-editor-4',
  'rich-text-editor-5': 'application/rich-text-editor/rich-text-editor-5',
  'onboarding-1': 'application/onboarding/onboarding-1',
  'onboarding-2': 'application/onboarding/onboarding-2',
  'onboarding-3': 'application/onboarding/onboarding-3',
  'dashboard-1': 'application/dashboard/dashboard-1',
  'dashboard-2': 'application/dashboard/dashboard-2',
  'dashboard-3': 'application/dashboard/dashboard-3',
  'dashboard-4': 'application/dashboard/dashboard-4',
  'login-3': 'application/auth/login-3',
  'login-4': 'application/auth/login-4',
  'login-5': 'application/auth/login-5',
  'login-6': 'application/auth/login-6',
  'login-7': 'application/auth/login-7',
  'login-8': 'application/auth/login-8',
  'login-9': 'application/auth/login-9',
  'login-10': 'application/auth/login-10',
  'signup-3': 'application/auth/signup-3',
  'signup-6': 'application/auth/signup-6',
  'reset-password-6': 'application/auth/reset-password-6',
  'magic-link-6': 'application/auth/magic-link-6',
  'flow-3': 'application/flow/flow-3',
  'flow-4': 'application/flow/flow-4',
  'ai-chat-1': 'ai-agents/ai-chat/ai-chat-1',
  'support-1': 'data/support/support-1',
  'support-2': 'data/support/support-2',
  'support-3': 'data/support/support-3',
  'support-4': 'data/support/support-4',
  'team-1': 'data/team/team-1',
  'team-2': 'data/team/team-2',
  'revenue-1': 'data/revenue/revenue-1',
  'revenue-2': 'data/revenue/revenue-2',
  'revenue-3': 'data/revenue/revenue-3',
  'revenue-4': 'data/revenue/revenue-4',
  'inventory-1': 'data/inventory/inventory-1',
  'inventory-2': 'data/inventory/inventory-2',
  'projects-1': 'data/projects/projects-1',
  'projects-2': 'data/projects/projects-2',
  'projects-3': 'data/projects/projects-3',
  'tasks-1': 'data/tasks/tasks-1',
  'tasks-2': 'data/tasks/tasks-2',
  'tasks-3': 'data/tasks/tasks-3',
  'tasks-4': 'data/tasks/tasks-4',
  'finance-1': 'data/finance/finance-1',
  'finance-2': 'data/finance/finance-2',
  'finance-3': 'data/finance/finance-3',
  'marketing-1': 'data/marketing/marketing-1',
  'marketing-2': 'data/marketing/marketing-2',
  'legal-1': 'data/legal/legal-1',
  'legal-2': 'data/legal/legal-2',
  'legal-3': 'data/legal/legal-3',
  'legal-4': 'data/legal/legal-4',
  'legal-5': 'data/legal/legal-5',
  'legal-6': 'data/legal/legal-6',
  'legal-7': 'data/legal/legal-7',
  'legal-8': 'data/legal/legal-8',
  'legal-9': 'data/legal/legal-9',
  'inbox-1': 'data/inbox/inbox-1',
  'crm-1': 'data/crm/crm-1',
  'crm-2': 'data/crm/crm-2',
  'crm-3': 'data/crm/crm-3',
  'dashboard-7': 'application/dashboard/dashboard-7',
  'dashboard-6': 'application/dashboard/dashboard-6',
  'dashboard-5': 'application/dashboard/dashboard-5',
  'documents-1': 'data/documents/documents-1',
  'agenda-1': 'data/agenda/agenda-1',
  'record-dialog-1': 'application/record-dialog/record-dialog-1',
  'record-dialog-2': 'application/record-dialog/record-dialog-2',
  'record-dialog-3': 'application/record-dialog/record-dialog-3',
  'record-dialog-4': 'application/record-dialog/record-dialog-4',
  'record-dialog-5': 'application/record-dialog/record-dialog-5',
  'record-dialog-6': 'application/record-dialog/record-dialog-6',
  'record-dialog-7': 'application/record-dialog/record-dialog-7',
}
export type ItemName = PatternName | BlockName
/** Areas under packages/ui/src/patterns that ship with an item no file of it imports. */
export const itemAreas: Partial<Record<ItemName, string[]>> = {
  collection: [
    'collection-pagination',
    'toolbar',
    'view-settings-menu',
    'view-switcher',
  ],
}
export function isBlock(name: string): name is BlockName {
  return blockNames.includes(name as BlockName)
}
/** The consumer's components.json aliases the patterns import from. */
export interface Aliases {
  ui: string
  utils: string
  hooks: string
  lib: string
  helpers: string
  patterns: string
  blocks: string
}
export const aliasNames = [
  'ui',
  'utils',
  'hooks',
  'lib',
  'helpers',
  'patterns',
  'blocks',
] as const
/**
 * Directories the aliases resolve to. ui, hooks and lib receive the missing
 * ui components; helpers and patterns receive the patterns.
 */
export const pathNames = ['ui', 'hooks', 'lib', 'helpers', 'patterns'] as const
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
/** The tc96-mono layout: one @tc96/ui package holding every layer, and @tc96/utils. */
export const defaultConfig: InstallConfig = {
  aliases: {
    ui: '@tc96/ui',
    utils: '@tc96/utils',
    hooks: '@tc96/ui/hooks',
    lib: '@tc96/ui/lib',
    helpers: '@tc96/ui/helpers',
    patterns: '@tc96/ui/patterns',
    blocks: '@tc96/ui/blocks',
  },
  paths: {
    ui: 'packages/ui/src/components',
    hooks: 'packages/ui/src/hooks',
    lib: 'packages/ui/src/lib',
    helpers: 'packages/ui/src/helpers',
    patterns: 'packages/ui/src/patterns',
    blocks: 'packages/ui/src/blocks',
  },
}
/** Registry file paths start with one of these folders of packages/ui/src. */
export const distributedLayers = ['patterns', 'helpers', 'blocks'] as const
type DistributedLayer = (typeof distributedLayers)[number]
const isDistributedLayer = (value: string): value is DistributedLayer =>
  distributedLayers.includes(value as DistributedLayer)
/** The alias an @tc96 import of the repo maps to, and the rest of the specifier. */
export function repoImportAlias(
  specifier: string,
): { alias: keyof Aliases; rest: string } | undefined {
  if (specifier === '@tc96/utils' || specifier.startsWith('@tc96/utils/'))
    return { alias: 'utils', rest: specifier.slice('@tc96/utils'.length) }
  const rest = specifier.match(/^@tc96\/ui(\/.*)$/)?.[1]
  if (!rest) return undefined
  const [, layer = '', tail = ''] = rest.match(/^\/([^/]+)(\/.*)?$/) ?? []
  if (isDistributedLayer(layer) || layer === 'hooks' || layer === 'lib')
    return { alias: layer, rest: tail }
  return { alias: 'ui', rest }
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
    const [layer = ''] = file.path.split('/')
    if (!isDistributedLayer(layer))
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
// The block category organizes the repo and Storybook; the consumer gets <group>/<block>.
const withoutBlockCategory = (rest: string) => rest.replace(/^\/[^/]+/, '')
export function prepareItem(
  item: RegistryItem,
  configuration: InstallConfig,
): RegistryItem {
  const config = validateConfig(configuration)
  assertDistributable(item)
  const destinations: Record<DistributedLayer, string | undefined> = {
    patterns: config.paths.patterns,
    helpers: config.paths.helpers,
    blocks: config.paths.blocks,
  }
  return {
    ...item,
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    files: item.files.map((file) => {
      const [layer = '', ...suffix] = file.path.split('/')
      const destination = isDistributedLayer(layer)
        ? destinations[layer]
        : undefined
      if (!destination || !suffix.length || suffix.includes('..'))
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
          const match = repoImportAlias(node.moduleSpecifier.text)
          if (match)
            edits.push({
              start: node.moduleSpecifier.getStart(ast) + 1,
              end: node.moduleSpecifier.getEnd() - 1,
              value:
                config.aliases[match.alias] +
                (match.alias === 'blocks'
                  ? withoutBlockCategory(match.rest)
                  : match.rest),
            })
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
        target: `~/${destination}/${(layer === 'blocks' ? suffix.slice(1) : suffix).join('/')}`,
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
