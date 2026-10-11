import type { ReactNode } from 'react'

export interface SettingsSectionProps {
  children?: ReactNode
  className?: string
  title?: ReactNode
}

export interface SettingsRowProps {
  className?: string
  description?: ReactNode
  endSlot?: ReactNode
  startSlot?: ReactNode
  title: ReactNode
}
