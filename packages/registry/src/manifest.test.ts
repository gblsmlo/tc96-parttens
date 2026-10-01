import { expect, test } from 'bun:test'
import {
  assertDistributable,
  combineItems,
  type InstallConfig,
  omitInstalled,
  prepareItem,
  type RegistryItem,
  selectPatterns,
  validateConfig,
} from './manifest'

const config: InstallConfig = {
  aliases: {
    ui: '@consumer/visual',
    utils: '@consumer/helpers/cn',
    elements: '@consumer/atoms',
    patterns: '@consumer/patterns',
  },
  paths: {
    ui: 'packages/visual/src',
    elements: 'packages/atoms/src',
    patterns: 'packages/patterns/src',
  },
}
function item(path: string, content: string): RegistryItem {
  return {
    name: 'proof',
    type: 'registry:block',
    files: [{ path, type: 'registry:file', content }],
    dependencies: [],
  }
}

test('selects several patterns once and maps legacy view to collection-views', () => {
  expect(selectPatterns(['view', 'properties', 'collection-views'])).toEqual([
    'collection-views',
    'properties',
  ])
})
test('rejects unknown or excluded patterns', () => {
  expect(() => selectPatterns(['filter-builder'])).toThrow('Unknown pattern')
  expect(() => selectPatterns([])).toThrow('Choose')
})
test('maps destinations and imports without corrupting arbitrary string contents', () => {
  const result = prepareItem(
    {
      name: 'proof',
      type: 'registry:block',
      files: [
        {
          path: 'parttens/src/collection-views/proof.ts',
          type: 'registry:file',
          content:
            'import { Button } from "@tc96/ui/button"\nconst text = "@tc96/ui/button"\n',
        },
      ],
      dependencies: [],
    },
    config,
  )
  expect(result.files[0]?.target).toBe(
    '~/packages/patterns/src/collection-views/proof.ts',
  )
  expect(result.files[0]?.content).toContain('from "@consumer/visual/button"')
  expect(result.files[0]?.content).toContain('const text = "@tc96/ui/button"')
})
test('maps elements files and imports to the elements destination', () => {
  const result = prepareItem(
    {
      name: 'proof',
      type: 'registry:block',
      files: [
        {
          path: 'elements/src/text.tsx',
          type: 'registry:file',
          content: 'export const text = 1\n',
        },
        {
          path: 'parttens/src/shared/toolbar.tsx',
          type: 'registry:file',
          content: 'import { Text } from "@tc96/elements/text"\n',
        },
      ],
      dependencies: [],
    },
    config,
  )
  expect(result.files[0]?.target).toBe('~/packages/atoms/src/text.tsx')
  expect(result.files[1]?.content).toContain('from "@consumer/atoms/text"')
})
test('rewrites ui and utils imports to the consumer aliases', () => {
  const result = prepareItem(
    item(
      'parttens/src/shared/toolbar.tsx',
      'import { Button } from "@tc96/ui/button"\nimport { cn } from "@tc96/utils"\n',
    ),
    config,
  )
  expect(result.files[0]?.content).toBe(
    'import { Button } from "@consumer/visual/button"\nimport { cn } from "@consumer/helpers/cn"\n',
  )
})
test('refuses to distribute ui or utils files', () => {
  for (const path of ['ui/src/button.tsx', 'utils/src/index.ts'])
    expect(() => prepareItem(item(path, 'export {}\n'), config)).toThrow(
      'belongs to the consumer and is not distributed',
    )
})
test('refuses to distribute a theme', () => {
  for (const token of [
    ':root {}',
    '.dark {}',
    '@theme inline {}',
    '@utility x {}',
  ])
    expect(() =>
      assertDistributable(item('parttens/src/views/global.css', token)),
    ).toThrow('redefines the theme')
  expect(() =>
    assertDistributable(
      item('parttens/src/views/list.tsx', 'const c = "dark:bg-muted"\n'),
    ),
  ).not.toThrow()
})
test('requires every alias and both destination paths', () => {
  expect(() =>
    validateConfig({
      ...config,
      aliases: { ...config.aliases, elements: undefined },
    } as unknown as InstallConfig),
  ).toThrow('Invalid elements alias')
  expect(() =>
    validateConfig({
      ...config,
      paths: { ...config.paths, elements: '../outside' },
    }),
  ).toThrow('elements path must be inside the consumer workspace')
})
test('combines COSS dependencies and leaves out the installed ones', () => {
  const combined = combineItems([
    {
      ...item('parttens/src/a.ts', ''),
      registryDependencies: ['@coss/menu', '@coss/button'],
    },
    {
      ...item('parttens/src/b.ts', ''),
      registryDependencies: ['@coss/button', '@coss/empty'],
    },
  ])
  expect(combined.registryDependencies).toEqual([
    '@coss/button',
    '@coss/empty',
    '@coss/menu',
  ])
  const installed = new Set(['button', 'menu'])
  expect(
    omitInstalled(combined, (component) => installed.has(component))
      .registryDependencies,
  ).toEqual(['@coss/empty'])
})
