import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

export interface WorkspacePackage {
  /** Directory relative to the root, with forward slashes. */
  directory: string
  name: string
  exports?: unknown
}

function readJson(path: string): Record<string, unknown> | undefined {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return undefined
  }
}

function workspaceGlobs(root: string): string[] {
  const workspaces = readJson(join(root, 'package.json'))?.workspaces
  const globs = Array.isArray(workspaces)
    ? workspaces
    : (workspaces as { packages?: unknown } | undefined)?.packages
  return Array.isArray(globs)
    ? globs.filter((glob): glob is string => typeof glob === 'string')
    : []
}

// Only the forms a Bun workspace list uses: a directory, or a directory
// followed by /*.
function expand(root: string, glob: string): string[] {
  const clean = glob.replace(/^\.\//, '').replace(/\/$/, '')
  if (!clean.endsWith('/*')) return [clean]
  const parent = clean.slice(0, -2)
  if (!existsSync(join(root, parent))) return []
  return readdirSync(join(root, parent), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `${parent}/${entry.name}`)
}

/** The packages the root package.json lists in workspaces. */
export function workspacePackages(root: string): WorkspacePackage[] {
  return workspaceGlobs(root)
    .flatMap((glob) => expand(root, glob))
    .flatMap((directory) => {
      const manifest = readJson(join(root, directory, 'package.json'))
      return typeof manifest?.name === 'string'
        ? [{ directory, name: manifest.name, exports: manifest.exports }]
        : []
    })
}

function exportTarget(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return undefined
  const conditions = value as Record<string, unknown>
  for (const key of ['types', 'import', 'default'])
    if (typeof conditions[key] === 'string') return conditions[key] as string
  return Object.values(conditions).map(exportTarget).find(Boolean)
}

/**
 * The directory a workspace package exports an alias's subpaths from, read
 * from its "<subpath>/*" export ("./*": "./src/components/*.tsx" gives
 * src/components for the package name itself).
 */
export function exportedAliasPath(
  root: string,
  alias: string,
): string | undefined {
  const owner = workspacePackages(root)
    .filter(({ name }) => alias === name || alias.startsWith(`${name}/`))
    .sort((a, b) => b.name.length - a.name.length)[0]
  if (!owner?.exports || typeof owner.exports !== 'object') return undefined
  const subpath = `.${alias.slice(owner.name.length)}`
  const target = exportTarget(
    (owner.exports as Record<string, unknown>)[`${subpath}/*`],
  )
  const prefix = target?.slice(0, target.indexOf('*'))
  if (!prefix?.endsWith('/')) return undefined
  const path = relative(root, join(root, owner.directory, prefix))
  return path.replaceAll('\\', '/')
}

/**
 * Adds "<alias subpath>/<name>" for each folder component (<name>/index.ts)
 * when the alias resolves through package exports, whose "/*" entry only
 * reaches single files. Returns the keys it added.
 */
export function addFolderExports(
  root: string,
  alias: string,
  names: string[],
): string[] {
  const directory = exportedAliasPath(root, alias)
  const owner = workspacePackages(root)
    .filter(({ name }) => alias === name || alias.startsWith(`${name}/`))
    .sort((a, b) => b.name.length - a.name.length)[0]
  if (!directory || !owner) return []
  const manifestPath = join(root, owner.directory, 'package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const exports = manifest.exports as Record<string, unknown>
  const subpath = `.${alias.slice(owner.name.length)}`
  const added: string[] = []
  for (const name of names) {
    const key = `${subpath}/${name}`
    if (key in exports || !existsSync(join(root, directory, name, 'index.ts')))
      continue
    const target = relative(
      join(root, owner.directory),
      join(root, directory, name, 'index.ts'),
    )
    exports[key] = `./${target.replaceAll('\\', '/')}`
    added.push(key)
  }
  if (added.length)
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  return added
}
