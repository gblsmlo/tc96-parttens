import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

const script = join(import.meta.dir, 'check-boundaries.ts')
const owners = [
  'packages/utils/src',
  'packages/registry/src',
  'packages/ui/src/components',
  'packages/ui/src/helpers',
  'packages/ui/src/patterns',
  'packages/ui/src/blocks',
]
let root = ''

async function workspace(sources: Record<string, string>) {
  root = await mkdtemp(join(tmpdir(), 'tc96-boundaries-'))
  await writeFile(join(root, 'tsconfig.json'), '{}')
  await mkdir(join(root, 'packages/ui'), { recursive: true })
  await writeFile(
    join(root, 'packages/ui/ui.manifest.json'),
    JSON.stringify({ items: { button: {} } }),
  )
  for (const owner of owners)
    await mkdir(join(root, owner), { recursive: true })
  for (const [path, content] of Object.entries(sources)) {
    await mkdir(dirname(join(root, path)), { recursive: true })
    await writeFile(join(root, path), content)
  }
  return spawnSync('bun', [script], { cwd: root, encoding: 'utf8' })
}

afterEach(() => rm(root, { recursive: true, force: true }))

test('lets patterns depend on ui', async () => {
  const result = await workspace({
    'packages/ui/src/patterns/a.ts':
      "import { Button } from '@tc96/ui/button'\n",
  })
  expect(result.status).toBe(0)
})

test('lets patterns depend on helpers', async () => {
  const result = await workspace({
    'packages/ui/src/patterns/a.ts':
      "import { formatAmount } from '@tc96/ui/helpers/format'\n",
    'packages/ui/src/helpers/format.ts': 'export const formatAmount = 1\n',
  })
  expect(result.status).toBe(0)
})

