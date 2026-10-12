import { afterEach, expect, test } from 'bun:test'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  detectPackageManager,
  installCommand,
  missingDependencies,
  parseDependency,
} from './dependencies'

const roots: string[] = []
afterEach(async () => {
  for (const root of roots.splice(0))
    await rm(root, { recursive: true, force: true })
})

async function project(files: Record<string, string>) {
  const root = await mkdtemp(join(tmpdir(), 'tc96-dependencies-'))
  roots.push(root)
  for (const [path, content] of Object.entries(files)) {
    await mkdir(join(root, path, '..'), { recursive: true })
    await writeFile(join(root, path), content)
  }
  return root
}

test('splits scoped and bare dependencies', () => {
  expect(parseDependency('@base-ui/react@1.2.0')).toEqual({
    name: '@base-ui/react',
    declared: '1.2.0',
  })
  expect(parseDependency('@base-ui/react')).toEqual({
    name: '@base-ui/react',
    declared: undefined,
  })
  expect(parseDependency('platejs@^52.0.0')).toEqual({
    name: 'platejs',
    declared: '^52.0.0',
  })
})

test('keeps only undeclared, absent or incompatible dependencies, once each', async () => {
  const root = await project({
    'package.json': JSON.stringify({
      dependencies: { 'lucide-react': '1.28.0' },
      devDependencies: { '@dnd-kit/react': '0.5.0' },
    }),
    'node_modules/lucide-react/package.json': '{"version":"1.28.0"}',
    'node_modules/@dnd-kit/react/package.json': '{"version":"0.5.0"}',
    'node_modules/@platejs/core/package.json': '{"version":"53.0.0"}',
  })
  expect(
    missingDependencies(root, [
      'lucide-react@^1.0.0',
      'lucide-react',
      '@dnd-kit/react@0.6.0',
      '@platejs/core@53.0.0',
      'platejs',
      'platejs@52.0.0',
    ]),
  ).toEqual(['@dnd-kit/react@0.6.0', '@platejs/core@53.0.0', 'platejs@52.0.0'])
})

test('detects the package manager from packageManager, then the lockfile', async () => {
  expect(
    detectPackageManager(
      await project({
        'package.json': '{"packageManager":"pnpm@10.0.0"}',
        'bun.lock': '',
      }),
    ),
  ).toBe('pnpm')
  expect(detectPackageManager(await project({ 'bun.lock': '' }))).toBe('bun')
  expect(detectPackageManager(await project({ 'yarn.lock': '' }))).toBe('yarn')
  expect(detectPackageManager(await project({ 'package.json': '{}' }))).toBe(
    'npm',
  )
})

test('adds to the pnpm workspace root when there is one', async () => {
  const root = await project({ 'pnpm-workspace.yaml': '' })
  expect(installCommand(root, 'pnpm', ['a@1.0.0'])).toEqual([
    'pnpm',
    'add',
    '-w',
    'a@1.0.0',
  ])
  expect(installCommand(root, 'npm', ['a'])).toEqual(['npm', 'install', 'a'])
  expect(installCommand(root, 'bun', ['a'])).toEqual(['bun', 'add', 'a'])
})
