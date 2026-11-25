import { spawnSync } from 'node:child_process'
import { files } from './files'

for (const path of [
  'calendar',
  'chat/assistant',
  'chat/chats-panel',
  'charts',
  'checklist',
  'collection',
  'data-grid',
  'data-table',
  'editable',
  'flow/canvas',
  'flow/inspector',
  'flow/step-library',
  'gallery',
  'kanban',
  'list',
  'list-view',
  'properties',
  'records/dialog',
  'records/group',
  'records/preview',
  'rich-text-editor',
  'stats',
  'status-list',
  'surfaces/settings',
  'surfaces/state',
  'toolbar',
  'widgets',
  'wizard',
]) {
  if (
    !(await files(`packages/ui/src/patterns/${path}`)).some((file) =>
      /\.test\.(ts|tsx)$/.test(file),
    )
  )
    continue
  const result = spawnSync(
    process.execPath,
    ['test', '--isolate', `packages/ui/src/patterns/${path}`],
    { stdio: 'inherit' },
  )
  if (result.status !== 0) process.exit(result.status ?? 1)
}
