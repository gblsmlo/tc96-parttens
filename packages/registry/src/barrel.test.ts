import { afterEach, expect, test } from 'bun:test'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { aggregateBarrel, barrelHeader, writeBarrel } from './barrel'

const aggregate = `'use client'

export * from './collection-views/index'
export * from './shared/index'
export * from './properties/index'
export { KanbanView as Kanban } from './collection-views/index'
`
const roots: string[] = []
afterEach(async () => {
  for (const root of roots.splice(0))
    await rm(root, { recursive: true, force: true })
})

test('exports only the installed modules, keeping directives and aliases', () => {
  const installed = new Set(['./collection-views/index', './shared/index'])
  expect(aggregateBarrel(aggregate, (module) => installed.has(module))).toBe(
    `${barrelHeader}

'use client'
export * from './collection-views/index'
export * from './shared/index'
export { KanbanView as Kanban } from './collection-views/index'
`,
  )
  expect(
    aggregateBarrel(aggregate, (module) => module === './properties/index'),
  ).not.toContain('Kanban')
})
test('refuses an aggregate with code of its own', () => {
  expect(() =>
    aggregateBarrel(`${aggregate}export const x = 1\n`, () => true),
  ).toThrow('may only hold directives and re-exports')
})
test('rewrites its own barrel and preserves one the consumer wrote', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tc96-barrel-'))
  roots.push(root)
  const path = join(root, 'index.ts')
  expect(await writeBarrel(path, `${barrelHeader}\nA\n`)).toBe('written')
  expect(await writeBarrel(path, `${barrelHeader}\nA\n`)).toBe('unchanged')
  expect(await writeBarrel(path, `${barrelHeader}\nB\n`)).toBe('written')
  await writeFile(path, 'export * from "./mine"\n')
  expect(await writeBarrel(path, `${barrelHeader}\nC\n`)).toBe('preserved')
  expect(await readFile(path, 'utf8')).toBe('export * from "./mine"\n')
})
