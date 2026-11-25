import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsNotificationChannel1Channel {
  id: string
  name: string
}

export interface SettingsNotificationChannel1Event {
  description?: string
  id: string
  name: string
}

export interface SettingsNotificationChannel1Category {
  events: SettingsNotificationChannel1Event[]
  id: string
  name: string
}

export type SettingsNotificationChannel1Matrix = Record<
  string,
  Record<string, boolean>
>

export interface SettingsNotificationChannel1Labels extends SettingsLoadLabels {
  categories: string
  cell: (event: string, channel: string) => string
  description: string
  emptyDescription: string
  emptyTitle: string
  event: string
  title: string
}

export interface SettingsNotificationChannel1Props extends SettingsLoadProps {
  categories: SettingsNotificationChannel1Category[]
  channels: SettingsNotificationChannel1Channel[]
  className?: string
  labels?: Partial<SettingsNotificationChannel1Labels>
  matrix: SettingsNotificationChannel1Matrix
  onChange?: (eventId: string, channelId: string, checked: boolean) => void
}
