import {
  Settings6,
  type Settings6Props,
} from '@tc96/blocks/application/settings/settings-6'
import { roles, seats, team } from '../fixtures/settings-6.ts'
import type { Settings6Controls } from './settings-6-controls.ts'

interface ComposedSettings6Props extends Settings6Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onInvitationAction?: Settings6Props['onInvitationAction']
  onInvite?: Settings6Props['onInvite']
  onMemberAction?: Settings6Props['onMemberAction']
  onRoleChange?: Settings6Props['onRoleChange']
}

const ignore = () => undefined

export const ComposedSettings6 = ({
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
}: Readonly<ComposedSettings6Props>) => (
  <Settings6
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
