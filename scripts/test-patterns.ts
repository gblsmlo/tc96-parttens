import { spawnSync } from 'node:child_process'
import { files } from './files'

for (const path of [
  'checklist',
  'collection-views',
  'editable',
  'properties',
  'record-dialog',
  'record-group',
  'record-preview',
  'rich-text-editor',
  'shared',
  'state-surface',
  'widgets',
]) {
  if (
    !(await files(`packages/parttens/src/${path}`)).some((file) =>
      /\.test\.(ts|tsx)$/.test(file),
    )
  )
    continue
  const result = spawnSync(
    process.execPath,
    ['test', '--isolate', `packages/parttens/src/${path}`],
    { stdio: 'inherit' },
  )
  if (result.status !== 0) process.exit(result.status ?? 1)
}
