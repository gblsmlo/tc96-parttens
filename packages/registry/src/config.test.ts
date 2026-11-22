import { afterEach, expect, test } from 'bun:test'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  findAliasPath,
  findBlocksPath,
  findProjectRoot,
  readAliases,
  readInstallConfig,
} from './config'

const roots: string[] = []
afterEach(async () => {
  for (const root of roots.splice(0))
    await rm(root, { recursive: true, force: true })
})

async function consumer(
  aliases: Record<string, string>,
  paths: Record<string, string[]>,
) {
  const root = await mkdtemp(join(tmpdir(), 'tc96-config-'))
  roots.push(root)
  await writeFile(
    join(root, 'components.json'),
    JSON.stringify({ style: 'new-york', aliases }),
  )
  await writeFile(
    join(root, 'tsconfig.json'),
    JSON.stringify({ compilerOptions: { paths } }),
  )
  return root
}

test('reads non-default aliases and resolves their paths from tsconfig', async () => {
  const root = await consumer(
    {
      components: '@acme/ui',
      ui: '@acme/ui',
      utils: '@acme/ui/lib/utils',
      elements: '@acme/atoms',
      helpers: '@acme/toolkit',
      patterns: '@acme/organisms',
    },
    {
      '@acme/ui/*': ['./packages/ui/src/*'],
      '@acme/toolkit/*': ['./libs/toolkit/src/*'],
      '@acme/organisms/*': ['./libs/organisms/*'],
    },
  )

  expect(await readInstallConfig(root)).toEqual({
    aliases: {
      ui: '@acme/ui',
      utils: '@acme/ui/lib/utils',
      helpers: '@acme/toolkit',
      patterns: '@acme/organisms',
      blocks: '@acme/blocks',
    },
    paths: {
      ui: 'packages/ui/src',
      helpers: 'libs/toolkit/src',
      patterns: 'libs/organisms',
    },
    warnings: [elementsWarning('@acme/ui', '@acme/atoms')],
  })
})

const elementsWarning = (ui: string, where: string) =>
  `tc96 no longer installs elements: Text and IconFrame come from your ui alias (${ui}/text, ${ui}/icon-frame). Files in ${where} from earlier installs are no longer imported by tc96 patterns; remove them once your code stops importing them.`

test('resolves the blocks path only when a block is installed', async () => {
  const paths = {
    '@acme/ui/*': ['./packages/ui/src/*'],
    '@acme/helpers/*': ['./packages/helpers/src/*'],
    '@acme/patterns/*': ['./packages/patterns/src/*'],
  }
  const root = await consumer({ ui: '@acme/ui', utils: '@acme/utils' }, paths)
  expect((await readInstallConfig(root)).paths.blocks).toBeUndefined()
  await expect(readInstallConfig(root, { blocks: true })).rejects.toThrow(
    '"@acme/blocks/*": ["./packages/blocks/src/*"]',
  )
  const app = await consumer(
    { ui: '@acme/ui', utils: '@acme/utils', blocks: '@/blocks' },
    { ...paths, '@/blocks/*': ['./apps/web/src/blocks/*'] },
  )
  const config = await readInstallConfig(app, { blocks: true })
  expect(config.paths.blocks).toBe('apps/web/src/blocks')
  expect(config.aliases.blocks).toBe('@/blocks')
  expect(config.warnings).toEqual([])
})

const basePaths = {
  '@acme/ui/*': ['./packages/ui/src/*'],
  '@acme/helpers/*': ['./packages/helpers/src/*'],
  '@acme/patterns/*': ['./packages/patterns/src/*'],
}

test('uses aliases.templates as the blocks alias and warns about it', async () => {
  const root = await consumer(
    { ui: '@acme/ui', utils: '@acme/utils', templates: '@/templates' },
    { ...basePaths, '@/templates/*': ['./apps/web/src/templates/*'] },
  )
  const config = await readInstallConfig(root, { blocks: true })
  expect(config.aliases.blocks).toBe('@/templates')
  expect(config.paths.blocks).toBe('apps/web/src/templates')
  expect(config.warnings).toEqual([
    'components.json aliases.templates is deprecated; rename it to aliases.blocks.',
  ])
  expect(
    readAliases({
      aliases: {
        ui: '@acme/ui',
        utils: '@acme/utils',
        templates: '@/templates',
        blocks: '@/blocks',
      },
    }).blocks,
  ).toBe('@/blocks')
})

