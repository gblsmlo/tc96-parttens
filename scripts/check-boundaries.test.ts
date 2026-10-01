import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

const script = join(import.meta.dir, 'check-boundaries.ts')
const owners = ['utils', 'ui', 'elements', 'parttens', 'registry']
let root = ''

async function workspace(sources: Record<string, string>) {
  root = await mkdtemp(join(tmpdir(), 'tc96-boundaries-'))
  await writeFile(join(root, 'tsconfig.json'), '{}')
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
    'packages/parttens/src/a.ts': "import { Text } from '@tc96/elements/text'\n",
    'packages/elements/src/text.tsx': "import { Button } from '@tc96/ui/button'\n",
  })
  expect(result.status).toBe(0)
})

test('rejects ui depending on elements', async () => {
  const result = await workspace({
    'packages/ui/src/button.tsx': "import { Text } from '@tc96/elements/text'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('ui cannot depend on elements')
})

test('rejects elements depending on patterns', async () => {
  const result = await workspace({
    'packages/elements/src/text.tsx': "import { Kanban } from '@tc96/parttens'\n",
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('elements cannot depend on parttens')
})
