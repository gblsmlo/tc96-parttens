import { afterEach, expect, test } from 'bun:test'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  type CossRegistryItem,
  componentFile,
  cossRegistry,
  cossSource,
  loadItem,
  missingTheme,
  normalizeImports,
  resolveItems,
} from './coss'

const roots: string[] = []
afterEach(async () => {
  for (const root of roots.splice(0))
    await rm(root, { recursive: true, force: true })
})

const aliases = { ui: '@acme/ui', utils: '@acme/ui/lib/utils' }

function item(
  name: string,
  content = '',
  extra: Partial<CossRegistryItem> = {},
): CossRegistryItem {
  return {
    name,
    files: [{ path: `registry/default/ui/${name}.tsx`, content }],
    ...extra,
  }
}

test('rewrites the registry aliases to the given ones', () => {
  expect(
    normalizeImports(
      'import { cn } from "@/registry/default/lib/utils";\nimport { Spinner } from \'@/registry/default/ui/spinner\';',
      aliases,
    ),
  ).toBe(
    'import { cn } from "@acme/ui/lib/utils";\nimport { Spinner } from \'@acme/ui/spinner\';',
  )
})

test('reads the @coss registry from components.json', () => {
  expect(cossSource({ aliases: {} })).toBe(cossRegistry)
  expect(
    cossSource({ registries: { '@coss': 'https://mirror.test/{name}.json' } }),
  ).toBe('https://mirror.test/{name}.json')
  expect(() =>
    cossSource({
      registries: { '@coss': { url: 'https://x/{name}', headers: {} } },
    }),
  ).toThrow('object form')
  expect(() =>
    cossSource({ registries: { '@coss': 'https://x/item.json' } }),
  ).toThrow('{name}')
  expect(() =>
    cossSource({ registries: { '@coss': 'https://x/{style}/{name}.json' } }),
  ).toThrow('no other placeholder')
})

test('loads an item from a path relative to the consumer root', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tc96-coss-'))
  roots.push(root)
  await writeFile(join(root, 'badge.json'), JSON.stringify(item('badge')))
  expect((await loadItem('./{name}.json', 'badge', root)).name).toBe('badge')
})

test('follows registry dependencies and skips installed components', async () => {
  const registry: Record<string, CossRegistryItem> = {
    menu: item('menu', '', { registryDependencies: ['@coss/button'] }),
    select: item('select', '', {
      registryDependencies: ['@coss/button', '@coss/scroll-area'],
    }),
    button: item('button'),
    'scroll-area': item('scroll-area'),
  }
  const loaded: string[] = []
  const items = await resolveItems(
    ['@coss/select', '@coss/menu'],
    async (name) => {
      loaded.push(name)
      return registry[name] as CossRegistryItem
    },
    (name) => name === 'scroll-area',
  )
  expect(items.map(({ name }) => name)).toEqual(['button', 'menu', 'select'])
  expect(loaded.sort()).toEqual(['button', 'menu', 'select'])
})

test('rejects dependencies outside @coss and renamed items', async () => {
  await expect(
    resolveItems(
      ['https://example.test/r/button.json'],
      async () => item('button'),
      () => false,
    ),
  ).rejects.toThrow('Unsupported COSS registry dependency')
  await expect(
    resolveItems(
      ['@coss/button'],
      async () => item('toggle'),
      () => false,
    ),
  ).rejects.toThrow('published as toggle')
})

test('targets the ui directory with the consumer aliases', () => {
  expect(
    componentFile(
      item('badge', 'import { cn } from "@/lib/utils"'),
      aliases,
      'packages/ui/src',
    ),
  ).toEqual({
    path: 'coss/badge.tsx',
    type: 'registry:ui',
    content: 'import { cn } from "@acme/ui/lib/utils"',
    target: '~/packages/ui/src/badge.tsx',
  })
})

test('fails on items it cannot install faithfully', () => {
  expect(() =>
    componentFile(
      item('chart', 'import { useMobile } from "@/hooks/use-mobile"'),
      aliases,
      'src/ui',
    ),
  ).toThrow('@/hooks/use-mobile has no alias')
  expect(() =>
    componentFile(
      item('form', '', { envVars: { KEY: '' } }),
      aliases,
      'src/ui',
    ),
  ).toThrow('envVars')
  expect(() =>
    componentFile(
      {
        name: 'sidebar',
        files: [
          { path: 'registry/default/ui/sidebar.tsx', content: '' },
          { path: 'registry/default/hooks/use-sidebar.ts', content: '' },
        ],
      },
      aliases,
      'src/ui',
    ),
  ).toThrow('expected one file')
})

test('lists the theme tokens and rules the stylesheet does not mention', () => {
  const items = [
    item('badge', '', {
      cssVars: {
        light: { 'destructive-foreground': 'red', info: 'blue' },
        dark: { info: 'navy' },
      },
    }),
    item('skeleton', '', {
      cssVars: { theme: { '--animate-skeleton': 'skeleton 2s infinite' } },
      css: {
        '@keyframes skeleton': { to: { 'background-position': '-200%' } },
      },
    }),
    item('button', '', {
      cssVars: { light: { 'destructive-foreground': 'red' } },
    }),
  ]
  expect(
    missingTheme(items, ':root {\n  --destructive-foreground: red;\n}'),
  ).toEqual([
    {
      item: 'badge',
      rules: [':root {\n  --info: blue;\n}', '.dark {\n  --info: navy;\n}'],
    },
    {
      item: 'skeleton',
      rules: [
        '@theme {\n  --animate-skeleton: skeleton 2s infinite;\n}',
        '@keyframes skeleton {\n  to {\n    background-position: -200%;\n  }\n}',
      ],
    },
  ])
  expect(missingTheme(items.slice(2), undefined)).toEqual([
    { item: 'button', rules: [':root {\n  --destructive-foreground: red;\n}'] },
  ])
})
