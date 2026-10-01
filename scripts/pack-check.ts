import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { run, saveReport } from './consumer'

// The CLI, with the registry inside it, is the only published artifact.
const reports = []
for (const artifact of ['cli']) {
  const root = resolve(`dist/${artifact}`)
  const result = JSON.parse(
    run(['npm', 'pack', '--dry-run', '--json'], root, true),
  )[0]
  const names: string[] = result.files.map(
    (file: { path: string }) => file.path,
  )
  if (names.some((name) => /filter-builder|node_modules|\.test\./.test(name)))
    throw new Error(`Unexpected package content in ${artifact}`)
  for (const required of ['cli.js', 'README.md', 'LICENSE', 'package.json'])
    if (!names.includes(required))
      throw new Error(`${artifact} is missing ${required}`)
  const manifest = JSON.parse(await readFile(`${root}/package.json`, 'utf8'))
  if (
    Object.keys(manifest.dependencies).some((name) => name.startsWith('@tc96/'))
  )
    throw new Error('Published dependency points to a private workspace')
  reports.push({
    artifact,
    name: manifest.name,
    version: manifest.version,
    files: names.length,
    size: result.size,
  })
}
await saveReport('pack-check', reports)
console.log(reports)
