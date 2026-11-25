import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/ui/patterns'
import { ptBRPropertyLabels } from '../../properties-labels.ts'

export const dateLocales = ['en-US', 'pt-BR'] as const

export const dateCalendarLocales = ['default', 'ptBR'] as const

export const propertyVariants = [
  'badge',
  'plain',
] as const satisfies readonly PropertyVariant[]

export interface DateControls {
  allowClear: boolean
  ariaLabel: string
  calendarLocale: (typeof dateCalendarLocales)[number]
  disabled: boolean
  displayLabel: string
  isOverdue: boolean
  labelsClear: string
  labelsFallback: string
  locale: (typeof dateLocales)[number]
  readOnly: boolean
  tooltip: boolean
  value: string
  variant: PropertyVariant
}

export const dateControlArgs: DateControls = {
  allowClear: true,
  ariaLabel: 'Data',
  calendarLocale: 'ptBR',
  disabled: false,
  displayLabel: '',
  isOverdue: false,
  labelsClear: ptBRPropertyLabels.date.clear,
  labelsFallback: ptBRPropertyLabels.date.fallback,
  locale: 'pt-BR',
  readOnly: false,
  tooltip: false,
  value: '2026-06-19T12:00:00.000Z',
  variant: 'badge',
}

export const dateControlArgTypes: Partial<ArgTypes<DateControls>> = {
  allowClear: {
    control: 'boolean',
    description:
      'The `allowClear` of `DateProperty`: adds the clear button under the calendar.',
  },
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `DateProperty`: the start of the trigger name and the name of the popup.',
  },
  calendarLocale: {
    control: 'inline-radio',
    description:
      'The `calendarLocale` of `DateProperty`: `ptBR` passes the DayPicker Portuguese locale to the calendar.',
    options: dateCalendarLocales,
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `DateProperty`: the trigger does not open.',
  },
  displayLabel: {
    control: 'text',
    description:
      'The `displayLabel` of `DateProperty`; empty shows the date formatted by `locale`.',
  },
  isOverdue: {
    control: 'boolean',
    description:
      'The `isOverdue` of `DateProperty`: a heavier weight and `data-overdue`.',
  },
  labelsClear: {
    control: 'text',
    description:
      '`labels.clear` of `DateProperty`: the text of the clear button that `allowClear` adds.',
  },
  labelsFallback: {
    control: 'text',
    description:
      '`labels.fallback` of `DateProperty`: the label while `value` is empty.',
  },
  locale: {
    control: 'inline-radio',
    description:
      'The `locale` of `DateProperty`: formats the label and the tooltip.',
    options: dateLocales,
  },
  readOnly: {
    control: 'boolean',
    description:
      'The `readOnly` of `DateProperty`: renders the value with no trigger.',
  },
  tooltip: {
    control: 'boolean',
    description:
      'The `tooltip` of `DateProperty`: hovering or focusing the date shows the full date and time.',
  },
  value: {
    control: 'text',
    description:
      'The `value` of `DateProperty`, an ISO string; empty passes `null`.',
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `DateProperty`.',
    options: propertyVariants,
  },
}
