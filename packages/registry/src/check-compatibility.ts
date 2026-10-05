import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import ts from 'typescript'
import type { RegistryItem } from './manifest'

export interface CompatibilityReport {
  status: 'compatible' | 'incompatible' | 'inconclusive'
  diagnostics: string[]
  pending: string[]
  deferred: string[]
  existingFiles: string[]
}
/** Version of a package as Node resolves it from the consumer root. */
function installedVersion(root: string, name: string): string | undefined {
  for (let directory = root; ; directory = dirname(directory)) {
    const manifest = join(directory, 'node_modules', name, 'package.json')
    if (existsSync(manifest))
      return JSON.parse(readFileSync(manifest, 'utf8')).version
    if (dirname(directory) === directory) return undefined
  }
}

/** Same major, and same minor below 1.0, as semver ranges treat them. */
function compatibleVersion(installed: string, declared: string) {
  const [major, minor] = installed.match(/\d+/g) ?? []
  const [wantedMajor, wantedMinor] = declared.match(/\d+/g) ?? []
  return major === wantedMajor && (major !== '0' || minor === wantedMinor)
}

/**
 * Item dependencies the consumer does not have yet in a compatible version.
 * shadcn installs them, so before that their types say nothing about the
 * consumer: another major can sit in node_modules, e.g. shadcn's own zod 3.
 */
export function pendingDependencies(root: string, item: RegistryItem) {
  const pending: { name: string; declared: string; installed?: string }[] = []
  for (const dependency of item.dependencies) {
    const separator = dependency.lastIndexOf('@')
    if (separator <= 0) continue
    const name = dependency.slice(0, separator)
    const declared = dependency.slice(separator + 1)
    const installed = installedVersion(root, name)
    if (!installed || !compatibleVersion(installed, declared))
      pending.push({ name, declared, installed })
  }
  return pending
}

export async function checkCompatibility(
  root: string,
  item: RegistryItem,
  installed = false,
): Promise<CompatibilityReport> {
  const config = ts.findConfigFile(root, ts.sys.fileExists)
  if (!config)
    return {
      status: 'inconclusive',
      diagnostics: ['No tsconfig.json was found.'],
      pending: [],
      deferred: [],
      existingFiles: [],
    }
  const read = ts.readConfigFile(config, ts.sys.readFile)
  if (read.error)
    return {
      status: 'inconclusive',
      diagnostics: ['Cannot read the consumer tsconfig.json.'],
      pending: [],
      deferred: [],
      existingFiles: [],
    }
  const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, root)
  const pending = installed ? [] : pendingDependencies(root, item)
  const options: ts.CompilerOptions = {
    ...parsed.options,
    noEmit: true,
    skipLibCheck: true,
    // Before installing, anything unavailable becomes any; the implicit any
    // that follows is not a consumer incompatibility.
    ...(installed ? {} : { noImplicitAny: false }),
  }
  const virtual = new Map<string, string>()
  const existingFiles: string[] = []
  for (const file of item.files) {
    if (!file.target?.startsWith('~/'))
      throw new Error(`Invalid target: ${file.target}`)
    const path = resolve(root, file.target.slice(2))
    if (ts.sys.fileExists(path)) existingFiles.push(path)
    if (/\.tsx?$/.test(path)) {
      const existingUI =
        !file.path.startsWith('parttens/') && ts.sys.fileExists(path)
      if (!installed && !existingUI) virtual.set(path, file.content)
    }
  }
  const host = ts.createCompilerHost(options)
  const originalRead = host.readFile.bind(host)
  const originalExists = host.fileExists.bind(host)
  const originalDirectories = host.directoryExists?.bind(host)
  host.readFile = (file) => virtual.get(resolve(file)) ?? originalRead(file)
  host.fileExists = (file) => virtual.has(resolve(file)) || originalExists(file)
  host.directoryExists = (directory) =>
    [...virtual.keys()].some((file) =>
      file.startsWith(`${resolve(directory)}/`),
    ) || Boolean(originalDirectories?.(directory))
  const blocked = (specifier: string) =>
    pending.some(
      ({ name }) => specifier === name || specifier.startsWith(`${name}/`),
    )
  const cache = ts.createModuleResolutionCache(
    root,
    host.getCanonicalFileName,
    options,
  )
  host.resolveModuleNameLiterals = (
    literals,
    containingFile,
    redirectedReference,
    compilerOptions,
    containingSourceFile,
  ) =>
    literals.map((literal) =>
      blocked(literal.text)
        ? { resolvedModule: undefined }
        : ts.resolveModuleName(
            literal.text,
            containingFile,
            compilerOptions,
            host,
            cache,
            redirectedReference,
            ts.getModeForUsageLocation(
              containingSourceFile,
              literal,
              compilerOptions,
            ),
          ),
    )
  host.getSourceFile = (file, languageVersion) => {
    const content = host.readFile(file)
    return content === undefined
      ? undefined
      : ts.createSourceFile(file, content, languageVersion, true)
  }
  const roots = item.files
    .map((file) => file.target)
    .filter((target): target is string =>
      Boolean(target && /\.tsx?$/.test(target)),
    )
    .map((target) => resolve(root, target.slice(2)))
  const program = ts.createProgram(roots, options, host)
  const diagnostics = ts.getPreEmitDiagnostics(program)
  const unavailable = new Set([2307, 2688, 2882, 6053, 7016])
  const duplicatedTypes = (diagnostic: ts.Diagnostic) =>
    ts
      .flattenDiagnosticMessageText(diagnostic.messageText, ' ')
      .includes('Two different types with this name exist')
  const incompatible = diagnostics.some(
    (diagnostic) =>
      !unavailable.has(diagnostic.code) && !duplicatedTypes(diagnostic),
  )
  const describe = (diagnostic: ts.Diagnostic) => {
    const position =
      diagnostic.file && diagnostic.start !== undefined
        ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
        : null
    return `${diagnostic.file?.fileName ?? 'TypeScript'}${position ? `:${position.line + 1}` : ''} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`
  }
  const pendingLines = pending.map(
    ({ name, declared, installed: found }) =>
      `${name}@${declared} is not installed yet${found ? ` (found ${found})` : ''}; its types are checked after installation.`,
  )
  return {
    status: incompatible
      ? 'incompatible'
      : diagnostics.length
        ? 'inconclusive'
        : 'compatible',
    diagnostics: [...pendingLines, ...diagnostics.map(describe)],
    pending: pendingLines,
    deferred: diagnostics
      .filter(
        (diagnostic) =>
          unavailable.has(diagnostic.code) || duplicatedTypes(diagnostic),
      )
      .map(describe),
    existingFiles,
  }
}
