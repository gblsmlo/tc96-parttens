import { resolve } from 'node:path'
import ts from 'typescript'
import type { RegistryItem } from './manifest'

export interface CompatibilityReport {
  status: 'compatible' | 'incompatible' | 'inconclusive'
  diagnostics: string[]
  existingFiles: string[]
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
      existingFiles: [],
    }
  const read = ts.readConfigFile(config, ts.sys.readFile)
  if (read.error)
    return {
      status: 'inconclusive',
      diagnostics: ['Cannot read the consumer tsconfig.json.'],
      existingFiles: [],
    }
  const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, root)
  const options = { ...parsed.options, noEmit: true, skipLibCheck: true }
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
  const unavailable = new Set([2307, 2688, 6053, 7016])
  const incompatible = diagnostics.some(
    (diagnostic) => !unavailable.has(diagnostic.code),
  )
  return {
    status: incompatible
      ? 'incompatible'
      : diagnostics.length
        ? 'inconclusive'
        : 'compatible',
    diagnostics: diagnostics.map((diagnostic) => {
      const position =
        diagnostic.file && diagnostic.start !== undefined
          ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
          : null
      return `${diagnostic.file?.fileName ?? 'TypeScript'}${position ? `:${position.line + 1}` : ''} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`
    }),
    existingFiles,
  }
}
