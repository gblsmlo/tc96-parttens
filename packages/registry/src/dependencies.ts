import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

/** Version of a package as Node resolves it from the consumer root. */
export function installedVersion(
  root: string,
  name: string,
): string | undefined {
  for (let directory = root; ; directory = dirname(directory)) {
    const manifest = join(directory, 'node_modules', name, 'package.json')
    if (existsSync(manifest))
      return JSON.parse(readFileSync(manifest, 'utf8')).version
    if (dirname(directory) === directory) return undefined
  }
}

/** Same major, and same minor below 1.0, as semver ranges treat them. */
export function compatibleVersion(installed: string, declared: string) {
  const [major, minor] = installed.match(/\d+/g) ?? []
  const [wantedMajor, wantedMinor] = declared.match(/\d+/g) ?? []
  return major === wantedMajor && (major !== '0' || minor === wantedMinor)
}

/** Splits "name@range" into its parts; COSS lists some without a range. */
export function parseDependency(dependency: string) {
  const separator = dependency.lastIndexOf('@')
  return separator > 0
    ? {
        name: dependency.slice(0, separator),
        declared: dependency.slice(separator + 1),
      }
    : { name: dependency, declared: undefined }
}

function declaredDependencies(root: string) {
  const manifest = join(root, 'package.json')
  if (!existsSync(manifest)) return new Set<string>()
  const fields = JSON.parse(readFileSync(manifest, 'utf8'))
  return new Set(
    [
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].flatMap((field) => Object.keys(fields[field] ?? {})),
  )
}

/**
 * Dependencies the consumer's package.json does not declare, or that are
 * missing or incompatible once installed, once per package. A package found
 * only as a transitive dependency or above the root can resolve to a second
 * copy, so it is installed too. A declared range wins over a bare name.
 */
export function missingDependencies(
  root: string,
  dependencies: string[],
  target?: DependencyTarget,
) {
  const wanted = new Map<string, string | undefined>()
  for (const dependency of dependencies) {
    const { name, declared } = parseDependency(dependency)
    if (!wanted.has(name) || declared) wanted.set(name, declared)
  }
  const owner = target ? join(root, target.directory) : root
  const own = new Set([
    ...declaredDependencies(root),
    ...declaredDependencies(owner),
  ])
  return [...wanted]
    .filter(([name, declared]) => {
      const installed = own.has(name) && installedVersion(owner, name)
      return !installed || (declared && !compatibleVersion(installed, declared))
    })
    .map(([name, declared]) => (declared ? `${name}@${declared}` : name))
    .sort()
}

export type DependencyTarget = { directory: string; name: string }

function isWorkspaceRoot(root: string) {
  const manifest = join(root, 'package.json')
  return (
    existsSync(join(root, 'pnpm-workspace.yaml')) ||
    (existsSync(manifest) &&
      JSON.parse(readFileSync(manifest, 'utf8')).workspaces !== undefined)
  )
}

/** The workspace package that owns a directory, when it is not the root. */
export function dependencyTarget(
  root: string,
  directory: string,
): DependencyTarget | undefined {
  if (!isWorkspaceRoot(root)) return undefined
  for (
    let current = join(root, directory);
    current !== root && current !== dirname(current);
    current = dirname(current)
  ) {
    const manifest = join(current, 'package.json')
    if (existsSync(manifest))
      return {
        directory: relative(root, current).replaceAll('\\', '/'),
        name: String(JSON.parse(readFileSync(manifest, 'utf8')).name ?? ''),
      }
  }
  return undefined
}

export type PackageManager = 'bun' | 'pnpm' | 'yarn' | 'npm'

export function detectPackageManager(root: string): PackageManager {
  const manifest = join(root, 'package.json')
  const declared = existsSync(manifest)
    ? String(
        JSON.parse(readFileSync(manifest, 'utf8')).packageManager ?? '',
      ).split('@')[0]
    : ''
  if (declared === 'bun' || declared === 'pnpm' || declared === 'yarn')
    return declared
  if (declared === 'npm') return 'npm'
  if (['bun.lock', 'bun.lockb'].some((file) => existsSync(join(root, file))))
    return 'bun'
  if (existsSync(join(root, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(join(root, 'yarn.lock'))) return 'yarn'
  return 'npm'
}

export function installCommand(
  root: string,
  manager: PackageManager,
  dependencies: string[],
  target?: DependencyTarget,
) {
  if (target) {
    if (manager === 'npm')
      return ['npm', 'install', '-w', target.directory, ...dependencies]
    if (manager === 'yarn' && target.name)
      return ['yarn', 'workspace', target.name, 'add', ...dependencies]
    if (manager === 'pnpm')
      return ['pnpm', 'add', '--dir', target.directory, ...dependencies]
    if (manager === 'bun')
      return ['bun', 'add', '--cwd', target.directory, ...dependencies]
  }
  if (manager === 'npm') return ['npm', 'install', ...dependencies]
  const workspaceRoot =
    manager === 'pnpm' && existsSync(join(root, 'pnpm-workspace.yaml'))
      ? ['-w']
      : []
  return [manager, 'add', ...workspaceRoot, ...dependencies]
}

export function installDependencies(
  root: string,
  dependencies: string[],
  target?: DependencyTarget,
) {
  const command = installCommand(
    root,
    detectPackageManager(root),
    dependencies,
    target,
  )
  console.log(`Installing dependencies: ${command.join(' ')}`)
  const result = spawnSync(command[0] as string, command.slice(1), {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (result.status !== 0)
    throw new Error(
      `Installing dependencies failed (${result.status ?? result.error ?? result.signal}). The files were written; run it yourself: ${command.join(' ')}`,
    )
}
