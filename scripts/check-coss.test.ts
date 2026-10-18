import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { contentHash, normalizeImports, sha256 } from './coss'

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
const chat = {
  url: 'https://coss.com/ui/r/chat.json',
  upstream: contentHash(Object.values(chatFiles)),
  file: contentHash(Object.values(chatFiles)),
  paths: Object.keys(chatFiles),
}

async function workspace(
  files: Record<string, string>,
  items: Record<string, unknown> = {},
) {
  root = await mkdtemp(join(tmpdir(), 'tc96-coss-'))
  await mkdir(join(root, 'packages/ui/src'), { recursive: true })
  await writeFile(
    join(root, 'packages/ui/coss.lock.json'),
    JSON.stringify({
      registry: 'https://coss.com/ui/r',
      items: {
        button: {
          url: 'https://coss.com/ui/r/button.json',
          upstream: sha256(upstream),
          file: sha256(normalizeImports(upstream)),
        },
        ...items,
      },
    }),
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

test('accepts an item identical to the locked snapshot', async () => {
  const result = await workspace({ 'button.tsx': normalizeImports(upstream) })
  expect(result.status).toBe(0)
})

test('rejects an item edited by hand', async () => {
  const result = await workspace({
    'button.tsx': normalizeImports(upstream).replace(
      '"use client"',
      "'use client'",
    ),
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain(
    'button: differs from the locked COSS snapshot',
  )
})

test('rejects files that are not locked COSS items', async () => {
  const result = await workspace({
    'button.tsx': normalizeImports(upstream),
    'text.tsx': 'export {}\n',
    'index.ts': 'export {}\n',
  })
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('text: missing from the COSS lock')
  expect(result.stderr).toContain('index.ts: not a COSS item')
})

test('rejects a locked item that was deleted', async () => {
  const result = await workspace({})
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('button: locked but missing')
})

test('accepts a multi-file item at its locked paths', async () => {
  const result = await workspace(
    { 'button.tsx': normalizeImports(upstream), ...chatFiles },
    { chat },
  )
  expect(result.status).toBe(0)
})

test('rejects a file a multi-file item does not lock', async () => {
  const result = await workspace(
    {
      'button.tsx': normalizeImports(upstream),
      ...chatFiles,
      'chat/extra.tsx': 'export {}\n',
    },
    { chat },
  )
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('chat/extra.tsx: not a COSS item')
})

test('rejects a multi-file item with a file missing', async () => {
  const result = await workspace(
    {
      'button.tsx': normalizeImports(upstream),
      'chat/chat-bubble.tsx': chatFiles['chat/chat-bubble.tsx'],
    },
    { chat },
  )
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain(
    'chat: locked but missing chat/hooks/use-chat-scroll.ts',
  )
})
