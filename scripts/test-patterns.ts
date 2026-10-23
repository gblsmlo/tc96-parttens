import { spawnSync } from 'node:child_process'
import { files } from './files'

for (const path of [
  'chat/assistant',
  'chat/chats-panel',
  'checklist',
  'collection-views',
  'editable',
  'flow/canvas',
  'flow/inspector',
  'flow/step-library',
  'properties',
  'records/dialog',
  'records/group',
  'records/preview',
  'rich-text-editor',
  'shared',
  'surfaces/settings',
  'surfaces/state',
  'widgets',
  'wizard',
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
