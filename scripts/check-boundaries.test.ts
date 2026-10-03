import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

const script = join(import.meta.dir, 'check-boundaries.ts')
const owners = ['utils', 'helpers', 'ui', 'elements', 'parttens', 'registry']
let root = ''

async function workspace(sources: Record<string, string>) {
  root = await mkdtemp(join(tmpdir(), 'tc96-boundaries-'))
  await writeFile(join(root, 'tsconfig.json'), '{}')
  await mkdir(join(root, 'packages/ui'), { recursive: true })
  await writeFile(
    join(root, 'packages/ui/coss.lock.json'),
    JSON.stringify({ items: { button: {} } }),
  )
  for (const owner of owners)
    await mkdir(join(root, 'packages', owner, 'src'), { recursive: true })
  for (const [path, content] of Object.entries(sources)) {
    await mkdir(dirname(join(root, path)), { recursive: true })
    await writeFile(join(root, path), content)
  }
  return spawnSync('bun', [script], { cwd: root, encoding: 'utf8' })
}

afterEach(() => rm(root, { recursive: true, force: true }))

test('lets patterns depend on elements, and elements on ui', async () => {
  const result = await workspace({
    'packages/parttens/src/a.ts':
      "import { Text } from '@tc96/elements/text'\n",
    'packages/elements/src/text.tsx':
      "import { Button } from '@tc96/ui/button'\n",
  })
  expect(result.status).toBe(0)
})

test('lets patterns and elements depend on helpers', async () => {
  const result = await workspace({
    'packages/parttens/src/a.ts':
      "import { formatAmount } from '@tc96/helpers/format'\n",
    'packages/elements/src/text.tsx':
      "import { formatAmount } from '@tc96/helpers/format'\n",
    'packages/helpers/src/format.ts': 'export const formatAmount = 1\n',
  })
  expect(result.status).toBe(0)
})

test('rejects helpers depending on React or on another layer', async () => {
  const result = await workspace({
    'packages/helpers/src/format.ts':
      "import { useState } from 'react'\nimport { cn } from '@tc96/utils'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('helpers cannot depend on React or UI')
  expect(result.stderr).toContain('helpers cannot depend on utils')
})

test('rejects ui depending on elements', async () => {
  const result = await workspace({
    'packages/ui/src/button.tsx':
      "import { Text } from '@tc96/elements/text'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('ui cannot depend on elements')
})

test('rejects elements depending on patterns', async () => {
  const result = await workspace({
    'packages/elements/src/text.tsx':
      "import { Kanban } from '@tc96/parttens'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('elements cannot depend on parttens')
})

test('rejects a ui import that is not a locked COSS item', async () => {
  const result = await workspace({
    'packages/parttens/src/a.ts': "import { Text } from '@tc96/ui/text'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('@tc96/ui/text is not a locked COSS item')
})

test('rejects the removed ui barrel', async () => {
  const result = await workspace({
    'packages/parttens/src/a.ts': "import { Button } from '@tc96/ui'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('@tc96/ui is not a locked COSS item')
})
