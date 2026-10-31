import { afterEach, expect, test } from 'bun:test'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  dependencyTarget,
  installCommand,
  missingDependencies,
} from './dependencies'

const roots: string[] = []
afterEach(async () => {
  for (const root of roots.splice(0))
    await rm(root, { recursive: true, force: true })
})

async function monorepo(rootManifest: Record<string, unknown>) {
  const root = await mkdtemp(join(tmpdir(), 'tc96-deps-'))
  roots.push(root)
  await writeFile(join(root, 'package.json'), JSON.stringify(rootManifest))
  await mkdir(join(root, 'packages/ui/src/patterns'), { recursive: true })
  await writeFile(
    join(root, 'packages/ui/package.json'),
    JSON.stringify({
      name: '@acme/ui',
      dependencies: { zod: '4.0.0' },
    }),
  )
  await mkdir(join(root, 'node_modules/zod'), { recursive: true })
  await writeFile(
    join(root, 'node_modules/zod/package.json'),
    JSON.stringify({ version: '4.1.0' }),
  )
  return root
}

test('targets the workspace package that holds the patterns path', async () => {
  const root = await monorepo({ workspaces: ['packages/*'] })
  expect(dependencyTarget(root, 'packages/ui/src/patterns')).toEqual({
    directory: 'packages/ui',
    name: '@acme/ui',
  })
})

test('targets the root outside a workspace', async () => {
  const root = await monorepo({ name: 'app' })
  expect(dependencyTarget(root, 'packages/ui/src/patterns')).toBeUndefined()
})

test('counts a dependency the target package declares as installed', async () => {
  const root = await monorepo({ workspaces: ['packages/*'] })
  const target = dependencyTarget(root, 'packages/ui/src/patterns')
  expect(missingDependencies(root, ['zod@^4.0.0', 'clsx'], target)).toEqual([
    'clsx',
  ])
  expect(missingDependencies(root, ['zod@^4.0.0'])).toEqual(['zod@^4.0.0'])
})

test('installs into the target package with each package manager', () => {
  const target = { directory: 'packages/ui', name: '@acme/ui' }
  expect(installCommand('/repo', 'bun', ['zod'], target)).toEqual([
    'bun',
    'add',
    '--cwd',
    'packages/ui',
    'zod',
  ])
  expect(installCommand('/repo', 'pnpm', ['zod'], target)).toEqual([
    'pnpm',
    'add',
    '--dir',
    'packages/ui',
    'zod',
  ])
  expect(installCommand('/repo', 'npm', ['zod'], target)).toEqual([
    'npm',
    'install',
    '-w',
    'packages/ui',
    'zod',
  ])
  expect(installCommand('/repo', 'yarn', ['zod'], target)).toEqual([
    'yarn',
    'workspace',
    '@acme/ui',
    'add',
    'zod',
  ])
})
