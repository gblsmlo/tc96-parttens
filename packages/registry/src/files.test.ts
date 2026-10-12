import { afterEach, expect, test } from 'bun:test'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { diffLines, planFiles, targetPath, writeFiles } from './files'

const roots: string[] = []
afterEach(async () => {
  for (const root of roots.splice(0))
    await rm(root, { recursive: true, force: true })
})

async function workspace() {
  const root = await mkdtemp(join(tmpdir(), 'tc96-files-'))
  roots.push(root)
  await mkdir(join(root, 'src'))
  await writeFile(join(root, 'src/same.ts'), 'same')
  await writeFile(join(root, 'src/mine.ts'), 'mine')
  return root
}

const files = [
  {
    path: 'a',
    type: 'registry:file',
    content: 'new',
    target: '~/src/deep/new.ts',
  },
  {
    path: 'b',
    type: 'registry:file',
    content: 'same',
    target: '~/src/same.ts',
  },
  {
    path: 'c',
    type: 'registry:file',
    content: 'theirs',
    target: '~/src/mine.ts',
  },
]

test('plans each file as created, unchanged or in conflict', async () => {
  const root = await workspace()
  const planned = await planFiles(root, files)
  expect(planned.map(({ status }) => status)).toEqual([
    'create',
    'unchanged',
    'conflict',
  ])
  expect(planned[2]?.current).toBe('mine')
})

test('keeps files that differ unless confirm approves them', async () => {
  const root = await workspace()
  const kept = await writeFiles(await planFiles(root, files))
  expect(kept).toEqual({
    written: [join(root, 'src/deep/new.ts')],
    preserved: [join(root, 'src/mine.ts')],
  })
  expect(await readFile(join(root, 'src/mine.ts'), 'utf8')).toBe('mine')
  const asked: string[] = []
  const approved = await writeFiles(
    await planFiles(root, files),
    async (path) => {
      asked.push(path)
      return true
    },
  )
  expect(asked).toEqual([join(root, 'src/mine.ts')])
  expect(approved.preserved).toEqual([])
  expect(await readFile(join(root, 'src/mine.ts'), 'utf8')).toBe('theirs')
})

test('rejects targets outside the ~/ form', () => {
  expect(() => targetPath('/consumer', 'src/a.ts')).toThrow(
    'Invalid registry target',
  )
  expect(targetPath('/consumer', '~/src/a.ts')).toBe('/consumer/src/a.ts')
})

test('diffs lines with context around each change', () => {
  const before = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].join('\n')
  const after = ['1', 'two', '3', '4', '5', '6', '7', '8', 'nine'].join('\n')
  expect(diffLines(before, after, 1)).toBe(
    [' 1', '-2', '+two', ' 3', '@@', ' 8', '-9', '+nine'].join('\n'),
  )
})
