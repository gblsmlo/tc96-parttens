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

// The consumer's components.json is the only configuration. shadcn defines
// ui and utils; elements, helpers and patterns are tc96 keys read from the same
// aliases object. When one is absent it is derived from the ui alias by
// replacing its last segment, so "@acme/ui" yields "@acme/patterns".
export function readAliases(components: unknown): Aliases {
  const aliases =
    (components as { aliases?: Partial<Aliases> } | null)?.aliases ?? {}
  const missing = requiredAliasNames.filter(
    (name) => typeof aliases[name] !== 'string' || !aliases[name],
  )
  if (missing.length)
    throw new Error(
      `components.json is missing ${missing.map((name) => `aliases.${name}`).join(', ')}. tc96 needs the ui and utils aliases that shadcn init writes. shadcn init --force rewrites components.json; review the ui alias.`,
    )
  const { ui, utils } = aliases as Pick<Aliases, 'ui' | 'utils'>
  const derive = (name: string) =>
    ui.includes('/') ? `${ui.slice(0, ui.lastIndexOf('/'))}/${name}` : name
  const pick = (name: 'elements' | 'helpers' | 'patterns') =>
    typeof aliases[name] === 'string' && aliases[name]
      ? aliases[name]
      : derive(name)
  return {
    ui,
    utils,
    elements: pick('elements'),
    helpers: pick('helpers'),
    patterns: pick('patterns'),
  }
}

// Files are written where the tsconfig resolves each alias, as shadcn does.
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

export function findProjectRoot(start: string): string {
  let directory = resolve(start)
  while (!existsSync(join(directory, 'components.json'))) {
    const parent = dirname(directory)
    if (parent === directory) return resolve(start)
    directory = parent
  }
  return directory
}

export async function readInstallConfig(root: string): Promise<InstallConfig> {
  const componentsPath = join(root, 'components.json')
  if (!existsSync(componentsPath))
    throw new Error(
      `No components.json found in ${root} or any parent directory. Create it at the project root, or pass --cwd with the directory that holds it.`,
    )
  const aliases = readAliases(
    JSON.parse(await readFile(componentsPath, 'utf8')),
  )
  const tsconfig = ts.findConfigFile(root, ts.sys.fileExists)
  const read = tsconfig && ts.readConfigFile(tsconfig, ts.sys.readFile)
  if (!read || read.error)
    throw new Error('Cannot read the consumer tsconfig.json.')
  const { options } = ts.parseJsonConfigFileContent(read.config, ts.sys, root)
  const uiPath = resolveAliasPath(root, aliases.ui, options)
  const paths = Object.fromEntries(
    pathNames.map((name) => [
      name,
      name === 'ui'
        ? uiPath
        : resolveAliasPath(
            root,
            aliases[name],
            options,
            `./${uiPath
              .split('/')
              .map((segment) => (segment === 'ui' ? name : segment))
              .join('/')}`,
          ),
    ]),
  ) as Record<PathName, string>
  return validateConfig({ aliases, paths })
}