test('rejects helpers depending on React or on another layer', async () => {
  const result = await workspace({
    'packages/ui/src/helpers/format.ts':
      "import { useState } from 'react'\nimport { cn } from '@tc96/utils'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('helpers cannot depend on React or UI')
  expect(result.stderr).toContain('helpers cannot depend on utils')
})

test('rejects ui depending on patterns', async () => {
  const result = await workspace({
    'packages/ui/src/components/button.tsx':
      "import { Kanban } from '@tc96/ui/patterns'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('ui cannot depend on patterns')
})

test('rejects imports of the removed elements layer', async () => {
  const result = await workspace({
    'packages/ui/src/patterns/a.ts':
      "import { Text } from '@tc96/elements/text'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('patterns cannot depend on elements')
})

test('lets blocks depend on patterns and ui', async () => {
  const result = await workspace({
    'packages/ui/src/blocks/a.tsx':
      "import { WidgetShell } from '@tc96/ui/patterns'\nimport { Button } from '@tc96/ui/button'\n",
  })
  expect(result.status).toBe(0)
})

test('rejects patterns depending on blocks', async () => {
  const result = await workspace({
    'packages/ui/src/patterns/a.ts':
      "import { AppShell1 } from '@tc96/ui/blocks/application/shell/app-shell-1'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('patterns cannot depend on blocks')
})

test('rejects blocks depending on the registry', async () => {
  const result = await workspace({
    'packages/ui/src/blocks/a.ts':
      "import { patternNames } from '@tc96/registry'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('blocks cannot depend on registry')
})

test("lets a block depend on its own folder and its group's shared", async () => {
  const result = await workspace({
    'packages/ui/src/blocks/application/shell/app-shell-1/app-shell-1.tsx':
      "import { nav } from './nav'\nimport { labels } from '../shared/labels'\nexport const page = [nav, labels]\n",
    'packages/ui/src/blocks/application/shell/app-shell-1/nav.ts':
      'export const nav = []\n',
    'packages/ui/src/blocks/application/shell/shared/labels.ts':
      'export const labels = {}\n',
  })
  expect(result.status).toBe(0)
})

test("lets a grouped block depend on its category's shared", async () => {
  const result = await workspace({
    'packages/ui/src/blocks/data/support/support-1/support-1.tsx':
      "import { frame } from '../../shared/grid/grid-frame'\nexport const page = frame\n",
    'packages/ui/src/blocks/data/shared/grid/grid-frame.ts':
      "import { select } from '../properties/data-select'\nexport const frame = select\n",
    'packages/ui/src/blocks/data/shared/properties/data-select.ts':
      'export const select = {}\n',
  })
  expect(result.status).toBe(0)
})

test("rejects a grouped block depending on another category's shared", async () => {
  const result = await workspace({
    'packages/ui/src/blocks/application/shell/app-shell-1/app-shell-1.tsx':
      "import { frame } from '../../../data/shared/grid/grid-frame'\nexport const page = frame\n",
    'packages/ui/src/blocks/data/shared/grid/grid-frame.ts':
      'export const frame = {}\n',
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain(
    'a block cannot depend on packages/ui/src/blocks/data/shared/grid/grid-frame.ts',
  )
})

test('rejects a block depending on another block of its group', async () => {
  const result = await workspace({
    'packages/ui/src/blocks/application/shell/app-shell-2/app-shell-2.tsx':
      "import { page } from '../app-shell-1/app-shell-1'\nexport const next = page\n",
    'packages/ui/src/blocks/application/shell/app-shell-1/app-shell-1.tsx':
      'export const page = 1\n',
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain(
    'a block cannot depend on packages/ui/src/blocks/application/shell/app-shell-1/app-shell-1.tsx',
  )
})

test("rejects a block depending on another group's shared", async () => {
  const result = await workspace({
    'packages/ui/src/blocks/application/shell/app-shell-1/app-shell-1.tsx':
      "import { labels } from '../../settings/shared/labels'\nexport const page = labels\n",
    'packages/ui/src/blocks/application/settings/shared/labels.ts':
      'export const labels = {}\n',
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain(
    'a block cannot depend on packages/ui/src/blocks/application/settings/shared/labels.ts',
  )
})

test("lets a block of a category without groups depend on its own folder and the category's shared", async () => {
  const result = await workspace({
    'packages/ui/src/blocks/auth/login-1/login-1.tsx':
      "import { fields } from './components/fields'\nimport { labels } from '../shared/lib/labels'\nexport const page = [fields, labels]\n",
    'packages/ui/src/blocks/auth/login-1/components/fields.ts':
      "import { labels } from '../../shared/lib/labels'\nexport const fields = [labels]\n",
    'packages/ui/src/blocks/auth/shared/lib/labels.ts':
      'export const labels = {}\n',
  })
  expect(result.status).toBe(0)
})

test('rejects a block of a category without groups depending on another block of it', async () => {
  const result = await workspace({
    'packages/ui/src/blocks/auth/login-2/login-2.tsx':
      "import { page } from '../login-1/login-1'\nexport const next = page\n",
    'packages/ui/src/blocks/auth/login-1/login-1.tsx':
      'export const page = 1\n',
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain(
    'a block cannot depend on packages/ui/src/blocks/auth/login-1/login-1.tsx',
  )
})

test('rejects a block of a category without groups depending on a nested file of another block', async () => {
  const result = await workspace({
    'packages/ui/src/blocks/auth/login-2/components/form.tsx':
      "import { fields } from '../../login-1/components/fields'\nexport const form = fields\n",
    'packages/ui/src/blocks/auth/login-1/components/fields.ts':
      'export const fields = []\n',
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain(
    'a block cannot depend on packages/ui/src/blocks/auth/login-1/components/fields.ts',
  )
})

test("rejects a block of a category without groups depending on another category's shared", async () => {
  const result = await workspace({
    'packages/ui/src/blocks/auth/login-1/login-1.tsx':
      "import { labels } from '../../application/shell/shared/labels'\nexport const page = labels\n",
    'packages/ui/src/blocks/application/shell/shared/labels.ts':
      'export const labels = {}\n',
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain(
    'a block cannot depend on packages/ui/src/blocks/application/shell/shared/labels.ts',
  )
})

test("rejects a grouped block depending on a category's shared without groups", async () => {
  const result = await workspace({
    'packages/ui/src/blocks/application/shell/app-shell-1/app-shell-1.tsx':
      "import { labels } from '../../../auth/shared/labels'\nexport const page = labels\n",
    'packages/ui/src/blocks/auth/shared/labels.ts':
      'export const labels = {}\n',
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain(
    'a block cannot depend on packages/ui/src/blocks/auth/shared/labels.ts',
  )
})

test('rejects a ui import that is not in the ui manifest', async () => {
  const result = await workspace({
    'packages/ui/src/patterns/a.ts': "import { Text } from '@tc96/ui/text'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('@tc96/ui/text is not in the ui manifest')
})

test('rejects the removed ui barrel', async () => {
  const result = await workspace({
    'packages/ui/src/patterns/a.ts': "import { Button } from '@tc96/ui'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('@tc96/ui is not in the ui manifest')
})

test('keeps @xyflow/react inside the flow canvas pattern', () => {
  const repository = join(import.meta.dir, '..')
  const offenders = ['packages/ui/src/patterns', 'packages/ui/src/blocks']
    .flatMap((folder) =>
      readdirSync(join(repository, folder), { recursive: true }).map((path) =>
        join(folder, String(path)),
      ),
    )
    .filter((path) => /\.(ts|tsx)$/.test(path))
    .filter((path) =>
      /['"]@xyflow\/react/.test(readFileSync(join(repository, path), 'utf8')),
    )
    .filter((path) => !path.startsWith('packages/ui/src/patterns/flow/canvas/'))
  expect(offenders).toEqual([])
})
