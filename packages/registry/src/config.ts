import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import ts from 'typescript'
import {
  type Aliases,
  type InstallConfig,
  type PathName,
  pathNames,
  validateConfig,
} from './manifest'

const requiredAliasNames = ['ui', 'utils'] as const

type RawAliases = Partial<Aliases> & { templates?: unknown; elements?: unknown }

const rawAliases = (components: unknown): RawAliases =>
  (components as { aliases?: RawAliases } | null)?.aliases ?? {}
const isAlias = (value: unknown): value is string =>
  typeof value === 'string' && value !== ''
const deriveAlias = (ui: string, name: string) =>
  ui.includes('/') ? `${ui.slice(0, ui.lastIndexOf('/'))}/${name}` : name

// The consumer's components.json is the only configuration. ui and utils are
// its standard aliases; helpers, patterns and blocks are tc96 keys read from
// the same aliases object. When one is absent it is derived from the ui alias
// by replacing its last segment, so "@acme/ui/components" yields "@acme/ui/patterns".
// A components.json from before the rename keeps working: aliases.templates
// stands in for an absent aliases.blocks.
export function readAliases(components: unknown): Aliases {
  const aliases = rawAliases(components)
  const missing = requiredAliasNames.filter((name) => !isAlias(aliases[name]))
  if (missing.length)
    throw new Error(
      `components.json is missing ${missing.map((name) => `aliases.${name}`).join(', ')}. tc96 needs the ui and utils aliases that shadcn init writes. shadcn init --force rewrites components.json; review the ui alias.`,
    )
  const { ui, utils } = aliases as Pick<Aliases, 'ui' | 'utils'>
  const pick = (name: 'helpers' | 'patterns' | 'blocks') => {
    const alias = aliases[name]
    if (isAlias(alias)) return alias
    if (name === 'blocks' && isAlias(aliases.templates))
      return aliases.templates
    return deriveAlias(ui, name)
  }
  return {
    ui,
    utils,
    helpers: pick('helpers'),
    patterns: pick('patterns'),
    blocks: pick('blocks'),
  }
}

// Files are written where the tsconfig resolves each alias.
export function resolveAliasPath(
  root: string,
  alias: string,
  options: ts.CompilerOptions,
  suggestion?: string,
): string {
  const pattern = options.paths?.[`${alias}/*`]?.[0]
  if (!pattern?.endsWith('/*'))
    throw new Error(
      `tsconfig.json paths has no "${alias}/*" entry; add one pointing to the directory of that alias${suggestion ? `, e.g. "${alias}/*": ["${suggestion}/*"]` : ''}.`,
    )
  const base = (options.baseUrl ?? options.pathsBasePath ?? root) as string
  const path = relative(root, resolve(base, pattern.slice(0, -2)))
  if (!path || path.startsWith('..') || isAbsolute(path))
    throw new Error(`"${alias}/*" must resolve inside the consumer workspace.`)
  return path.replaceAll('\\', '/')
}

/** Where the tsconfig resolves an alias, or undefined when it does not. */
export function findAliasPath(
  root: string,
  alias: string,
  options: ts.CompilerOptions,
): string | undefined {
  try {
    return resolveAliasPath(root, alias, options)
  } catch {
    return undefined
  }
}

export function findProjectRoot(start: string): string {
  let directory = resolve(start)
  while (!existsSync(join(directory, 'components.json'))) {
    const parent = dirname(directory)
    if (parent === directory) return resolve(start)
    directory = parent
  }
  return directory
}

interface Project {
  components: unknown
  aliases: Aliases
  options: ts.CompilerOptions
}

async function readProject(root: string): Promise<Project> {
  const componentsPath = join(root, 'components.json')
  if (!existsSync(componentsPath))
    throw new Error(
      `No components.json found in ${root} or any parent directory. Create it at the project root, or pass --cwd with the directory that holds it.`,
    )
  const components = JSON.parse(await readFile(componentsPath, 'utf8'))
  const aliases = readAliases(components)
  const tsconfig = ts.findConfigFile(root, ts.sys.fileExists)
  const read = tsconfig && ts.readConfigFile(tsconfig, ts.sys.readFile)
  if (!read || read.error)
    throw new Error('Cannot read the consumer tsconfig.json.')
  const { options } = ts.parseJsonConfigFileContent(read.config, ts.sys, root)
  return { components, aliases, options }
}

