import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { normalizeImports } from './coss'

const script = join(import.meta.dir, 'check-coss.ts')
const upstream = `"use client";

import { cn } from "@/registry/default/lib/utils";
import { Spinner } from "@/registry/default/ui/spinner";
`
let root = ''

const chatFiles = {
  'chat/chat-bubble.tsx': 'export const bubble = 1\n',
  'chat/hooks/use-chat-scroll.ts': 'export const scroll = 1\n',
}
const chat = { origin: 'coss', paths: Object.keys(chatFiles) }

async function workspace(
  files: Record<string, string>,
  items: Record<string, unknown> = {},
) {
  root = await mkdtemp(join(tmpdir(), 'tc96-ui-'))
  await mkdir(join(root, 'packages/ui/src'), { recursive: true })
  await writeFile(
    join(root, 'packages/ui/ui.manifest.json'),
    JSON.stringify({ items: { button: { origin: 'coss' }, ...items } }),
  )
  for (const [name, content] of Object.entries(files)) {
    await mkdir(dirname(join(root, 'packages/ui/src', name)), {
      recursive: true,
    })
    await writeFile(join(root, 'packages/ui/src', name), content)
  }
  return spawnSync('bun', [script], { cwd: root, encoding: 'utf8' })
}

afterEach(() => rm(root, { recursive: true, force: true }))

test('rewrites only the registry aliases to the workspace packages', () => {
  expect(normalizeImports(upstream)).toBe(`"use client";

import { cn } from "@tc96/utils";
import { Spinner } from "@tc96/ui/spinner";
`)
  expect(normalizeImports('import { cn } from "@/lib/utils";')).toBe(
    'import { cn } from "@tc96/utils";',
  )
})

test('accepts an item edited by hand', async () => {
  const result = await workspace({
    'button.tsx': normalizeImports(upstream).replace(
      '"use client"',
      "'use client'",
    ),
  })
  expect(result.status).toBe(0)
})

test('rejects files that are not in the manifest', async () => {
  const result = await workspace({
    'button.tsx': 'export {}\n',
    'text.tsx': 'export {}\n',
    'index.ts': 'export {}\n',
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('text: missing from the ui manifest')
  expect(result.stderr).toContain('index.ts: not in the ui manifest')
})

test('rejects a manifest item that was deleted', async () => {
  const result = await workspace({})
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('button: in the manifest but missing')
})

test('accepts a multi-file item at its listed paths', async () => {
  const result = await workspace(
    { 'button.tsx': 'export {}\n', ...chatFiles },
    { chat },
  )
  expect(result.status).toBe(0)
})

test('rejects a file a multi-file item does not list', async () => {
  const result = await workspace(
    {
      'button.tsx': 'export {}\n',
      ...chatFiles,
      'chat/extra.tsx': 'export {}\n',
    },
    { chat },
  )
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('chat/extra.tsx: not in the ui manifest')
})

test('rejects a multi-file item with a file missing', async () => {
  const result = await workspace(
    {
      'button.tsx': 'export {}\n',
      'chat/chat-bubble.tsx': chatFiles['chat/chat-bubble.tsx'],
    },
    { chat },
  )
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain(
    'chat: in the manifest but missing chat/hooks/use-chat-scroll.ts',
  )
})
