import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { resolveItems } from '../packages/registry/src/coss'
import {
  fetchItem,
  itemFiles,
  manifestPath,
  normalizeImports,
  readManifest,
  registry,
  sourceDirectory,
  type UiManifest,
} from './coss'

// Copies new COSS items into packages/ui, changing only the registry import
// aliases, and records them in the manifest. Items already in the manifest are
// owned by this repo and are never overwritten; COSS utils is @tc96/utils.
const manifest = await readManifest()
const requested = process.argv.slice(2)
if (!requested.length)
  throw new Error('Usage: bun scripts/sync-coss.ts <items...>')
const owned = requested.filter((name) => name in manifest.items)
if (owned.length)
  throw new Error(
    `Already in packages/ui, edit them directly: ${owned.join(', ')}`,
  )

const fetched = await resolveItems(
  requested,
  (name) => fetchItem(`${registry}/${name}.json`),
  (name) => name === 'utils' || name in manifest.items,
)

const writes = fetched.flatMap((item) =>
  itemFiles(item).map(({ path, content }) => ({
    item: item.name,
    path,
    content: normalizeImports(content),
  })),
)
const existing = writes.filter(({ path }) =>
  existsSync(`${sourceDirectory}/${path}`),
)
if (existing.length)
  throw new Error(
    `Would overwrite: ${existing.map(({ path }) => path).join(', ')}`,
  )

const next: UiManifest = { items: { ...manifest.items } }
const dependencies = new Set<string>()
for (const { path, content } of writes) {
  await mkdir(dirname(`${sourceDirectory}/${path}`), { recursive: true })
  await writeFile(`${sourceDirectory}/${path}`, content)
}
for (const item of fetched) {
  const paths = writes
    .filter(({ item: owner }) => owner === item.name)
    .map(({ path }) => path)
  next.items[item.name] = {
    origin: 'coss',
    ...(item.cssVars ? { cssVars: item.cssVars } : {}),
    ...(item.css ? { css: item.css } : {}),
    ...(paths.length === 1 && paths[0] === `${item.name}.tsx` ? {} : { paths }),
  }
  for (const dependency of item.dependencies ?? []) dependencies.add(dependency)
}
next.items = Object.fromEntries(
  Object.entries(next.items).sort(([a], [b]) => a.localeCompare(b)),
)
await writeFile(manifestPath, `${JSON.stringify(next, null, 2)}\n`)
console.log(
  `Added ${fetched.length} COSS items. npm dependencies: ${[...dependencies].sort().join(', ')}`,
)
