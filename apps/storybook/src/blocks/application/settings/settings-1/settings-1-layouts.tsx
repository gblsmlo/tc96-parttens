import {
  Settings1,
  type Settings1Props,
} from '@tc96/blocks/application/settings/settings-1'
import { settings1Fields } from '../fixtures/settings-1.ts'
import type { Settings1Controls } from './settings-1-controls.ts'

interface ComposedSettings1Props extends Settings1Controls {
  onDeleteAccount?: Settings1Props['onDeleteAccount']
  onEmailSubmit?: Settings1Props['onEmailSubmit']
  onFieldCommit?: Settings1Props['onFieldCommit']
  onSignOutEverywhere?: Settings1Props['onSignOutEverywhere']
  onUploadAvatar?: Settings1Props['onUploadAvatar']
}

export const ComposedSettings1 = ({
  avatarInitials,
  email,
  onDeleteAccount,
  onEmailSubmit,
  onFieldCommit,
  onSignOutEverywhere,
  onUploadAvatar,
  profileDescription,
  sessionCount,
  withActions,
}: Readonly<ComposedSettings1Props>) => (
  <Settings1
    avatarInitials={avatarInitials}
    email={email}
    fields={settings1Fields}
    key={email}
    labels={{ profileDescription }}
    onDeleteAccount={withActions ? onDeleteAccount : undefined}
    onEmailSubmit={withActions ? onEmailSubmit : undefined}
    onFieldCommit={withActions ? onFieldCommit : undefined}
    onSignOutEverywhere={withActions ? onSignOutEverywhere : undefined}
    onUploadAvatar={withActions ? onUploadAvatar : undefined}
    sessionCount={sessionCount}
  />
)
