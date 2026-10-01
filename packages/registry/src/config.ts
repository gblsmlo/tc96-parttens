import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { isAbsolute, join, relative, resolve } from 'node:path'
import ts from 'typescript'
import {
  type Aliases,
  aliasNames,
  type DestinationName,
  destinationNames,
  type InstallConfig,
  validateConfig,
} from './manifest'

// The consumer's components.json is the only configuration. shadcn defines
// ui and utils; elements and patterns are tc96 keys added to the same aliases
// object, so they are read from the raw file.
export function readAliases(components: unknown): Aliases {
  const aliases =
    (components as { aliases?: Partial<Aliases> } | null)?.aliases ?? {}
  const missing = aliasNames.filter(
    (name) => typeof aliases[name] !== 'string' || !aliases[name],
  )
  if (missing.length)
    throw new Error(
      `components.json is missing ${missing.map((name) => `aliases.${name}`).join(', ')}. tc96 needs ui and utils from shadcn, plus elements and patterns, e.g. "elements": "@acme/elements" and "patterns": "@acme/patterns".`,
    )
  const { ui, utils, elements, patterns } = aliases as Aliases
  return { ui, utils, elements, patterns }
}

// Files are written where the tsconfig resolves each alias, as shadcn does.
export function resolveAliasPath(
  root: string,
  alias: string,
  options: ts.CompilerOptions,
): string {
  const pattern = options.paths?.[`${alias}/*`]?.[0]
  if (!pattern?.endsWith('/*'))
    throw new Error(
      `tsconfig.json paths has no "${alias}/*" entry; add one pointing to the directory of that alias.`,
    )
  const base = (options.baseUrl ?? options.pathsBasePath ?? root) as string
  const path = relative(root, resolve(base, pattern.slice(0, -2)))
  if (!path || path.startsWith('..') || isAbsolute(path))
    throw new Error(`"${alias}/*" must resolve inside the consumer workspace.`)
  return path.replaceAll('\\', '/')
}

export async function readInstallConfig(root: string): Promise<InstallConfig> {
  const componentsPath = join(root, 'components.json')
  if (!existsSync(componentsPath))
    throw new Error(
      'Configure shadcn components.json in the consumer workspace first.',
    )
  const aliases = readAliases(
    JSON.parse(await readFile(componentsPath, 'utf8')),
  )
  const tsconfig = ts.findConfigFile(root, ts.sys.fileExists)
  const read = tsconfig && ts.readConfigFile(tsconfig, ts.sys.readFile)
  if (!read || read.error)
    throw new Error('Cannot read the consumer tsconfig.json.')
  const { options } = ts.parseJsonConfigFileContent(read.config, ts.sys, root)
  const paths = Object.fromEntries(
    destinationNames.map((name) => [
      name,
      resolveAliasPath(root, aliases[name], options),
    ]),
  ) as Record<DestinationName, string>
  return validateConfig({ aliases, paths })
}
