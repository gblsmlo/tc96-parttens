import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { build } from 'esbuild'
import ts from 'typescript'
import {
  cossDependency,
  defaultConfig,
  type ItemName,
  itemAreas,
  type PatternName,
  patternNames,
  patternSources,
  prepareItem,
  type RegistryItem,
  templateNames,
  templateSources,
} from './manifest'

const root = resolve('.')
const output = join(root, 'dist/registry')
await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
const configuration = ts.readConfigFile('tsconfig.json', ts.sys.readFile)
const parsed = ts.parseJsonConfigFileContent(configuration.config, ts.sys, root)
const versions: Record<string, string> = {}
for (const pkg of ['elements', 'helpers', 'parttens']) {
  const manifest = JSON.parse(
    await readFile(`packages/${pkg}/package.json`, 'utf8'),
  )
  Object.assign(versions, manifest.peerDependencies, manifest.dependencies)
}
// ui and utils are the consumer's: their imports are rewritten to its
// aliases, never followed into the distributed files. Each ui component
// becomes a COSS registry dependency.
const consumerOwned = /^@tc96\/(ui|utils)(\/|$)/
const uiComponent = /^@tc96\/ui\/(?:([^/]+)|(chat)\/.+)$/
// The aggregate re-exports the pattern barrels and shared areas such as
// shared/. An area's barrel ships with every pattern that uses the area, so
// the consumer's generated barrel can export it.
const aggregate = await readFile('packages/parttens/src/index.ts', 'utf8')
const areas = ts
  .preProcessFile(aggregate)
  .importedFiles.map(({ fileName }) => fileName.match(/^\.\/([^/]+)\/index$/))
  .map((match) => match?.[1])
  .filter(
    (area): area is string =>
      !!area && !patternNames.includes(area as PatternName),
  )
// A template's item carries the pattern, elements and helpers files it imports,
// walked the same way as a pattern's.
const entries: [ItemName, string][] = [
  ...patternNames.map((name): [ItemName, string] => [
    name,
    `packages/parttens/src/${patternSources[name]}/index.ts`,
  ]),
  ...templateNames.map((name): [ItemName, string] => [
    name,
    `packages/templates/src/${templateSources[name]}/index.ts`,
  ]),
]
for (const area of Object.values(itemAreas).flat())
  if (!areas.includes(area))
    throw new Error(
      `itemAreas names ${area}, which the aggregate does not export`,
    )
const shippedAreas = new Set<string>()
for (const [name, entry] of entries) {
  const pending = [
    resolve(entry),
    ...(itemAreas[name] ?? []).map((area) =>
      resolve(`packages/parttens/src/${area}/index.ts`),
    ),
  ]
  const seen = new Set<string>()
  const external = new Set<string>()
  const components = new Set<string>()
  const sources: RegistryItem['files'] = []
  const usedAreaBarrel = () =>
    areas
      .filter((area) =>
        sources.some(({ path }) => path.startsWith(`parttens/src/${area}/`)),
      )
      .map((area) => resolve(`packages/parttens/src/${area}/index.ts`))
      .find((barrel) => !seen.has(barrel))
  for (;;) {
    const file = pending.pop() ?? usedAreaBarrel()
    if (!file) break
    if (seen.has(file)) continue
    seen.add(file)
    const content = await readFile(file, 'utf8')
    sources.push({
      path: relative(resolve('packages'), file).replaceAll('\\', '/'),
      type: 'registry:file',
      content,
    })
    for (const imported of ts.preProcessFile(content).importedFiles) {
      const specifier = imported.fileName
      const match = specifier.match(uiComponent)
      const component = match?.[1] ?? match?.[2]
      if (component) components.add(cossDependency(component))
      if (consumerOwned.test(specifier)) continue
      if (specifier.startsWith('.') || specifier.startsWith('@tc96/')) {
        const result = ts.resolveModuleName(
          specifier,
          file,
          parsed.options,
          ts.sys,
        ).resolvedModule
        if (
          !result ||
          !result.resolvedFileName.startsWith(join(root, 'packages/'))
        )
          throw new Error(`Unresolved local dependency ${file}: ${specifier}`)
        pending.push(result.resolvedFileName)
      } else {
        const name = specifier.startsWith('@')
          ? specifier.split('/').slice(0, 2).join('/')
          : specifier.split('/')[0]
        if (name && name !== 'react/jsx-runtime' && !name.startsWith('node:'))
          external.add(name)
      }
    }
  }
  for (const area of areas)
    if (sources.some(({ path }) => path.startsWith(`parttens/src/${area}/`)))
      shippedAreas.add(area)
  const item: RegistryItem = {
    name,
    type: 'registry:block',
    files: sources.sort((a, b) => a.path.localeCompare(b.path)),
    dependencies: [...external].sort().map(
      (name) =>
        `${name}@${
          versions[name] ??
          (
            () => {
              throw new Error(`Missing dependency version: ${name}`)
            }
          )()
        }`,
    ),
    registryDependencies: [...components].sort(),
  }
  await writeFile(
    join(output, `${name}.json`),
    `${JSON.stringify(prepareItem(item, defaultConfig), null, 2)}\n`,
  )
}
const unshipped = areas.filter((area) => !shippedAreas.has(area))
if (unshipped.length)
  throw new Error(
    `No registry item ships ${unshipped.join(', ')}, which the aggregate exports; add it to itemAreas.`,
  )
