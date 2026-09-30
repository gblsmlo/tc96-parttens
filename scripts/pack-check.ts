import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { run, saveReport } from './consumer'

const reports = []
for (const artifact of ['library', 'cli']) {
  const root = resolve(`dist/${artifact}`)
  const result = JSON.parse(
    run(
      [
        'npm',
        'pack',
        '--dry-run',
        '--json',
        '--cache',
        '/private/tmp/tc96-parttens-npm-cache',
      ],
      root,
      true,
    ),
  )[0]
  const names: string[] = result.files.map(
    (file: { path: string }) => file.path,
  )
  if (names.some((name) => /filter-builder|node_modules|\.test\./.test(name)))
    throw new Error(`Unexpected package content in ${artifact}`)
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
