import { expect, test } from 'bun:test'
import {
  type InstallConfig,
  prepareItem,
  selectPatterns,
  validateConfig,
} from './manifest'

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
    {
      patterns: { path: 'packages/patterns/src', alias: '@consumer/patterns' },
      elements: { path: 'packages/atoms/src', alias: '@consumer/atoms' },
      ui: { path: 'packages/visual/src', alias: '@consumer/visual' },
      utils: { path: 'packages/helpers/src', alias: '@consumer/helpers' },
    },
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
    {
      patterns: { path: 'packages/patterns/src', alias: '@consumer/patterns' },
      elements: { path: 'packages/atoms/src', alias: '@consumer/atoms' },
      ui: { path: 'packages/visual/src', alias: '@consumer/visual' },
      utils: { path: 'packages/helpers/src', alias: '@consumer/helpers' },
    },
  )
  expect(result.files[0]?.target).toBe('~/packages/atoms/src/text.tsx')
  expect(result.files[1]?.content).toContain('from "@consumer/atoms/text"')
})
test('requires every destination, including elements', () => {
  expect(() =>
    validateConfig({
      patterns: { path: 'packages/patterns/src', alias: '@consumer/patterns' },
      ui: { path: 'packages/visual/src', alias: '@consumer/visual' },
      utils: { path: 'packages/helpers/src', alias: '@consumer/helpers' },
    } as InstallConfig),
  ).toThrow('Invalid elements destination')
})
