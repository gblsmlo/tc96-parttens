import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import ts from 'typescript'
import { patternNames } from '../packages/registry/src/manifest'

// The public API is what a consumer imports from the patterns alias: each
// pattern barrel the registry installs, and the aggregate entry.
const modules: Record<string, string> = {
  ...Object.fromEntries(
    patternNames.map((name) => [
      name,
      `packages/parttens/src/${name}/index.ts`,
    ]),
  ),
  parttens: 'packages/parttens/src/index.ts',
}
const configuration = ts.readConfigFile('tsconfig.json', ts.sys.readFile)
const parsed = ts.parseJsonConfigFileContent(
  configuration.config,
  ts.sys,
  process.cwd(),
)
const sourceProgram = ts.createProgram(parsed.fileNames, parsed.options)
const checker = sourceProgram.getTypeChecker()
const snapshot: Record<string, string[]> = {}
for (const [name, file] of Object.entries(modules)) {
  const source = sourceProgram.getSourceFile(resolve(file))
  const symbol = source && checker.getSymbolAtLocation(source)
  if (!symbol) throw new Error(`No public module: ${file}`)
  const exported = checker
    .getExportsOfModule(symbol)
    .map((value) => value.name)
    .sort()
  snapshot[name] = exported
  for (const key of Object.keys(await import(resolve(file))))
    if (!exported.includes(key))
      throw new Error(`Unexpected runtime export ${name}/${key}`)
}
const baselinePath = 'docs/architecture/public-api-exports.json'
if (process.argv.includes('--record')) {
  await writeFile(baselinePath, `${JSON.stringify(snapshot, null, 2)}\n`)
} else {
  const baseline: Record<string, string[]> = JSON.parse(
    await readFile(baselinePath, 'utf8'),
  )
  for (const [module, names] of Object.entries(baseline)) {
    if (!snapshot[module]) throw new Error(`Missing public module: ${module}`)
    for (const name of names)
      if (!snapshot[module].includes(name))
        throw new Error(`Missing export: ${module}/${name}`)
  }
}
console.log(
  `Verified public exports and runtime imports across ${Object.keys(modules).length} entries.`,
)
