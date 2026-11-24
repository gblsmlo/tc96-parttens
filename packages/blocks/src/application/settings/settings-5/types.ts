import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export interface Settings5TimeZone {
  label: string
  value: string
}

export interface Settings5Labels extends SettingsLoadLabels {
  dangerTitle: string
  deleteDescription: string
  deleteTitle: string
  deleteWorkspace: string
  logoDescription: string
  logoTitle: string
  nameLabel: string
  timeZoneDescription: string
  timeZoneLabel: string
  uploadLogo: string
  urlDescription: string
  urlLabel: string
  urlPrefix: string
  workspaceDescription: (name: string) => string
  workspaceTitle: string
}

export interface Settings5Props extends SettingsLoadProps {
  className?: string
  initials: string
  labels?: Partial<Settings5Labels>
  name: string
  onDeleteWorkspace?: () => void
  onNameCommit?: (value: string) => void
  onSlugCommit?: (value: string) => void
  onTimeZoneChange?: (value: string) => void
  onUploadLogo?: () => void
  slug: string
  timeZone: string
  timeZones: Settings5TimeZone[]
}
