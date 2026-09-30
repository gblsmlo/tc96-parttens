import { expect, test } from 'bun:test'
import { prepareItem, selectPatterns } from './manifest'

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
