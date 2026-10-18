import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { resolveItems } from '../packages/registry/src/coss'
import {
  type CossLock,
  contentHash,
  fetchItem,
  itemFiles,
  lockPath,
  normalizeImports,
  readLock,
  registry,
  sourceDirectory,
} from './coss'

// Writes COSS items into packages/ui exactly as published, changing only the
// registry import aliases, and records them in the lock. With no arguments it
// refreshes every locked item. Named items bring only their missing
// dependencies; COSS utils is @tc96/utils.
const lock = await readLock()
const requested = process.argv.slice(2)
const queue = requested.length ? requested : Object.keys(lock.items)
if (!queue.length) throw new Error('Usage: bun scripts/sync-coss.ts <items...>')

const fetched = await resolveItems(
  queue,
  (name) => fetchItem(`${registry}/${name}.json`),
  (name) =>
    name === 'utils' ||
    (requested.length > 0 && !requested.includes(name) && name in lock.items),
)

const next: CossLock = { registry, items: { ...lock.items } }
const dependencies = new Set<string>()
for (const item of fetched) {
  const { name } = item
  const files = itemFiles(item)
  const written = files.map(({ path, content }) => ({
    path,
    content: normalizeImports(content),
  }))
  for (const { path, content } of written) {
    await mkdir(dirname(`${sourceDirectory}/${path}`), { recursive: true })
    await writeFile(`${sourceDirectory}/${path}`, content)
  }
  const paths = written.map(({ path }) => path)
  next.items[name] = {
    url: `${registry}/${name}.json`,
    upstream: contentHash(files.map(({ content }) => content)),
    file: contentHash(written.map(({ content }) => content)),
    ...(paths.length === 1 && paths[0] === `${name}.tsx` ? {} : { paths }),
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
