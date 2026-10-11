import type { ReactNode } from 'react'

export interface SettingsSectionProps {
  children?: ReactNode
  className?: string
  header?: ReactNode
}

export interface SettingsSectionHeaderProps {
  actions?: ReactNode
  children?: ReactNode
  className?: string
}

export interface SettingsSectionTitleProps {
  children?: ReactNode
  className?: string
}

export interface SettingsSectionDescriptionProps {
  children?: ReactNode
  className?: string
}

export interface SettingsRowProps {
  className?: string
  description?: ReactNode
  endSlot?: ReactNode
  startSlot?: ReactNode
  title: ReactNode
}

export interface SettingsCollapsedProps {
  actions?: ReactNode
  children?: ReactNode
  className?: string
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title: ReactNode
}
