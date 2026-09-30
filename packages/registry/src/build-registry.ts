import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { build } from 'esbuild'
import ts from 'typescript'
import {
  defaultConfig,
  patternNames,
  prepareItem,
  type RegistryItem,
} from './manifest'

const root = resolve('.')
const output = join(root, 'dist/registry')
await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
const configuration = ts.readConfigFile('tsconfig.json', ts.sys.readFile)
const parsed = ts.parseJsonConfigFileContent(configuration.config, ts.sys, root)
const versions: Record<string, string> = {
  react: '19.1.1',
  'react-dom': '19.1.1',
  '@base-ui/react': '1.6.0',
}
for (const pkg of ['utils', 'ui', 'parttens']) {
  Object.assign(
    versions,
    JSON.parse(await readFile(`packages/${pkg}/package.json`, 'utf8'))
      .dependencies,
  )
}
for (const pattern of patternNames) {
  const pending = [resolve(`packages/parttens/src/${pattern}/index.ts`)]
  const seen = new Set<string>()
  const external = new Set<string>()
  const sources: RegistryItem['files'] = []
  while (pending.length) {
    const file = pending.pop()
    if (!file || seen.has(file)) continue
    seen.add(file)
    const content = await readFile(file, 'utf8')
    sources.push({
      path: relative(resolve('packages'), file).replaceAll('\\', '/'),
      type: 'registry:file',
      content,
    })
    for (const imported of ts.preProcessFile(content).importedFiles) {
      const specifier = imported.fileName
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
  const item: RegistryItem = {
    name: pattern,
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
  }
  await writeFile(
    join(output, `${pattern}.json`),
    `${JSON.stringify(prepareItem(item, defaultConfig), null, 2)}\n`,
  )
}
await writeFile(
  join(output, 'view.json'),
  await readFile(join(output, 'collection-views.json')),
)
await mkdir('dist/library/registry', { recursive: true })
for (const name of [...patternNames, 'view'])
  await writeFile(
    `dist/library/registry/${name}.json`,
    await readFile(join(output, `${name}.json`)),
  )
const cliOutput = resolve('dist/cli')
await mkdir(join(cliOutput, 'registry'), { recursive: true })
for (const name of [...patternNames, 'view'])
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
      name: 'tc96-parttens',
      version: '0.1.0',
      type: 'module',
      license: 'MIT',
      engines: { node: '>=22' },
      bin: { 'tc96-parttens': './cli.js' },
      files: ['cli.js', 'registry', 'README.md', 'LICENSE'],
      dependencies: { shadcn: '4.21.0', typescript: '6.0.3' },
    },
    null,
    2,
  )}\n`,
)
await writeFile(join(cliOutput, 'LICENSE'), await readFile('LICENSE'))
console.log(
  'Generated four registry items, the legacy view entry and the Node CLI artifact.',
)