test('writes blocks to the templates path while the tsconfig has no blocks entry', async () => {
  const root = await consumer(
    { ui: '@acme/ui', utils: '@acme/utils' },
    { ...basePaths, '@acme/templates/*': ['./packages/templates/src/*'] },
  )
  const config = await readInstallConfig(root, { blocks: true })
  expect(config.aliases.blocks).toBe('@acme/templates')
  expect(config.paths.blocks).toBe('packages/templates/src')
  expect(config.warnings).toEqual([
    'tsconfig.json paths has "@acme/templates/*" but no "@acme/blocks/*"; blocks are written to the templates path for now. Rename the entry to "@acme/blocks/*".',
  ])
  expect((await readInstallConfig(root)).warnings).toEqual([])
  expect(await findBlocksPath(root)).toBe('packages/templates/src')
})

test('prefers the blocks entry over a leftover templates entry', async () => {
  const root = await consumer(
    { ui: '@acme/ui', utils: '@acme/utils' },
    {
      ...basePaths,
      '@acme/blocks/*': ['./packages/blocks/src/*'],
      '@acme/templates/*': ['./packages/templates/src/*'],
    },
  )
  const config = await readInstallConfig(root, { blocks: true })
  expect(config.aliases.blocks).toBe('@acme/blocks')
  expect(config.paths.blocks).toBe('packages/blocks/src')
  expect(config.warnings).toEqual([])
})

test('warns that elements are no longer installed when components.json names the alias', async () => {
  const root = await consumer(
    { ui: '@acme/ui', utils: '@acme/utils', elements: '@acme/atoms' },
    { ...basePaths, '@acme/atoms/*': ['./packages/atoms/src/*'] },
  )
  expect((await readInstallConfig(root)).warnings).toEqual([
    elementsWarning('@acme/ui', 'packages/atoms/src'),
  ])
})

test('warns about an existing elements directory at the derived path', async () => {
  const paths = {
    ...basePaths,
    '@acme/elements/*': ['./packages/elements/src/*'],
  }
  const root = await consumer({ ui: '@acme/ui', utils: '@acme/utils' }, paths)
  expect((await readInstallConfig(root)).warnings).toEqual([])
  await mkdir(join(root, 'packages/elements/src'), { recursive: true })
  expect((await readInstallConfig(root)).warnings).toEqual([
    elementsWarning('@acme/ui', 'packages/elements/src'),
  ])
})

test('finds the blocks directory without requiring one', async () => {
  const root = await consumer(
    { ui: '@acme/ui', utils: '@acme/utils' },
    basePaths,
  )
  expect(await findBlocksPath(root)).toBeUndefined()
  expect(await findBlocksPath(join(root, 'missing'))).toBeUndefined()
  const withBlocks = await consumer(
    { ui: '@acme/ui', utils: '@acme/utils' },
    { ...basePaths, '@acme/blocks/*': ['./packages/blocks/src/*'] },
  )
  expect(await findBlocksPath(withBlocks)).toBe('packages/blocks/src')
  expect(findAliasPath(withBlocks, '@acme/none', {})).toBeUndefined()
})

test('derives the tc96 aliases from the ui alias when absent', () => {
  expect(
    readAliases({ aliases: { ui: '@acme/ui', utils: '@acme/ui/lib/utils' } }),
  ).toEqual({
    ui: '@acme/ui',
    utils: '@acme/ui/lib/utils',
    helpers: '@acme/helpers',
    patterns: '@acme/patterns',
    blocks: '@acme/blocks',
  })
  expect(
    readAliases({
      aliases: { ui: '@acme/ui', utils: '@acme/utils', patterns: '@acme/p' },
    }),
  ).toMatchObject({ helpers: '@acme/helpers', patterns: '@acme/p' })
  expect(
    readAliases({
      aliases: {
        ui: '@acme/ui',
        utils: '@acme/utils',
        elements: '@acme/atoms',
      },
    }),
  ).not.toHaveProperty('elements')
})

