import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import ts from 'typescript'
import { patternNames } from '../packages/registry/src/manifest'
import {
  type Consumer,
  createConsumer,
  installPatterns,
  saveReport,
} from './consumer'

// Every pattern installs into the example consumer, compiles against its COSS
// and leaves its UI untouched. Two runs check that the generated barrel keeps
// earlier patterns and, once all are installed, exports the workspace
// aggregate's public API.
const baseline: Record<string, string[]> = JSON.parse(
  await readFile('docs/architecture/public-api-exports.json', 'utf8'),
)
function barrelExports(consumer: Consumer) {
  const config = ts.readConfigFile(
    join(consumer.root, 'tsconfig.json'),
    ts.sys.readFile,
  )
  const { options, fileNames } = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    consumer.root,
  )
  const program = ts.createProgram(fileNames, options)
  const source = program.getSourceFile(
    join(consumer.root, consumer.patterns, 'index.ts'),
  )
  const checker = program.getTypeChecker()
  const symbol = source && checker.getSymbolAtLocation(source)
  if (!symbol) throw new Error('The CLI did not generate the patterns barrel')
  return checker
    .getExportsOfModule(symbol)
    .map(({ name }) => name)
    .sort()
}
function expectExports(actual: string[], expected: string[], when: string) {
  const missing = expected.filter((name) => !actual.includes(name))
  const extra = actual.filter((name) => !expected.includes(name))
  if (missing.length || extra.length)
    throw new Error(
      `Barrel after ${when}: missing ${missing.join(', ') || 'none'}; unexpected ${extra.join(', ') || 'none'}`,
    )
}
const all = baseline.parttens ?? []
const first = ['collection-views', 'properties']
const later = patternNames.filter((name) => !first.includes(name))
const firstNames = new Set(first.flatMap((name) => baseline[name] ?? []))
const laterOnly = new Set(
  later
    .flatMap((name) => baseline[name] ?? [])
    .filter((name) => !firstNames.has(name)),
)
const consumer = await createConsumer('consumer-registry')
let installedFiles = await installPatterns(consumer, first)
expectExports(
  barrelExports(consumer),
  all.filter((name) => !laterOnly.has(name)),
  first.join(' and '),
)
installedFiles = await installPatterns(consumer, later)
expectExports(barrelExports(consumer), all, 'every pattern')
await saveReport('consumer-registry', {
  passed: true,
  patterns: patternNames,
  installedFiles,
  patternsPath: consumer.patterns,
  barrelExports: all.length,
  uiUntouched: consumer.ui,
})