interface BlocksLocation {
  alias: string
  path?: string
  legacy?: { templates: string; blocks: string }
}

// A blocks alias that was derived, not written in components.json, may meet a
// tsconfig that still has the old templates entry: the blocks go there.
function locateBlocks(
  { components, aliases, options }: Project,
  root: string,
): BlocksLocation {
  const raw = rawAliases(components)
  const path = findAliasPath(root, aliases.blocks, options)
  const derived = !isAlias(raw.blocks) && !isAlias(raw.templates)
  if (path !== undefined || !derived) return { alias: aliases.blocks, path }
  const templates = deriveAlias(aliases.ui, 'templates')
  const templatesPath = findAliasPath(root, templates, options)
  if (options.paths?.[`${aliases.blocks}/*`] || templatesPath === undefined)
    return { alias: aliases.blocks, path }
  return {
    alias: templates,
    path: templatesPath,
    legacy: { templates, blocks: aliases.blocks },
  }
}

/** The blocks directory the consumer has, relative to root, without requiring one. */
export async function findBlocksPath(
  root: string,
): Promise<string | undefined> {
  try {
    return locateBlocks(await readProject(root), root).path
  } catch {
    return undefined
  }
}

function legacyWarnings(
  root: string,
  { components, aliases, options }: Project,
): string[] {
  const raw = rawAliases(components)
  const warnings: string[] = []
  if (!isAlias(raw.blocks) && isAlias(raw.templates))
    warnings.push(
      'components.json aliases.templates is deprecated; rename it to aliases.blocks.',
    )
  const elements = isAlias(raw.elements)
    ? raw.elements
    : deriveAlias(aliases.ui, 'elements')
  const elementsPath = findAliasPath(root, elements, options)
  if (
    isAlias(raw.elements) ||
    (elementsPath !== undefined && existsSync(join(root, elementsPath)))
  )
    warnings.push(
      `tc96 no longer installs elements: Text and IconFrame come from your ui alias (${aliases.ui}/text, ${aliases.ui}/icon-frame). Files in ${elementsPath ?? elements} from earlier installs are no longer imported by tc96 patterns; remove them once your code stops importing them.`,
    )
  return warnings
}

// The blocks path is read only when a block is installed, so a consumer
// that installs patterns alone needs no blocks entry in its tsconfig.
export async function readInstallConfig(
  root: string,
  { blocks = false } = {},
): Promise<InstallConfig & { warnings: string[] }> {
  const project = await readProject(root)
  const { aliases, options } = project
  const warnings = legacyWarnings(root, project)
  const uiPath = resolveAliasPath(root, aliases.ui, options)
  const uiSegments = uiPath.split('/')
  const nested = aliases.ui.split('/').at(-1) === uiSegments.at(-1)
  const suggestPath = (name: string) =>
    nested
      ? [...uiSegments.slice(0, -1), name].join('/')
      : uiSegments
          .map((segment) => (segment === 'ui' ? name : segment))
          .join('/')
  const resolveSibling = (name: Exclude<PathName, 'ui'> | 'blocks') =>
    resolveAliasPath(root, aliases[name], options, `./${suggestPath(name)}`)
  const paths = Object.fromEntries(
    pathNames.map((name) => [
      name,
      name === 'ui' ? uiPath : resolveSibling(name),
    ]),
  ) as InstallConfig['paths']
  if (blocks) {
    const location = locateBlocks(project, root)
    if (location.legacy && location.path !== undefined) {
      aliases.blocks = location.alias
      paths.blocks = location.path
      warnings.push(
        `tsconfig.json paths has "${location.legacy.templates}/*" but no "${location.legacy.blocks}/*"; blocks are written to the templates path for now. Rename the entry to "${location.legacy.blocks}/*".`,
      )
    } else paths.blocks = resolveSibling('blocks')
  }
  return { ...validateConfig({ aliases, paths }), warnings }
}

/** The stylesheet that components.json names, relative to root. */
export async function readStylesheet(root: string) {
  const components = JSON.parse(
    await readFile(join(root, 'components.json'), 'utf8'),
  )
  const css = components?.tailwind?.css
  return typeof css === 'string' && css ? css : undefined
}
