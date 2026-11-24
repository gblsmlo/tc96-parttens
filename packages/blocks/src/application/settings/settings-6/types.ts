export interface Settings6Role {
  label: string
  value: string
}

export interface Settings6Member {
  email: string
  id: string
  initials: string
  name: string
  role: string
}

export interface Settings6Invitation {
  email: string
  id: string
  role: string
  sent: string
}

export interface Settings6Seats {
  limit: number
  plan: string
}

export type Settings6MemberAction = 'remove'

export type Settings6InvitationAction = 'resend' | 'revoke'

export interface Settings6Labels {
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

export interface Settings6Props {
  className?: string
  invitations: Settings6Invitation[]
  labels?: Partial<Settings6Labels>
  members: Settings6Member[]
  onInvitationAction?: (
    invitationId: string,
    action: Settings6InvitationAction,
  ) => void
  onInvite?: () => void
  onMemberAction?: (memberId: string, action: Settings6MemberAction) => void
  onRoleChange?: (memberId: string, role: string) => void
  ownerRole?: string
  roles: Settings6Role[]
  seats?: Settings6Seats
}
