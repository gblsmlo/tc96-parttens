import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { normalizeImports, sha256 } from './coss'

const script = join(import.meta.dir, 'check-coss.ts')
const upstream = `"use client";

import { cn } from "@/registry/default/lib/utils";
import { Spinner } from "@/registry/default/ui/spinner";
`
let root = ''

async function workspace(files: Record<string, string>) {
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
      },
    }),
  )
  for (const [name, content] of Object.entries(files))
    await writeFile(join(root, 'packages/ui/src', name), content)
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
