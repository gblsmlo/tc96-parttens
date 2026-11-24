import {
  Settings5,
  type Settings5Props,
} from '@tc96/blocks/application/settings/settings-5'
import { timeZones, workspace } from '../fixtures/settings-5.ts'
import type { Settings5Controls } from './settings-5-controls.ts'

interface ComposedSettings5Props extends Settings5Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onDeleteWorkspace?: Settings5Props['onDeleteWorkspace']
  onNameCommit?: Settings5Props['onNameCommit']
  onSlugCommit?: Settings5Props['onSlugCommit']
  onTimeZoneChange?: Settings5Props['onTimeZoneChange']
  onUploadLogo?: Settings5Props['onUploadLogo']
}

export const ComposedSettings5 = ({
  error,
  onRetry,
  pending,
  deleteWorkspace,
  name,
  onDeleteWorkspace,
  onNameCommit,
  onSlugCommit,
  onTimeZoneChange,
  onUploadLogo,
  slug,
  title,
}: Readonly<ComposedSettings5Props>) => (
  <Settings5
    error={error}
    onRetry={onRetry}
    pending={pending}
    initials={workspace.initials}
    key={`${name}/${slug}`}
    labels={{ deleteWorkspace, workspaceTitle: title }}
    name={name}
    onDeleteWorkspace={onDeleteWorkspace}
    onNameCommit={onNameCommit}
    onSlugCommit={onSlugCommit}
    onTimeZoneChange={onTimeZoneChange}
    onUploadLogo={onUploadLogo}
    slug={slug}
    timeZone={workspace.timeZone}
    timeZones={timeZones}
  />
)
