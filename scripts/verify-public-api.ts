import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import ts from 'typescript'

const configuration = ts.readConfigFile('tsconfig.json', ts.sys.readFile)
const parsed = ts.parseJsonConfigFileContent(
  configuration.config,
  ts.sys,
  process.cwd(),
)
const sourceProgram = ts.createProgram(parsed.fileNames, parsed.options)
const checker = sourceProgram.getTypeChecker()
const modules = {
  ui: 'packages/ui/src/index.ts',
  utils: 'packages/utils/src/index.ts',
  components: 'packages/parttens/src/components.ts',
  blocks: 'packages/parttens/src/blocks.ts',
  parttens: 'packages/parttens/src/index.ts',
}
const snapshot: Record<string, string[]> = {}
for (const [name, file] of Object.entries(modules)) {
  const source = sourceProgram.getSourceFile(resolve(file))
  const symbol = source && checker.getSymbolAtLocation(source)
  if (!symbol) throw new Error(`No public module: ${file}`)
  snapshot[name] = checker
    .getExportsOfModule(symbol)
    .map((value) => value.name)
    .sort()
  const runtime = await import(
    resolve(
      `dist/library/${name === 'ui' || name === 'utils' ? name : 'parttens'}/src/${name === 'components' || name === 'blocks' ? name : 'index'}.js`,
    )
  )
  for (const key of Object.keys(runtime)) {
    if (!snapshot[name].includes(key))
      throw new Error(`Unexpected runtime export ${name}/${key}`)
  }
}
const legacyPath = 'docs/architecture/public-api-exports.json'
if (process.argv.includes('--record')) {
  await writeFile(legacyPath, `${JSON.stringify(snapshot, null, 2)}\n`)
} else {
  const baseline: Record<string, string[]> = JSON.parse(
    await readFile(legacyPath, 'utf8'),
  )
  for (const [module, names] of Object.entries(baseline)) {
    for (const name of names)
      if (!snapshot[module]?.includes(name))
        throw new Error(`Missing export: ${module}/${name}`)
  }
}
console.log(
  `Verified public exports and runtime imports across ${Object.keys(modules).length} entries.`,
)
