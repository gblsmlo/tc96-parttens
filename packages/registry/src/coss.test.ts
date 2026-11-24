import { afterEach, expect, test } from 'bun:test'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  type CossRegistryItem,
  componentFiles,
  loadUiItem,
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
  expect(
    normalizeImports(
      'import { a } from "@/registry/default/lib/composer-editor";\nimport { b } from "@/registry/default/hooks/use-media-query";',
      aliases,
    ),
  ).toBe(
    'import { a } from "@acme/ui/lib/composer-editor";\nimport { b } from "@acme/ui/hooks/use-media-query";',
  )
})

test('loads a ui item from the registry directory', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tc96-coss-'))
  roots.push(root)
  await mkdir(join(root, 'ui'))
  await writeFile(join(root, 'ui/badge.json'), JSON.stringify(item('badge')))
  expect((await loadUiItem(root, 'badge')).name).toBe('badge')
  await expect(loadUiItem(root, 'missing')).rejects.toThrow(
    'Unknown ui component: missing',
  )
})

test('rewrites the repo aliases to the given ones', () => {
  expect(
    normalizeImports(
      'import { cn } from "@tc96/utils"\nimport { Spinner } from "@tc96/ui/spinner"',
      aliases,
    ),
  ).toBe(
    'import { cn } from "@acme/ui/lib/utils"\nimport { Spinner } from "@acme/ui/spinner"',
  )
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

test('rejects dependencies outside @ui and renamed items', async () => {
  await expect(
    resolveItems(
      ['https://example.test/r/button.json'],
      async () => item('button'),
      () => false,
    ),
  ).rejects.toThrow('Unsupported ui registry dependency')
  await expect(
    resolveItems(
      ['@coss/button'],
      async () => item('toggle'),
      () => false,
    ),
  ).rejects.toThrow('published as toggle')
})

const directories = (ui: string) => ({
  ui,
  hooks: `${ui}/hooks`,
  lib: `${ui}/lib`,
})

test('targets the ui directory with the consumer aliases', () => {
  expect(
    componentFiles(
      item('badge', 'import { cn } from "@/lib/utils"'),
      aliases,
      directories('packages/ui/src'),
    ),
  ).toEqual([
    {
      path: 'ui/badge.tsx',
      type: 'registry:ui',
      content: 'import { cn } from "@acme/ui/lib/utils"',
      target: '~/packages/ui/src/badge.tsx',
    },
  ])
})

test('targets the hooks directory for a COSS hook', () => {
  expect(
    componentFiles(
      {
        name: 'use-media-query',
        files: [
          {
            path: 'registry/default/hooks/use-media-query.ts',
            content: 'export function useMediaQuery() {}',
          },
        ],
      },
      aliases,
      directories('packages/ui/src'),
    ),
  ).toEqual([
    {
      path: 'ui/hooks/use-media-query.ts',
      type: 'registry:ui',
      content: 'export function useMediaQuery() {}',
      target: '~/packages/ui/src/hooks/use-media-query.ts',
    },
  ])
})

test('targets separate hooks and lib directories, as in tc96-mono', () => {
  expect(
    componentFiles(
      {
        name: 'composer',
        files: [
          {
            path: 'registry/default/hooks/use-composer-editor.ts',
            content: 'import { e } from "@tc96/ui/lib/composer-editor"',
          },
          {
            path: 'registry/default/lib/composer-editor.ts',
            content: 'export const e = 1',
          },
        ],
      },
      {
        ui: '@tc96/ui',
        utils: '@tc96/utils',
        hooks: '@tc96/ui/hooks',
        lib: '@tc96/ui/lib',
      },
      {
        ui: 'packages/ui/src/components',
        hooks: 'packages/ui/src/hooks',
        lib: 'packages/ui/src/lib',
      },
    ).map(({ target, content }) => ({ target, content })),
  ).toEqual([
    {
      target: '~/packages/ui/src/hooks/use-composer-editor.ts',
      content: 'import { e } from "@tc96/ui/lib/composer-editor"',
    },
    {
      target: '~/packages/ui/src/lib/composer-editor.ts',
      content: 'export const e = 1',
    },
  ])
})

test('fails on items it cannot install faithfully', () => {
  expect(() =>
    componentFiles(
      item('chart', 'import { useMobile } from "@/hooks/use-mobile"'),
      aliases,
      directories('src/ui'),
    ),
  ).toThrow('@/hooks/use-mobile in chart.tsx has no alias')
  expect(() =>
    componentFiles(
      item('form', '', { envVars: { KEY: '' } }),
      aliases,
      directories('src/ui'),
    ),
  ).toThrow('envVars')
  expect(() =>
    componentFiles(
      {
        name: 'utils',
        files: [{ path: 'registry/default/lib/utils.ts', content: '' }],
      },
      aliases,
      directories('src/ui'),
    ),
  ).toThrow('own utils')
  expect(() =>
    componentFiles(
      { name: 'odd', files: [{ path: 'elsewhere/odd.tsx', content: '' }] },
      aliases,
      directories('src/ui'),
    ),
  ).toThrow('outside registry/default')
  expect(() =>
    componentFiles(
      item('chat', '', {
        files: [
          { path: 'registry/default/chat/a.tsx', content: '' },
          {
            path: 'registry/default/chat/b.tsx',
            content: 'import x from "@/hooks/use-mobile"',
          },
        ],
      }),
      aliases,
      directories('src/ui'),
    ),
  ).toThrow('@/hooks/use-mobile in chat/b.tsx has no alias')
})

test('maps every file of a multi-file item and rewrites its imports', () => {
  expect(
    componentFiles(
      {
        name: 'chat',
        files: [
          {
            path: 'registry/default/chat/chat-bubble.tsx',
            content:
              'import { m } from "@/registry/default/chat/chat-message-bubble"\nimport { cn } from "@/lib/utils"',
          },
          {
            path: 'registry/default/chat/hooks/use-chat-scroll.ts',
            content: 'import { b } from "@/registry/default/ui/button"',
          },
          {
            path: 'registry/default/chat/lib/split-chat-message-preview.ts',
            content: 'import { h } from "@/registry/default/hooks/use-x"',
          },
        ],
      },
      aliases,
      directories('src/ui'),
    ),
  ).toEqual([
    {
      path: 'ui/chat/chat-bubble.tsx',
      type: 'registry:ui',
      content:
        'import { m } from "@acme/ui/chat/chat-message-bubble"\nimport { cn } from "@acme/ui/lib/utils"',
      target: '~/src/ui/chat/chat-bubble.tsx',
    },
    {
      path: 'ui/chat/hooks/use-chat-scroll.ts',
      type: 'registry:ui',
      content: 'import { b } from "@acme/ui/button"',
      target: '~/src/ui/chat/hooks/use-chat-scroll.ts',
    },
    {
      path: 'ui/chat/lib/split-chat-message-preview.ts',
      type: 'registry:ui',
      content: 'import { h } from "@acme/ui/hooks/use-x"',
      target: '~/src/ui/chat/lib/split-chat-message-preview.ts',
    },
  ])
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
