import { readFile, rm } from 'node:fs/promises'
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
// aggregate's public API. The consumer lacks one COSS component the patterns
// use, which shadcn installs from @coss; the ones it has are kept.
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
const missingComponent = 'empty'
const consumer = await createConsumer('consumer-registry')
await rm(join(consumer.root, consumer.ui, `${missingComponent}.tsx`))
const firstRun = await installPatterns(consumer, first)
const expectedUi = [join(consumer.ui, `${missingComponent}.tsx`)]
if (JSON.stringify(firstRun.addedUi) !== JSON.stringify(expectedUi))
  throw new Error(
    `Expected the CLI to add only ${expectedUi}, added: ${firstRun.addedUi.join(', ') || 'nothing'}`,
  )
expectExports(
  barrelExports(consumer),
  all.filter((name) => !laterOnly.has(name)),
  first.join(' and '),
)
const laterRun = await installPatterns(consumer, later)
if (laterRun.addedUi.length)
  throw new Error(`Unexpected COSS files: ${laterRun.addedUi.join(', ')}`)
expectExports(barrelExports(consumer), all, 'every pattern')
await saveReport('consumer-registry', {
  passed: true,
  patterns: patternNames,
  installedFiles: laterRun.files,
  installedCossComponents: firstRun.addedUi,
  patternsPath: consumer.patterns,
  barrelExports: all.length,
  uiUntouched: consumer.ui,
})
