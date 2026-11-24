import {
  CalendarBlankIcon,
  CalendarDotsIcon,
  CalendarIcon,
} from '@phosphor-icons/react'
import type { SegmentedControlSize } from '@tc96/ui/segmented-control'

export const segmentedControlSizeNames = [
  'sm',
  'default',
  'lg',
] as const satisfies readonly SegmentedControlSize[]

export const segmentedControlElementNames = ['radio', 'link', 'toggle'] as const

export type SegmentedControlElementName =
  (typeof segmentedControlElementNames)[number]

export const ranges = [
  { icon: CalendarBlankIcon, label: 'Day', value: 'day' },
  { icon: CalendarIcon, label: 'Week', value: 'week' },
  { icon: CalendarDotsIcon, label: 'Month', value: 'month' },
] as const

export type RangeValue = (typeof ranges)[number]['value']

export const rangeSelections = ['day', 'week', 'month', 'none'] as const

export type RangeSelection = (typeof rangeSelections)[number]

export const rangeSelectionLabels: Record<RangeSelection, string> = {
  day: 'Day',
  month: 'Month',
  none: 'None',
  week: 'Week',
}

export const disabledRange: RangeValue = 'month'
