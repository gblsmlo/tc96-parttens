import { existsSync } from 'node:fs'
import { readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import ts from 'typescript'
import { readAliases, resolveAliasPath } from '../packages/registry/src/config'
import {
  patternNames,
  patternSources,
  templateNames,
  templateSources,
} from '../packages/registry/src/manifest'
import {
  type Consumer,
  createConsumer,
  installPatterns,
  saveReport,
} from './consumer'
import { files } from './files'

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
const missingComponent = 'empty'
const consumer = await createConsumer('consumer-registry')
await rm(join(consumer.root, consumer.ui, `${missingComponent}.tsx`))
const firstRun = await installPatterns(consumer, first)
const expectedUi = [join(consumer.ui, `${missingComponent}.tsx`)]
if (JSON.stringify(firstRun.addedUi) !== JSON.stringify(expectedUi))
  throw new Error(
    `Expected the CLI to add only ${expectedUi}, added: ${firstRun.addedUi.join(', ') || 'nothing'}`,
  )
const installedFirst = patternNames.filter((name) =>
  existsSync(
    join(consumer.root, consumer.patterns, patternSources[name], 'index.ts'),
  ),
)
const firstNames = new Set(
  installedFirst.flatMap((name) => baseline[name] ?? []),
)
const laterOnly = new Set(
  patternNames
    .filter((name) => !installedFirst.includes(name))
    .flatMap((name) => baseline[name] ?? [])
    .filter((name) => !firstNames.has(name)),
)
expectExports(
  barrelExports(consumer),
  all.filter((name) => !laterOnly.has(name)),
  first.join(' and '),
)
// The shells need COSS items and a COSS hook the consumer does not have yet.
const shellComponents = [
  'autocomplete.tsx',
  'breadcrumb.tsx',
  'command.tsx',
  'hooks/use-media-query.ts',
  'sidebar.tsx',
].map((path) => join(consumer.ui, path))
for (const path of shellComponents) await rm(join(consumer.root, path))
const templatesRun = await installPatterns(consumer, [...templateNames])
if (
  JSON.stringify([...templatesRun.addedUi].sort()) !==
  JSON.stringify([...shellComponents].sort())
)
  throw new Error(
    `Expected the templates to add ${shellComponents.join(', ')}, added: ${templatesRun.addedUi.join(', ') || 'nothing'}`,
  )
const config = ts.readConfigFile(
  join(consumer.root, 'tsconfig.json'),
  ts.sys.readFile,
)
const templatesPath = resolveAliasPath(
  consumer.root,
  readAliases(
    JSON.parse(await readFile(join(consumer.root, 'components.json'), 'utf8')),
  ).templates,
  ts.parseJsonConfigFileContent(config.config, ts.sys, consumer.root).options,
)
for (const name of templateNames)
  if (
    !existsSync(
      join(consumer.root, templatesPath, templateSources[name], 'index.ts'),
    )
  )
    throw new Error(`The CLI did not install ${name}`)
for (const file of await files(join(consumer.root, templatesPath)))
  if ((await readFile(file, 'utf8')).includes('@tc96/'))
    throw new Error(`${file} still imports @tc96/*`)
expectExports(
  barrelExports(consumer),
  all.filter((name) => !laterOnly.has(name)),
  'the templates, which leave the patterns barrel alone',
)
const laterRun = await installPatterns(consumer, later)
if (laterRun.addedUi.length)
  throw new Error(`Unexpected COSS files: ${laterRun.addedUi.join(', ')}`)
expectExports(barrelExports(consumer), all, 'every pattern')
await saveReport('consumer-registry', {
  passed: true,
  patterns: patternNames,
  templates: templateNames,
  installedFiles: laterRun.files,
  installedCossComponents: firstRun.addedUi,
  templateCossComponents: templatesRun.addedUi,
  patternsPath: consumer.patterns,
  templatesPath,
  barrelExports: all.length,
  uiUntouched: consumer.ui,
})
