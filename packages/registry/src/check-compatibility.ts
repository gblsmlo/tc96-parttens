import { resolve } from 'node:path'
import ts from 'typescript'
import {
  compatibleVersion,
  installedVersion,
  parseDependency,
} from './dependencies'
import type { RegistryItem } from './manifest'

export interface CompatibilityReport {
  status: 'compatible' | 'incompatible' | 'inconclusive'
  diagnostics: string[]
  pending: string[]
  deferred: string[]
  existingFiles: string[]
}
/**
 * Item dependencies the consumer does not have yet in a compatible version.
 * The CLI installs them, so before that their types say nothing about the
 * consumer: another major can sit in node_modules, brought by another package.
 */
export function pendingDependencies(root: string, item: RegistryItem) {
  const pending: { name: string; declared?: string; installed?: string }[] = []
  for (const dependency of item.dependencies) {
    const { name, declared } = parseDependency(dependency)
    const installed = installedVersion(root, name)
    if (!installed || (declared && !compatibleVersion(installed, declared)))
      pending.push({ name, declared, installed })
  }
  return pending
}

const unavailable = new Set([2307, 2688, 2882, 6053, 7016])
const duplicatedTypes = (diagnostic: ts.Diagnostic) =>
  ts
    .flattenDiagnosticMessageText(diagnostic.messageText, ' ')
    .includes('Two different types with this name exist')
const describe = (diagnostic: ts.Diagnostic) => {
  const position =
    diagnostic.file && diagnostic.start !== undefined
      ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
      : null
  return `${diagnostic.file?.fileName ?? 'TypeScript'}${position ? `:${position.line + 1}` : ''} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`
}

function readCompilerOptions(
  root: string,
): { options: ts.CompilerOptions } | { failure: string } {
  const config = ts.findConfigFile(root, ts.sys.fileExists)
  if (!config) return { failure: 'No tsconfig.json was found.' }
  const read = ts.readConfigFile(config, ts.sys.readFile)
  if (read.error) return { failure: 'Cannot read the consumer tsconfig.json.' }
  return {
    options: ts.parseJsonConfigFileContent(read.config, ts.sys, root).options,
  }
}

// virtual holds files that are not on disk yet; imports of the pending
// packages resolve to nothing until they are installed.
function createConsumerProgram(
  root: string,
  options: ts.CompilerOptions,
  roots: string[],
  virtual: Map<string, string>,
  pending: { name: string }[],
) {
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
  return ts.createProgram(roots, options, host)
}

/**
 * The diagnostics the consumer's own files already have, described like the
 * ones checkCompatibility reports. Dependents are the files that use the
 * items, such as installed blocks; what they report before the update is not
 * the update's fault, so checkCompatibility skips it through `known`.
 */
export function diagnoseDependents(
  root: string,
  dependents: string[],
): Set<string> {
  const loaded = readCompilerOptions(root)
  if ('failure' in loaded || !dependents.length) return new Set()
  const options: ts.CompilerOptions = {
    ...loaded.options,
    noEmit: true,
    skipLibCheck: true,
  }
  const program = createConsumerProgram(
    root,
    options,
    dependents.map((file) => resolve(file)),
    new Map(),
    [],
  )
  return new Set(ts.getPreEmitDiagnostics(program).map(describe))
}

export async function checkCompatibility(
  root: string,
  item: RegistryItem,
  installed = false,
  {
    dependents = [],
    known = new Set<string>(),
  }: { dependents?: string[]; known?: Set<string> } = {},
): Promise<CompatibilityReport> {
  const loaded = readCompilerOptions(root)
  if ('failure' in loaded)
    return {
      status: 'inconclusive',
      diagnostics: [loaded.failure],
      pending: [],
      deferred: [],
      existingFiles: [],
    }
  const pending = installed ? [] : pendingDependencies(root, item)
  const options: ts.CompilerOptions = {
    ...loaded.options,
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
        !/^(parttens|blocks)\//.test(file.path) && ts.sys.fileExists(path)
      if (!installed && !existingUI) virtual.set(path, file.content)
    }
  }
  const targets = item.files
    .map((file) => file.target)
    .filter((target): target is string =>
      Boolean(target && /\.tsx?$/.test(target)),
    )
    .map((target) => resolve(root, target.slice(2)))
  // A dependent that the item overwrites is already one of its roots.
  const roots = [
    ...targets,
    ...dependents
      .map((file) => resolve(file))
      .filter((file) => /\.tsx?$/.test(file) && !targets.includes(file)),
  ]
  const program = createConsumerProgram(root, options, roots, virtual, pending)
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .filter((diagnostic) => !known.has(describe(diagnostic)))
  const incompatible = diagnostics.some(
    (diagnostic) =>
      !unavailable.has(diagnostic.code) && !duplicatedTypes(diagnostic),
  )
  const pendingLines = pending.map(
    ({ name, declared, installed: found }) =>
      `${declared ? `${name}@${declared}` : name} is not installed yet${found ? ` (found ${found})` : ''}; its types are checked after installation.`,
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
