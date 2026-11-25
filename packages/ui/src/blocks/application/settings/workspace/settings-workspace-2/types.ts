import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsWorkspace2Role {
  label: string
  value: string
}

export interface SettingsWorkspace2Member {
  email: string
  id: string
  initials: string
  name: string
  role: string
}

export interface SettingsWorkspace2Invitation {
  email: string
  id: string
  role: string
  sent: string
}

export interface SettingsWorkspace2Seats {
  limit: number
  plan: string
}

export type SettingsWorkspace2MemberAction = 'remove'

export type SettingsWorkspace2InvitationAction = 'resend' | 'revoke'

export interface SettingsWorkspace2Labels extends SettingsLoadLabels {
  actions: (name: string) => string
  invitationMeta: (role: string, sent: string) => string
  invitationsTitle: string
  invite: string
  memberRole: (name: string) => string
  owner: string
  pending: string
  removeMember: string
  resendInvitation: string
  revokeInvitation: string
  seats: (used: number, limit: number, plan: string) => string
  title: string
}

export interface SettingsWorkspace2Props extends SettingsLoadProps {
  className?: string
  invitations: SettingsWorkspace2Invitation[]
  labels?: Partial<SettingsWorkspace2Labels>
  members: SettingsWorkspace2Member[]
  onInvitationAction?: (
    invitationId: string,
    action: SettingsWorkspace2InvitationAction,
  ) => void
  onInvite?: () => void
  onMemberAction?: (
    memberId: string,
    action: SettingsWorkspace2MemberAction,
  ) => void
  onRoleChange?: (memberId: string, role: string) => void
  ownerRole?: string
  roles: SettingsWorkspace2Role[]
  seats?: SettingsWorkspace2Seats
}
