import { relative } from 'node:path'
import { manifestPaths, readManifest, sourceDirectory } from './coss'
import { files } from './files'

const manifest = await readManifest()
const problems: string[] = []
const owners = new Map<string, string>()
for (const [name, item] of Object.entries(manifest.items))
  for (const path of manifestPaths(name, item)) owners.set(path, name)

const present = new Set(
  (await files(sourceDirectory)).map((file) => relative(sourceDirectory, file)),
)
for (const path of present) {
  if (owners.has(path)) continue
  if (/^[^/]+\.tsx$/.test(path))
    problems.push(`${path.replace(/\.tsx$/, '')}: missing from the ui manifest`)
  else problems.push(`${sourceDirectory}/${path}: not in the ui manifest`)
}

for (const [name, item] of Object.entries(manifest.items)) {
  const missing = manifestPaths(name, item).filter((path) => !present.has(path))
  if (missing.length)
    problems.push(`${name}: in the manifest but missing ${missing.join(', ')}`)
}

if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(
  `ui manifest verified for ${Object.keys(manifest.items).length} items.`,
)
