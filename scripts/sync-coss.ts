import { writeFile } from 'node:fs/promises'
import { resolveItems } from '../packages/registry/src/coss'
import {
  type CossLock,
  fetchItem,
  itemContent,
  lockPath,
  normalizeImports,
  readLock,
  registry,
  sha256,
  sourceDirectory,
} from './coss'

// Writes COSS items into packages/ui exactly as published, changing only the
// registry import aliases, and records them in the lock. With no arguments it
// refreshes every locked item.
const lock = await readLock()
const requested = process.argv.slice(2)
const queue = requested.length ? requested : Object.keys(lock.items)
if (!queue.length) throw new Error('Usage: bun scripts/sync-coss.ts <items...>')

const fetched = await resolveItems(
  queue,
  (name) => fetchItem(`${registry}/${name}.json`),
  () => false,
)

const next: CossLock = { registry, items: { ...lock.items } }
const dependencies = new Set<string>()
for (const item of fetched) {
  const { name } = item
  const upstream = itemContent(item)
  const content = normalizeImports(upstream)
  await writeFile(`${sourceDirectory}/${name}.tsx`, content)
  next.items[name] = {
    url: `${registry}/${name}.json`,
    upstream: sha256(upstream),
    file: sha256(content),
  }
  for (const dependency of item.dependencies ?? []) dependencies.add(dependency)
}
next.items = Object.fromEntries(
  Object.entries(next.items).sort(([a], [b]) => a.localeCompare(b)),
)
await writeFile(lockPath, `${JSON.stringify(next, null, 2)}\n`)
console.log(
  `Synced ${fetched.length} COSS items. npm dependencies: ${[...dependencies].sort().join(', ')}`,
)
