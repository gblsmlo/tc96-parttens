import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/ui/patterns'
import { ptBRPropertyLabels } from '../../properties-labels.ts'

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
  disabled: boolean
  displayLabel: string
  ends: (typeof dateRangeEnds)[number]
  labelsClear: string
  labelsFallback: string
  labelsFrom: string
  labelsUntil: string
  locale: (typeof dateRangeLocales)[number]
  numberOfMonths: number
  readOnly: boolean
  variant: PropertyVariant
}

export const dateRangeControlArgs: DateRangeControls = {
  allowClear: true,
  ariaLabel: 'Período',
  calendarLocale: 'ptBR',
  disabled: false,
  displayLabel: '',
  ends: 'both',
  labelsClear: ptBRPropertyLabels.dateRange.clear,
  labelsFallback: ptBRPropertyLabels.dateRange.fallback,
  labelsFrom: ptBRPropertyLabels.dateRange.from,
  labelsUntil: ptBRPropertyLabels.dateRange.until,
  locale: 'pt-BR',
  numberOfMonths: 2,
  readOnly: false,
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
      'The `value` of `DateRangeProperty`: both ends, only `from`, only `to`, or `undefined`.',
    options: dateRangeEnds,
  },
  labelsClear: {
    control: 'text',
    description:
      '`labels.clear` of `DateRangeProperty`: the text of the clear button that `allowClear` adds.',
  },
  labelsFallback: {
    control: 'text',
    description:
      '`labels.fallback` of `DateRangeProperty`: the label while neither end is set.',
  },
  labelsFrom: {
    control: 'text',
    description:
      '`labels.from` of `DateRangeProperty`: the word before a start with no end.',
  },
  labelsUntil: {
    control: 'text',
    description:
      '`labels.until` of `DateRangeProperty`: the word before an end with no start.',
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
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `DateRangeProperty`.',
    options: dateRangeVariants,
  },
}
