import {
  SettingsWorkspace1,
  type SettingsWorkspace1Props,
} from '@tc96/ui/blocks/application/settings/workspace/settings-workspace-1'
import { timeZones, workspace } from '../../fixtures/settings-workspace-1.ts'
import type { SettingsWorkspace1Controls } from './settings-workspace-1-controls.ts'

interface ComposedSettingsWorkspace1Props extends SettingsWorkspace1Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onDeleteWorkspace?: SettingsWorkspace1Props['onDeleteWorkspace']
  onNameCommit?: SettingsWorkspace1Props['onNameCommit']
  onSlugCommit?: SettingsWorkspace1Props['onSlugCommit']
  onTimeZoneChange?: SettingsWorkspace1Props['onTimeZoneChange']
  onUploadLogo?: SettingsWorkspace1Props['onUploadLogo']
}

export const ComposedSettingsWorkspace1 = ({
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
}: Readonly<ComposedSettingsWorkspace1Props>) => (
  <SettingsWorkspace1
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
