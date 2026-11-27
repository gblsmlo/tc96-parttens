import { afterEach, expect, test } from 'bun:test'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readInstallConfig } from './config'
import { init, layerExports } from './init'
import { addFolderExports, importedFolders } from './workspace'

const roots: string[] = []
afterEach(async () => {
  for (const root of roots.splice(0))
    await rm(root, { recursive: true, force: true })
})

async function monorepo(uiExports: Record<string, string>) {
  const root = await mkdtemp(join(tmpdir(), 'tc96-init-'))
  roots.push(root)
  const json = (path: string, value: unknown) =>
    writeFile(join(root, path), `${JSON.stringify(value, null, 2)}\n`)
  await json('package.json', {
    workspaces: ['apps/*', 'packages/ui', 'packages/utils'],
  })
  await json('tsconfig.json', { compilerOptions: {} })
  for (const directory of ['packages/ui/src/styles', 'packages/utils'])
    await mkdir(join(root, directory), { recursive: true })
  await writeFile(join(root, 'packages/ui/src/styles/globals.css'), '')
  await json('packages/ui/package.json', {
    name: '@tc96/ui',
    exports: uiExports,
  })
  await json('packages/utils/package.json', { name: '@tc96/utils' })
  return root
}

const readJson = async (root: string, path: string) =>
  JSON.parse(await readFile(join(root, path), 'utf8'))

test('writes components.json and the layer exports of the tc96-mono layout', async () => {
  const root = await monorepo({
    './*': './src/components/*.tsx',
    './styles/*': './src/styles/*',
  })
  expect(await init(root)).toEqual({
    components: 'created',
    exportsAdded: Object.keys(layerExports).filter((key) => key !== './*'),
    warnings: [],
  })
  const components = await readJson(root, 'components.json')
  expect(components.tailwind.css).toBe('packages/ui/src/styles/globals.css')
  expect(components.aliases).toMatchObject({
    ui: '@tc96/ui',
    utils: '@tc96/utils',
    hooks: '@tc96/ui/hooks',
    lib: '@tc96/ui/lib',
    helpers: '@tc96/ui/helpers',
    patterns: '@tc96/ui/patterns',
    blocks: '@tc96/ui/blocks',
  })
  const manifest = await readJson(root, 'packages/ui/package.json')
  expect(manifest.exports['./styles/*']).toBe('./src/styles/*')
  expect((await readInstallConfig(root, { blocks: true })).paths).toEqual({
    ui: 'packages/ui/src/components',
    hooks: 'packages/ui/src/hooks',
    lib: 'packages/ui/src/lib',
    helpers: 'packages/ui/src/helpers',
    patterns: 'packages/ui/src/patterns',
    blocks: 'packages/ui/src/blocks',
  })
})

test('keeps an edited components.json and runs again without changes', async () => {
  const root = await monorepo(layerExports)
  const custom = {
    aliases: {
      ui: '@tc96/ui',
      utils: '@tc96/utils',
      patterns: '@tc96/ui/patterns',
    },
  }
  await writeFile(join(root, 'components.json'), JSON.stringify(custom))
  expect(await init(root)).toEqual({
    components: 'kept',
    exportsAdded: [],
    warnings: [],
  })
  expect(await readJson(root, 'components.json')).toEqual(custom)
})

test('leaves the ui package alone when components.json points elsewhere', async () => {
  const root = await monorepo({})
  await writeFile(
    join(root, 'components.json'),
    JSON.stringify({ aliases: { ui: '@acme/ui', utils: '@acme/utils' } }),
  )
  const result = await init(root)
  expect(result.exportsAdded).toEqual([])
  expect(result.warnings[0]).toContain('points ui to @acme/ui')
  expect((await readJson(root, 'packages/ui/package.json')).exports).toEqual({})
})

test('requires the ui and utils packages of the tc96-mono layout', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tc96-init-'))
  roots.push(root)
  await expect(init(root)).rejects.toThrow(
    'cannot find packages/ui/package.json and packages/utils/package.json',
  )
})

test('exports the folder components the CLI installs into the ui package', async () => {
  const root = await monorepo(layerExports)
  await mkdir(join(root, 'packages/ui/src/components/text'), {
    recursive: true,
  })
  await writeFile(join(root, 'packages/ui/src/components/text/index.ts'), '')
  expect(addFolderExports(root, '@tc96/ui', ['text', 'button'])).toEqual([
    './text',
  ])
  expect(
    (await readJson(root, 'packages/ui/package.json')).exports['./text'],
  ).toBe('./src/components/text/index.ts')
  expect(addFolderExports(root, '@tc96/ui', ['text'])).toEqual([])
})

test('lists the pattern folders installed files import by folder', async () => {
  const root = await monorepo(layerExports)
  const patterns = join(root, 'packages/ui/src/patterns')
  await mkdir(join(patterns, 'view-settings/components'), { recursive: true })
  await writeFile(join(patterns, 'view-settings/components/index.ts'), '')
  await mkdir(join(patterns, 'toolbar'), { recursive: true })
  await writeFile(join(patterns, 'toolbar/toolbar.tsx'), '')
  expect(
    importedFolders(root, '@tc96/ui/patterns', [
      "import { ViewSettings } from '@tc96/ui/patterns/view-settings/components'",
      "import { Toolbar } from '@tc96/ui/patterns/toolbar/toolbar'",
      "import { cn } from '@tc96/utils'",
    ]),
  ).toEqual(['view-settings/components'])
  expect(
    addFolderExports(root, '@tc96/ui/patterns', ['view-settings/components']),
  ).toEqual(['./patterns/view-settings/components'])
})