await writeFile(
  join(output, 'aggregate.json'),
  `${JSON.stringify({ path: 'parttens/src/index.ts', content: aggregate }, null, 2)}\n`,
)
await writeFile(
  join(output, 'view.json'),
  await readFile(join(output, 'collection.json')),
)
const cliOutput = resolve('dist/cli')
await mkdir(join(cliOutput, 'registry'), { recursive: true })
for (const name of [...entries.map(([name]) => name), 'view', 'aggregate'])
  await writeFile(
    join(cliOutput, `registry/${name}.json`),
    await readFile(join(output, `${name}.json`)),
  )
if (ts.sys.fileExists('packages/registry/src/cli.ts')) {
  await build({
    entryPoints: ['packages/registry/src/cli.ts'],
    bundle: true,
    packages: 'external',
    platform: 'node',
    format: 'esm',
    target: 'node22',
    outfile: join(cliOutput, 'cli.js'),
    banner: { js: '#!/usr/bin/env node' },
  })
}
await writeFile(
  join(cliOutput, 'package.json'),
  `${JSON.stringify(
    {
      name: '@tc96/parttens',
      version: '0.20.0',
      description:
        'React patterns without business rules, installed as source on top of your COSS components.',
      keywords: ['coss', 'react', 'patterns', 'registry', 'cli'],
      type: 'module',
      license: 'MIT',
      repository: {
        type: 'git',
        url: 'git+https://github.com/gblsmlo/tc96-parttens.git',
      },
      engines: { node: '>=22' },
      bin: { 'tc96-parttens': 'cli.js' },
      // Pacote com escopo nasce restrito no npm; o CLI e publico.
      publishConfig: { access: 'public' },
      files: ['cli.js', 'registry', 'README.md', 'LICENSE'],
      dependencies: { typescript: '6.0.3' },
    },
    null,
    2,
  )}\n`,
)
await writeFile(join(cliOutput, 'LICENSE'), await readFile('LICENSE'))
// O repositorio e privado: o README publicado para antes de Development, que
// descreve os scripts do monorepo e aponta para documentos e issues internos.
const readme = await readFile('README.md', 'utf8')
const publicEnd = readme.indexOf('\n## Development')
if (publicEnd === -1) throw new Error('README.md lost its Development section')
await writeFile(
  join(cliOutput, 'README.md'),
  `${readme.slice(0, publicEnd).trimEnd()}\n`,
)
console.log(
  `Generated ${entries.length} pattern and template registry items, the legacy view entry, the aggregate and the Node CLI artifact.`,
)
