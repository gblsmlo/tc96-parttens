import type { ArgTypes } from '@storybook/react-vite'
import type {
  PropertyVariant,
  ScheduleFooterLayout,
  ScheduleTimeControl,
} from '@tc96/ui/patterns'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { type ScheduleValueName, scheduleValueNames } from './schedule-data.ts'

export const scheduleLocales = ['pt-BR', 'en-US'] as const

export const scheduleCalendarLocales = ['default', 'ptBR'] as const

export const scheduleFooterLayouts = [
  'rows',
  'drill-in',
] as const satisfies readonly ScheduleFooterLayout[]

export const scheduleTimeControls = [
  'select',
  'input',
] as const satisfies readonly ScheduleTimeControl[]

export const scheduleVariants = [
  'badge',
  'plain',
] as const satisfies readonly PropertyVariant[]

export interface ScheduleControls {
  ariaLabel: string
  calendarLocale: (typeof scheduleCalendarLocales)[number]
  dateOnly: boolean
  footerLayout: ScheduleFooterLayout
  keepBelow: boolean
  labelsFallback: string
  locale: (typeof scheduleLocales)[number]
  openOnMount: boolean
  readOnly: boolean
  timeControl: ScheduleTimeControl
  value: ScheduleValueName
  variant: PropertyVariant
}

export const scheduleControlArgs: ScheduleControls = {
  ariaLabel: 'Data',
  calendarLocale: 'ptBR',
  dateOnly: false,
  footerLayout: 'rows',
  keepBelow: false,
  labelsFallback: ptBRPropertyLabels.schedule.fallback,
  locale: 'pt-BR',
  openOnMount: false,
  readOnly: false,
  timeControl: 'select',
  value: 'timedWeekly',
  variant: 'badge',
}

export const scheduleControlArgTypes: Partial<ArgTypes<ScheduleControls>> = {
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `ScheduleProperty`: the start of the trigger name and the name of the popup.',
  },
  calendarLocale: {
    control: 'inline-radio',
    description:
      'The `calendarLocale` of `ScheduleProperty`: `ptBR` passes the DayPicker Portuguese locale to every calendar of the popup; `default` passes none.',
    options: scheduleCalendarLocales,
  },
  dateOnly: {
    control: 'boolean',
    description:
      'The `dateOnly` of `ScheduleProperty`: drops the Hora, Repetir and Lembretes footer.',
  },
  footerLayout: {
    control: 'inline-radio',
    description:
      'The `footerLayout` of `ScheduleProperty`: a row opens its editor under itself, or takes over the popup.',
    options: scheduleFooterLayouts,
  },
  keepBelow: {
    control: 'boolean',
    description:
      "Passes `dropdownPlacement.collisionAvoidance` as `{ side: 'none' }`: the popup stays below the trigger.",
  },
  labelsFallback: {
    control: 'text',
    description:
      '`labels.fallback` of `ScheduleProperty`: the label while there is no day.',
  },
  locale: {
    control: 'inline-radio',
    description:
      'The `locale` of `ScheduleProperty`: formats the label and the preset hints; the texts stay in `labels`.',
    options: scheduleLocales,
  },
  openOnMount: {
    control: 'boolean',
    description:
      'Clicks the trigger once after the story mounts, so the popup shows open.',
  },
  readOnly: {
    control: 'boolean',
    description:
      'The `readOnly` of `ScheduleProperty`: renders the value with no trigger.',
  },
  timeControl: {
    control: 'inline-radio',
    description:
      'The `timeControl` of `ScheduleProperty`: the times of Hora as a 15-minute list or a native time field.',
    options: scheduleTimeControls,
  },
  value: {
    control: 'inline-radio',
    description:
      'The `value` of `ScheduleProperty`: a timed weekly event, an all-day date or no date.',
    options: scheduleValueNames,
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `ScheduleProperty`.',
    options: scheduleVariants,
  },
}
