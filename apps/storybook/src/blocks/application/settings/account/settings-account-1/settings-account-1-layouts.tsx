import {
  SettingsAccount1,
  type SettingsAccount1Props,
} from '@tc96/ui/blocks/application/settings/account/settings-account-1'
import { settingsAccount1Fields } from '../../fixtures/settings-account-1.ts'
import type { SettingsAccount1Controls } from './settings-account-1-controls.ts'

interface ComposedSettingsAccount1Props extends SettingsAccount1Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onDeleteAccount?: SettingsAccount1Props['onDeleteAccount']
  onEmailSubmit?: SettingsAccount1Props['onEmailSubmit']
  onFieldCommit?: SettingsAccount1Props['onFieldCommit']
  onSignOutEverywhere?: SettingsAccount1Props['onSignOutEverywhere']
  onUploadAvatar?: SettingsAccount1Props['onUploadAvatar']
}

export const ComposedSettingsAccount1 = ({
  error,
  onRetry,
  pending,
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
}: Readonly<ComposedSettingsAccount1Props>) => (
  <SettingsAccount1
    error={error}
    onRetry={onRetry}
    pending={pending}
    avatarInitials={avatarInitials}
    email={email}
    fields={settingsAccount1Fields}
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
