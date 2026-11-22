import { afterEach, expect, test } from 'bun:test'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { checkCompatibility, diagnoseDependents } from './check-compatibility'
import type { RegistryItem } from './manifest'

const roots: string[] = []
afterEach(async () => {
  for (const root of roots.splice(0))
    await rm(root, { recursive: true, force: true })
})

async function write(root: string, path: string, content: string) {
  await mkdir(dirname(join(root, path)), { recursive: true })
  await writeFile(join(root, path), content)
}

async function consumer(files: Record<string, string>) {
  const root = await mkdtemp(join(tmpdir(), 'tc96-compat-'))
  roots.push(root)
  await write(
    root,
    'tsconfig.json',
    JSON.stringify({
      compilerOptions: {
        module: 'ESNext',
        moduleResolution: 'Bundler',
        strict: true,
        paths: {
          '@consumer/patterns/*': ['./src/patterns/*'],
          '@consumer/blocks/*': ['./src/blocks/*'],
        },
      },
    }),
  )
  for (const [path, content] of Object.entries(files))
    await write(root, path, content)
  return root
}

function patternItem(content: string): RegistryItem {
  return {
    name: 'checklist',
    type: 'registry:block',
    dependencies: [],
    files: [
      {
        path: 'parttens/src/checklist/proof.ts',
        type: 'registry:file',
        target: '~/src/patterns/checklist/proof.ts',
        content,
      },
    ],
  }
}

const proof = 'export const proof = 1\n'
const usesProof = (extra = '') =>
  `import { proof } from '@consumer/patterns/checklist/proof'\nexport const value: number = proof\n${extra}`
const block = 'src/blocks/shell/uses-proof.ts'

test('an installed block that uses a removed export makes the update incompatible', async () => {
  const root = await consumer({
    'src/patterns/checklist/proof.ts': proof,
    [block]: usesProof(),
  })
  const dependents = [join(root, block)]
  const known = diagnoseDependents(root, dependents)
  expect(known.size).toBe(0)
  const item = patternItem('export const renamed = 1\n')

  const alone = await checkCompatibility(root, item)
  expect(alone.status).toBe('compatible')

  const before = await checkCompatibility(root, item, false, {
    dependents,
    known,
  })
  expect(before.status).toBe('incompatible')
  expect(
    before.diagnostics.some((line) => line.includes('uses-proof.ts')),
  ).toBe(true)

  await write(
    root,
    'src/patterns/checklist/proof.ts',
    item.files[0]?.content ?? '',
  )
  const after = await checkCompatibility(root, item, true, {
    dependents,
    known,
  })
  expect(after.status).toBe('incompatible')
  expect(after.diagnostics.some((line) => line.includes('uses-proof.ts'))).toBe(
    true,
  )
})

test('an update that keeps the exports blocks use stays compatible', async () => {
  const root = await consumer({
    'src/patterns/checklist/proof.ts': proof,
    [block]: usesProof(),
  })
  const dependents = [join(root, block)]
  const report = await checkCompatibility(
    root,
    patternItem('export const proof = 2\nexport const added = 3\n'),
    false,
    { dependents, known: diagnoseDependents(root, dependents) },
  )
  expect(report.status).toBe('compatible')
})

test('a type error a block already had is not reported', async () => {
  const root = await consumer({
    'src/patterns/checklist/proof.ts': proof,
    [block]: usesProof(),
    'src/blocks/shell/broken.ts': 'export const broken: string = 1\n',
  })
  const dependents = [
    join(root, block),
    join(root, 'src/blocks/shell/broken.ts'),
  ]
  const known = diagnoseDependents(root, dependents)
  expect(known.size).toBe(1)
  const item = patternItem('export const proof = 2\n')

  const unfiltered = await checkCompatibility(root, item, false, { dependents })
  expect(unfiltered.status).toBe('incompatible')
  expect(
    unfiltered.diagnostics.some((line) => line.includes('broken.ts')),
  ).toBe(true)

  const filtered = await checkCompatibility(root, item, false, {
    dependents,
    known,
  })
  expect(filtered.status).toBe('compatible')
  expect(filtered.diagnostics).toEqual([])
})

test('a dependent that the update overwrites is checked once, as part of the item', async () => {
  const root = await consumer({
    'src/patterns/checklist/proof.ts': proof,
  })
  const target = join(root, 'src/patterns/checklist/proof.ts')
  const report = await checkCompatibility(
    root,
    patternItem('export const proof = 2\n'),
    false,
    { dependents: [target], known: new Set() },
  )
  expect(report.status).toBe('compatible')
})

test('without blocks the check is the same as before', async () => {
  const root = await consumer({ 'src/patterns/checklist/proof.ts': proof })
  expect(diagnoseDependents(root, []).size).toBe(0)
  const item = patternItem('export const renamed: string = 1\n')
  const plain = await checkCompatibility(root, item)
  const empty = await checkCompatibility(root, item, false, {
    dependents: [],
    known: new Set(),
  })
  expect(plain.status).toBe('incompatible')
  expect(empty).toEqual(plain)
})
