import { afterEach, expect, test } from 'bun:test'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { findProjectRoot, readAliases, readInstallConfig } from './config'

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
      '@acme/atoms': ['./packages/atoms/src/index.ts'],
      '@acme/atoms/*': ['./packages/atoms/src/*'],
      '@acme/toolkit/*': ['./libs/toolkit/src/*'],
      '@acme/organisms/*': ['./libs/organisms/*'],
    },
  )

  expect(await readInstallConfig(root)).toEqual({
    aliases: {
      ui: '@acme/ui',
      utils: '@acme/ui/lib/utils',
      elements: '@acme/atoms',
      helpers: '@acme/toolkit',
      patterns: '@acme/organisms',
    },
    paths: {
      ui: 'packages/ui/src',
      elements: 'packages/atoms/src',
      helpers: 'libs/toolkit/src',
      patterns: 'libs/organisms',
    },
  })
})

test('derives the tc96 aliases from the ui alias when absent', () => {
  expect(
    readAliases({ aliases: { ui: '@acme/ui', utils: '@acme/ui/lib/utils' } }),
  ).toEqual({
    ui: '@acme/ui',
    utils: '@acme/ui/lib/utils',
    elements: '@acme/elements',
    helpers: '@acme/helpers',
    patterns: '@acme/patterns',
  })
  expect(
    readAliases({
      aliases: { ui: '@acme/ui', utils: '@acme/utils', patterns: '@acme/p' },
    }),
  ).toMatchObject({ elements: '@acme/elements', patterns: '@acme/p' })
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
    '"@acme/elements/*": ["./packages/elements/src/*"]',
  )
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
      elements: '@acme/elements',
      helpers: '@acme/helpers',
      patterns: '@acme/patterns',
    },
    { '@acme/elements/*': ['./packages/elements/src/*'] },
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
          '@acme/elements/*': ['./packages/elements/src/*'],
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
      elements: '@acme/elements',
      helpers: '@acme/helpers',
      patterns: '@acme/patterns',
    },
    {
      '@acme/ui/*': ['./packages/ui/src/*'],
      '@acme/elements/*': ['./packages/elements/src/*'],
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
