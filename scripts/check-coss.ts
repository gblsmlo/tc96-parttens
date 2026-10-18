import { readFile } from 'node:fs/promises'
import { relative } from 'node:path'
import {
  contentHash,
  fetchItem,
  itemFiles,
  lockedPaths,
  normalizeImports,
  readLock,
  sourceDirectory,
} from './coss'
import { files } from './files'

// packages/ui must be COSS without edits. Offline, every file must match the
// hash recorded by sync-coss. With --remote, the published items are fetched
// again and compared after the same import normalization.
const remote = process.argv.includes('--remote')
const lock = await readLock()
const problems: string[] = []
const owners = new Map<string, string>()
for (const [name, locked] of Object.entries(lock.items))
  for (const path of lockedPaths(name, locked)) owners.set(path, name)

const present = new Set(
  (await files(sourceDirectory)).map((file) => relative(sourceDirectory, file)),
)
for (const path of present) {
  if (owners.has(path)) continue
  if (/^[^/]+\.tsx$/.test(path))
    problems.push(`${path.replace(/\.tsx$/, '')}: missing from the COSS lock`)
  else problems.push(`${sourceDirectory}/${path}: not a COSS item`)
}

for (const [name, locked] of Object.entries(lock.items)) {
  const paths = lockedPaths(name, locked)
  const missing = paths.filter((path) => !present.has(path))
  if (missing.length) {
    problems.push(`${name}: locked but missing ${missing.join(', ')}`)
    continue
  }
  const contents = await Promise.all(
    paths.map((path) => readFile(`${sourceDirectory}/${path}`, 'utf8')),
  )
  if (contentHash(contents) !== locked.file)
    problems.push(`${name}: differs from the locked COSS snapshot`)
  if (remote) {
    const published = itemFiles(await fetchItem(locked.url))
    if (
      contentHash(published.map(({ content }) => content)) !== locked.upstream
    )
      problems.push(`${name}: COSS published a new version (run sync-coss)`)
    else if (
      published.some(
        ({ path, content }, index) =>
          path !== paths[index] ||
          normalizeImports(content) !== contents[index],
      )
    )
      problems.push(`${name}: differs from ${locked.url}`)
  }
}

if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(
  `COSS snapshot verified for ${Object.keys(lock.items).length} items${remote ? ' against the registry' : ''}.`,
)
