import {
  SettingsWorkspace2,
  type SettingsWorkspace2Props,
} from '@tc96/ui/blocks/application/settings/workspace/settings-workspace-2'
import { roles, seats, team } from '../../fixtures/settings-workspace-2.ts'
import type { SettingsWorkspace2Controls } from './settings-workspace-2-controls.ts'

interface ComposedSettingsWorkspace2Props extends SettingsWorkspace2Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onInvitationAction?: SettingsWorkspace2Props['onInvitationAction']
  onInvite?: SettingsWorkspace2Props['onInvite']
  onMemberAction?: SettingsWorkspace2Props['onMemberAction']
  onRoleChange?: SettingsWorkspace2Props['onRoleChange']
}

const ignore = () => undefined

export const ComposedSettingsWorkspace2 = ({
  error,
  onRetry,
  pending,
  invite,
  onInvitationAction = ignore,
  onInvite = ignore,
  onMemberAction = ignore,
  onRoleChange = ignore,
  title,
  withActions,
  withInvitations,
  withSeats,
}: Readonly<ComposedSettingsWorkspace2Props>) => (
  <SettingsWorkspace2
    error={error}
    onRetry={onRetry}
    pending={pending}
    invitations={withInvitations ? team.invitations : []}
    labels={{ invite, title }}
    members={team.members}
    onInvitationAction={withActions ? onInvitationAction : undefined}
    onInvite={withActions ? onInvite : undefined}
    onMemberAction={withActions ? onMemberAction : undefined}
    onRoleChange={withActions ? onRoleChange : undefined}
    roles={roles}
    seats={withSeats ? seats : undefined}
  />
)
