import { afterEach, expect, test } from 'bun:test'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readAliases, readInstallConfig } from './config'

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

test('names the missing tc96 aliases', () => {
  expect(() =>
    readAliases({ aliases: { ui: '@acme/ui', utils: '@acme/ui/lib/utils' } }),
  ).toThrow(
    'components.json is missing aliases.elements, aliases.helpers, aliases.patterns.',
  )
  expect(() =>
    readAliases({
      aliases: {
        ui: '@acme/ui',
        utils: '@acme/utils',
        elements: '@acme/e',
        helpers: '@acme/h',
      },
    }),
  ).toThrow('components.json is missing aliases.patterns.')
  expect(() => readAliases({ aliases: { ui: '@acme/ui' } })).toThrow(
    'shadcn init --force rewrites components.json without them',
  )
})

test('requires components.json in the consumer', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tc96-config-'))
  roots.push(root)
  await expect(readInstallConfig(root)).rejects.toThrow(
    'Configure shadcn components.json',
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