test('requires the ui and utils aliases', () => {
  expect(() => readAliases({ aliases: { ui: '@acme/ui' } })).toThrow(
    'components.json is missing aliases.utils.',
  )
  expect(() => readAliases({})).toThrow(
    'components.json is missing aliases.ui, aliases.utils.',
  )
})

test('suggests the missing tsconfig path from the ui path', async () => {
  const root = await consumer(
    { ui: '@acme/ui', utils: '@acme/utils' },
    { '@acme/ui/*': ['./packages/ui/src/*'] },
  )
  await expect(readInstallConfig(root)).rejects.toThrow(
    '"@acme/helpers/*": ["./packages/helpers/src/*"]',
  )
})

test('suggests a nested tsconfig path when the ui alias names its folder', async () => {
  const root = await consumer(
    { ui: '@acme/ui/components', utils: '@acme/ui/lib/utils' },
    { '@acme/ui/components/*': ['./packages/ui/src/components/*'] },
  )
  await expect(readInstallConfig(root)).rejects.toThrow(
    '"@acme/ui/helpers/*": ["./packages/ui/src/helpers/*"]',
  )
})

test('resolves every layer inside one ui package', async () => {
  const root = await consumer(
    { ui: '@acme/ui/components', utils: '@acme/ui/lib/utils' },
    {
      '@acme/ui/components/*': ['./packages/ui/src/components/*'],
      '@acme/ui/helpers/*': ['./packages/ui/src/helpers/*'],
      '@acme/ui/patterns/*': ['./packages/ui/src/patterns/*'],
    },
  )
  expect((await readInstallConfig(root)).paths).toEqual({
    ui: 'packages/ui/src/components',
    helpers: 'packages/ui/src/helpers',
    patterns: 'packages/ui/src/patterns',
  })
})

test('requires components.json in the consumer', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tc96-config-'))
  roots.push(root)
  await expect(readInstallConfig(root)).rejects.toThrow(
    'No components.json found in',
  )
})

test('requires a tsconfig path for the ui alias and each written alias', async () => {
  const root = await consumer(
    {
      ui: '@acme/ui',
      utils: '@acme/utils',
      helpers: '@acme/helpers',
      patterns: '@acme/patterns',
    },
    { '@acme/patterns/*': ['./packages/patterns/src/*'] },
  )
  await expect(readInstallConfig(root)).rejects.toThrow(
    'tsconfig.json paths has no "@acme/ui/*" entry',
  )
  await writeFile(
    join(root, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        paths: {
          '@acme/ui/*': ['./packages/ui/src/*'],
          '@acme/patterns/*': ['./packages/patterns/src/*'],
        },
      },
    }),
  )
  await expect(readInstallConfig(root)).rejects.toThrow(
    'tsconfig.json paths has no "@acme/helpers/*" entry',
  )
})

test('rejects an alias that resolves outside the workspace', async () => {
  const root = await consumer(
    {
      ui: '@acme/ui',
      utils: '@acme/utils',
      helpers: '@acme/helpers',
      patterns: '@acme/patterns',
    },
    {
      '@acme/ui/*': ['./packages/ui/src/*'],
      '@acme/helpers/*': ['./packages/helpers/src/*'],
      '@acme/patterns/*': ['../shared/patterns/*'],
    },
  )
  await expect(readInstallConfig(root)).rejects.toThrow(
    '"@acme/patterns/*" must resolve inside the consumer workspace.',
  )
})

test('finds the nearest components.json above the working directory', async () => {
  const root = await consumer({}, {})
  const nested = join(root, 'apps', 'web')
  await mkdir(nested, { recursive: true })

  expect(findProjectRoot(nested)).toBe(root)
  expect(findProjectRoot(root)).toBe(root)
})

test('falls back to the working directory when no components.json exists', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tc96-config-'))
  roots.push(root)

  expect(findProjectRoot(root)).toBe(root)
})
