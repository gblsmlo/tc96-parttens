import type { ArgTypes } from '@storybook/react-vite'

export const calendarModes = ['single', 'multiple', 'range'] as const

export type CalendarMode = (typeof calendarModes)[number]

export const calendarCaptionLayouts = [
  'label',
  'dropdown',
  'dropdown-months',
  'dropdown-years',
] as const

export type CalendarCaptionLayout = (typeof calendarCaptionLayouts)[number]

export interface CalendarControls {
  captionLayout: CalendarCaptionLayout
  mode: CalendarMode
  roundedDays: boolean
  showOutsideDays: boolean
}

export const calendarControlArgs: CalendarControls = {
  captionLayout: 'label',
  mode: 'single',
  roundedDays: true,
  showOutsideDays: true,
}

export const calendarControlArgTypes: Partial<ArgTypes<CalendarControls>> = {
  captionLayout: {
    control: 'select',
    description: 'The `captionLayout` of `Calendar`.',
    options: calendarCaptionLayouts,
  },
  mode: {
    control: 'inline-radio',
    description:
      'The `mode` of `Calendar`; each mode starts with its own selection.',
    options: calendarModes,
  },
  roundedDays: {
    control: 'boolean',
    description: "Passes `classNames={{ day_button: 'rounded-full' }}`.",
  },
  showOutsideDays: {
    control: 'boolean',
    description: 'The `showOutsideDays` of `Calendar`.',
  },
}
