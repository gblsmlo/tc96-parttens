import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { build } from 'esbuild'
import ts from 'typescript'
import {
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
  uiDependency,
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
// aliases, never followed into the distributed files. Each ui module a
// pattern imports becomes a ui registry dependency on the item that owns it.
const consumerOwned = /^@tc96\/(ui|utils)(\/|$)/
const uiMatch = /^@tc96\/ui\/(.+)$/
interface UiManifestEntry {
  paths?: string[]
  cssVars?: unknown
  css?: unknown
}
const uiManifest = JSON.parse(
  await readFile('packages/ui/ui.manifest.json', 'utf8'),
) as { items: Record<string, UiManifestEntry> }
const uiPaths = (name: string) =>
  uiManifest.items[name]?.paths ?? [`${name}.tsx`]
const uiOwners = new Map<string, string>()
for (const name of Object.keys(uiManifest.items))
  for (const path of uiPaths(name))
    uiOwners.set(path.replace(/\.tsx?$/, ''), name)
const uiOwner = (module: string, importer: string) => {
  const owner = uiOwners.get(module)
  if (!owner)
    throw new Error(`${importer}: ${module} is not in the ui manifest`)
  return owner
}
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
      const module = specifier.match(uiMatch)?.[1]
      if (module) components.add(uiDependency(uiOwner(module, file)))
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
const uiVersions: Record<string, string> = {}
{
  const manifest = JSON.parse(
    await readFile('packages/ui/package.json', 'utf8'),
  )
  Object.assign(uiVersions, manifest.peerDependencies, manifest.dependencies)
}
await mkdir(join(output, 'ui'), { recursive: true })
for (const [name, entry] of Object.entries(uiManifest.items)) {
  const external = new Set<string>()
  const related = new Set<string>()
  const files = []
  for (const path of uiPaths(name)) {
    const content = await readFile(`packages/ui/src/${path}`, 'utf8')
    files.push({ path: `registry/default/ui/${path}`, content })
    for (const { fileName } of ts.preProcessFile(content).importedFiles) {
      if (fileName === '@tc96/utils') continue
      const module = fileName.match(uiMatch)?.[1]
      if (fileName.startsWith('.')) {
        const resolved = join(dirname(path), fileName).replaceAll('\\', '/')
        const owner = uiOwners.get(resolved)
        if (owner && owner !== name) related.add(uiDependency(owner))
      } else if (module) {
        const owner = uiOwner(module, path)
        if (owner !== name) related.add(uiDependency(owner))
      } else {
        const pkg = fileName.startsWith('@')
          ? fileName.split('/').slice(0, 2).join('/')
          : fileName.split('/')[0]
        if (
          pkg &&
          !['react', 'react-dom'].includes(pkg) &&
          !pkg.startsWith('node:')
        )
          external.add(pkg)
      }
    }
  }
  await writeFile(
    join(output, `ui/${name}.json`),
    `${JSON.stringify(
      {
        name,
        type: 'registry:ui',
        files,
        dependencies: [...external].sort().map((pkg) => {
          const version = uiVersions[pkg]
          if (!version) throw new Error(`Missing ui dependency version: ${pkg}`)
          return `${pkg}@${version}`
        }),
        registryDependencies: [...related].sort(),
        ...(entry.cssVars ? { cssVars: entry.cssVars } : {}),
        ...(entry.css ? { css: entry.css } : {}),
      },
      null,
      2,
    )}\n`,
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
await cp(join(output, 'ui'), join(cliOutput, 'registry/ui'), {
  recursive: true,
})
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
      version: '0.20.1',
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
