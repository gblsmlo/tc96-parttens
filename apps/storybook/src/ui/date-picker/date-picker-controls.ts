import type { ArgTypes } from '@storybook/react-vite'

export const datePickerModes = ['single', 'range'] as const

export type DatePickerMode = (typeof datePickerModes)[number]

export const datePickerCaptionLayouts = [
  'label',
  'dropdown',
  'dropdown-months',
  'dropdown-years',
] as const

export type DatePickerCaptionLayout = (typeof datePickerCaptionLayouts)[number]

export interface DatePickerControls {
  captionLayout: DatePickerCaptionLayout
  defaultOpen: boolean
  icon: boolean
  mode: DatePickerMode
  placeholder: string
  presets: boolean
  selected: boolean
}

export const datePickerControlArgs: DatePickerControls = {
  captionLayout: 'label',
  defaultOpen: true,
  icon: true,
  mode: 'single',
  placeholder: 'Pick a date',
  presets: false,
  selected: false,
}

export const datePickerControlArgTypes: Partial<ArgTypes<DatePickerControls>> =
  {
    captionLayout: {
      control: 'select',
      description:
        'The `captionLayout` of `Calendar`: a label, or dropdowns for the month and the year.',
      options: datePickerCaptionLayouts,
    },
    defaultOpen: {
      control: 'boolean',
      description: 'The `defaultOpen` of `Popover`; remounts the composition.',
    },
    icon: {
      control: 'boolean',
      description: 'Adds a calendar icon before the text of the trigger.',
    },
    mode: {
      control: 'inline-radio',
      description:
        'The `mode` of `Calendar`: one date, or a range from a start to an end.',
      options: datePickerModes,
    },
    placeholder: {
      control: 'text',
      description: 'Text of the trigger while nothing is picked.',
    },
    presets: {
      control: 'boolean',
      description:
        'Adds a column of preset buttons beside the calendar, relative to a fixed today, March 27, 2026.',
    },
    selected: {
      control: 'boolean',
      description:
        'Starts with March 12, 2026 picked. Range mode always starts with March 12 to 18, so it does not act there.',
    },
  }
