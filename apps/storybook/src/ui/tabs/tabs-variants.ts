import {
  GearIcon,
  type Icon as PhosphorIcon,
  PulseIcon,
  SquaresFourIcon,
} from '@phosphor-icons/react'
import type { TabsSize, TabsVariant } from '@tc96/ui/tabs'

export const tabsVariantNames: TabsVariant[] = ['default', 'underline']

export const tabsSizeNames: TabsSize[] = ['sm', 'default', 'lg']

export const tabsOrientations = ['horizontal', 'vertical'] as const

export type TabsOrientation = (typeof tabsOrientations)[number]

export const tabItems = [
  { icon: SquaresFourIcon, value: 'overview' },
  { icon: PulseIcon, value: 'activity' },
  { icon: GearIcon, value: 'settings' },
] as const satisfies readonly { icon: PhosphorIcon; value: string }[]

export type TabValue = (typeof tabItems)[number]['value']

export const tabValues: TabValue[] = tabItems.map(({ value }) => value)

export const disabledTabValue: TabValue = 'settings'

export const tabPanelCopy: Record<TabValue, string> = {
  activity: 'Comments, edits and status changes from the last 7 days.',
  overview: 'A summary of the project, its owner and its latest release.',
  settings: 'Name, visibility and notification options for the project.',
}
