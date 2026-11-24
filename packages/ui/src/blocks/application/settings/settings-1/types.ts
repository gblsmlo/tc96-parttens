import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export interface Settings1Field {
  description?: string
  id: string
  label: string
  value: string
}

export interface Settings1Labels extends SettingsLoadLabels {
  accountDescription: string
  accountTitle: string
  avatarDescription: string
  avatarTitle: string
  deleteAccount: string
  deleteAccountDescription: string
  deleteAccountTitle: string
  emailDescription: string
  emailInvalid: string
  emailLabel: string
  emailSave: string
  emailTitle: string
  profileDescription: string
  profileTitle: string
  sessionsDescription: (count: number) => string
  sessionsTitle: string
  signOutEverywhere: string
  uploadAvatar: string
}

export interface Settings1Props extends SettingsLoadProps {
  avatarInitials: string
  className?: string
  email: string
  fields: Settings1Field[]
  labels?: Partial<Settings1Labels>
  onDeleteAccount?: () => void
  onEmailSubmit?: (email: string) => void
  onFieldCommit?: (fieldId: string, value: string) => void
  onSignOutEverywhere?: () => void
  onUploadAvatar?: () => void
  sessionCount: number
}
