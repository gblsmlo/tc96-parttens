import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { patternNames } from './manifest'

test('help lists every pattern', () => {
  const result = spawnSync(
    process.execPath,
    [join(import.meta.dir, 'cli.ts'), '--help'],
    { encoding: 'utf8' },
  )
  expect(result.status).toBe(0)
  expect(result.stdout).toContain(`Patterns: ${patternNames.join(' ')}\n`)
})
