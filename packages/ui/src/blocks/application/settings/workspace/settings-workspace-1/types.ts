import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsWorkspace1TimeZone {
  label: string
  value: string
}

export interface SettingsWorkspace1Labels extends SettingsLoadLabels {
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

export interface SettingsWorkspace1Props extends SettingsLoadProps {
  className?: string
  initials: string
  labels?: Partial<SettingsWorkspace1Labels>
  name: string
  onDeleteWorkspace?: () => void
  onNameCommit?: (value: string) => void
  onSlugCommit?: (value: string) => void
  onTimeZoneChange?: (value: string) => void
  onUploadLogo?: () => void
  slug: string
  timeZone: string
  timeZones: SettingsWorkspace1TimeZone[]
}
