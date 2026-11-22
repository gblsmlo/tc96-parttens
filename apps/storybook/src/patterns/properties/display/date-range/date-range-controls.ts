import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/parttens'

export const dateRangeEnds = ['both', 'from', 'until', 'none'] as const

export const dateRangeLocales = ['en-US', 'pt-BR'] as const

export const dateRangeCalendarLocales = ['default', 'ptBR'] as const

export const dateRangeVariants = [
  'badge',
  'plain',
] as const satisfies readonly PropertyVariant[]

export interface DateRangeControls {
  allowClear: boolean
  ariaLabel: string
  calendarLocale: (typeof dateRangeCalendarLocales)[number]
  clearLabel: string
  disabled: boolean
  displayLabel: string
  ends: (typeof dateRangeEnds)[number]
  fallback: string
  fromLabel: string
  locale: (typeof dateRangeLocales)[number]
  numberOfMonths: number
  readOnly: boolean
  untilLabel: string
  variant: PropertyVariant
}

export const dateRangeControlArgs: DateRangeControls = {
  allowClear: true,
  ariaLabel: 'Period',
  calendarLocale: 'default',
  clearLabel: 'Clear period',
  disabled: false,
  displayLabel: '',
  ends: 'both',
  fallback: 'No period',
  fromLabel: 'From',
  locale: 'en-US',
  numberOfMonths: 2,
  readOnly: false,
  untilLabel: 'Until',
  variant: 'badge',
}

export const dateRangeControlArgTypes: Partial<ArgTypes<DateRangeControls>> = {
  allowClear: {
    control: 'boolean',
    description:
      'The `allowClear` of `DateRangeProperty`: adds the clear button under the calendar.',
  },
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `DateRangeProperty`: the start of the trigger name and the name of the popup.',
  },
  calendarLocale: {
    control: 'inline-radio',
    description:
      'The `calendarLocale` of `DateRangeProperty`: `ptBR` passes the DayPicker Portuguese locale to the calendar.',
    options: dateRangeCalendarLocales,
  },
  clearLabel: {
    control: 'text',
    description:
      'The `clearLabel` of `DateRangeProperty`. Acts only with `allowClear`.',
  },
  disabled: {
    control: 'boolean',
    description:
      'The `disabled` of `DateRangeProperty`: the trigger does not open.',
  },
  displayLabel: {
    control: 'text',
    description:
      'The `displayLabel` of `DateRangeProperty`; empty shows the range formatted by `locale`. Ignored while there is no end.',
  },
  ends: {
    control: 'inline-radio',
    description:
      'The initial `value`: both ends, only `from`, only `to`, or `undefined`. Picking days replaces it.',
    options: dateRangeEnds,
  },
  fallback: {
    control: 'text',
    description:
      'The `fallback` of `DateRangeProperty`, shown while neither end is set.',
  },
  fromLabel: {
    control: 'text',
    description:
      'The `fromLabel` of `DateRangeProperty`, before a start with no end.',
  },
  locale: {
    control: 'inline-radio',
    description: 'The `locale` of `DateRangeProperty`: formats the label.',
    options: dateRangeLocales,
  },
  numberOfMonths: {
    control: { max: 3, min: 1, type: 'number' },
    description:
      'The `numberOfMonths` of `DateRangeProperty`: the months the calendar shows side by side.',
  },
  readOnly: {
    control: 'boolean',
    description:
      'The `readOnly` of `DateRangeProperty`: renders the range with no trigger.',
  },
  untilLabel: {
    control: 'text',
    description:
      'The `untilLabel` of `DateRangeProperty`, before an end with no start.',
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `DateRangeProperty`.',
    options: dateRangeVariants,
  },
}
