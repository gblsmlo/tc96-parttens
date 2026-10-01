import { readdir, readFile } from 'node:fs/promises'
import {
  fetchItem,
  itemContent,
  normalizeImports,
  readLock,
  sha256,
  sourceDirectory,
} from './coss'

// packages/ui must be COSS without edits. Offline, every file must match the
// hash recorded by sync-coss. With --remote, the published items are fetched
// again and compared after the same import normalization.
const remote = process.argv.includes('--remote')
const lock = await readLock()
const problems: string[] = []
const present = new Set<string>()

for (const entry of await readdir(sourceDirectory, { withFileTypes: true })) {
  const name = entry.name.replace(/\.tsx$/, '')
  if (!entry.isFile() || name === entry.name) {
    problems.push(`${sourceDirectory}/${entry.name}: not a COSS item`)
    continue
  }
  present.add(name)
  const locked = lock.items[name]
  if (!locked) {
    problems.push(`${name}: missing from the COSS lock`)
    continue
  }
  const content = await readFile(`${sourceDirectory}/${entry.name}`, 'utf8')
  if (sha256(content) !== locked.file)
    problems.push(`${name}: differs from the locked COSS snapshot`)
  if (remote) {
    const upstream = itemContent(await fetchItem(locked.url))
    if (sha256(upstream) !== locked.upstream)
      problems.push(`${name}: COSS published a new version (run sync-coss)`)
    else if (normalizeImports(upstream) !== content)
      problems.push(`${name}: differs from ${locked.url}`)
  }
}
for (const name of Object.keys(lock.items))
  if (!present.has(name)) problems.push(`${name}: locked but missing`)

if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(
  `COSS snapshot verified for ${present.size} items${remote ? ' against the registry' : ''}.`,
)
