import { describe, expect, it } from 'bun:test'
import { existsSync } from 'node:fs'
import path from 'node:path'
import {
  hasBunTests,
  isScope,
  parseBunTest,
  parseVitestSummary,
  readScopes,
  resolveScope,
  storyDirs,
} from './test-scope'

const root = path.resolve(import.meta.dir, '..')
const scopes = readScopes()

describe('scopes.json', () => {
  for (const name of Object.keys(scopes)) {
    it(`${name} points at existing paths`, () => {
      const scope = resolveScope(scopes, name)
      for (const dir of [...scope.bun, ...scope.biome])
        expect(existsSync(path.join(root, dir))).toBe(true)
      for (const dir of scope.stories)
        expect(existsSync(path.join(root, 'apps/storybook', dir))).toBe(true)
      for (const file of Object.values(scope.watch ?? {}))
        expect(existsSync(path.join(root, file))).toBe(true)
      for (const dep of scope.dependents)
        expect(isScope(scopes, dep)).toBe(true)
    })
  }

  it('adds the dependents story folders with --deps', () => {
    expect(storyDirs(scopes, 'collection', false)).toEqual([
      'src/patterns/collection/',
    ])
    expect(storyDirs(scopes, 'collection', true)).toContain(
      'src/patterns/kanban/',
    )
  })
})

describe('derived scopes', () => {
  it('derives a pattern folder that scopes.json does not list', () => {
    expect(resolveScope(scopes, 'records/dialog')).toEqual({
      bun: ['packages/ui/src/patterns/records/dialog'],
      stories: ['src/patterns/records/dialog/'],
      biome: [
        'packages/ui/src/patterns/records/dialog',
        'apps/storybook/src/patterns/records/dialog',
      ],
      dependents: [],
    })
  })

  it('rejects a folder that is not a pattern', () => {
    expect(isScope(scopes, 'nope')).toBe(false)
  })

  it('tells whether a scope has bun tests', () => {
    expect(hasBunTests(['packages/ui/src/patterns/collection'])).toBe(true)
    expect(hasBunTests(['packages/ui/src/patterns/stats'])).toBe(false)
  })
})

describe('parsers', () => {
  it('reads the bun test summary', () => {
    expect(
      parseBunTest(' 12 pass\n 1 fail\nRan 13 tests across 4 files. [1.20s]'),
    ).toEqual({ tests: 13, files: 4, passed: 12, failed: 1, skipped: 0 })
  })

  it('reads the vitest summary', () => {
    const output =
      ' Test Files  3 passed (3)\n      Tests  20 passed | 2 skipped (22)\n'
    expect(parseVitestSummary(output)).toEqual({
      files: 3,
      tests: 22,
      passed: 20,
      failed: 0,
      skipped: 2,
    })
  })
})
