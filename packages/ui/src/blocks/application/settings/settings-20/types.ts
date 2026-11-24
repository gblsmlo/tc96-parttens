import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export interface Settings20Channel {
  id: string
  name: string
}

export interface Settings20Event {
  description?: string
  id: string
  name: string
}

export interface Settings20Category {
  events: Settings20Event[]
  id: string
  name: string
}

export type Settings20Matrix = Record<string, Record<string, boolean>>

export interface Settings20Labels extends SettingsLoadLabels {
  categories: string
  cell: (event: string, channel: string) => string
  description: string
  emptyDescription: string
  emptyTitle: string
  event: string
  title: string
}

export interface Settings20Props extends SettingsLoadProps {
  categories: Settings20Category[]
  channels: Settings20Channel[]
  className?: string
  labels?: Partial<Settings20Labels>
  matrix: Settings20Matrix
  onChange?: (eventId: string, channelId: string, checked: boolean) => void
}
