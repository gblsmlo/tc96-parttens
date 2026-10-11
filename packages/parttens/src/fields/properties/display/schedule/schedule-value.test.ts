import { describe, expect, test } from 'bun:test'
import { defaultSchedulePropertyLabels } from './schedule-labels'
import { buildSchedulePresets } from './schedule-presets'
import {
  defaultScheduleRecurrenceOptions,
  defaultScheduleReminderOptions,
  emptyScheduleValue,
  formatScheduleProperty,
  scheduleRecurrenceLabel,
  sortScheduleReminders,
} from './schedule-value'

const october26 = new Date(2026, 9, 26)

describe('formatScheduleProperty', () => {
  test('falls back without a day', () => {
    expect(
      formatScheduleProperty(emptyScheduleValue, 'Sem data', 'pt-BR'),
    ).toBe('Sem data')
  })

  test('shows an all-day value as the day, without year or period', () => {
    expect(
      formatScheduleProperty(
        { ...emptyScheduleValue, from: october26 },
        'Sem data',
        'pt-BR',
      ),
    ).toBe('26 de out')
  })

  test('joins the start and end times to the day', () => {
    const timed = {
      ...emptyScheduleValue,
      allDay: false,
      endTime: '16:00',
      from: october26,
      startTime: '14:00',
    }

    expect(formatScheduleProperty(timed, 'Sem data', 'pt-BR')).toBe(
      '26 de out · 14:00 – 16:00',
    )
    expect(
      formatScheduleProperty({ ...timed, endTime: '' }, 'Sem data', 'pt-BR'),
    ).toBe('26 de out · 14:00')
  })

  test('ignores stored times on an all-day value', () => {
    expect(
      formatScheduleProperty(
        { ...emptyScheduleValue, from: october26, startTime: '14:00' },
        'Sem data',
        'pt-BR',
      ),
    ).toBe('26 de out')
  })
})

describe('scheduleRecurrenceLabel', () => {
  test('names the frequency from the options', () => {
    expect(
      scheduleRecurrenceLabel('weekly', defaultScheduleRecurrenceOptions),
    ).toBe('Semanalmente')
  })

  test('returns null without a frequency or with an unknown one', () => {
    expect(
      scheduleRecurrenceLabel(null, defaultScheduleRecurrenceOptions),
    ).toBe(null)
    expect(
      scheduleRecurrenceLabel('hourly', defaultScheduleRecurrenceOptions),
    ).toBe(null)
  })
})

describe('sortScheduleReminders', () => {
  test('orders reminders as the options list them, unknown ones last', () => {
    expect(
      sortScheduleReminders(
        ['1440', 'custom', '10', '60'],
        defaultScheduleReminderOptions,
      ),
    ).toEqual(['10', '60', '1440', 'custom'])
  })
})

describe('buildSchedulePresets', () => {
  const presetsFrom = (today: Date) =>
    buildSchedulePresets(today, defaultSchedulePropertyLabels, 'pt-BR')

  test('hints each preset with its weekday, and next week with the day', () => {
    const wednesday = new Date(2026, 9, 7)

    expect(
      presetsFrom(wednesday).map(({ hint, label }) => [label, hint]),
    ).toEqual([
      ['Hoje', 'Qua'],
      ['Amanhã', 'Qui'],
      ['Este fim de semana', 'Sáb'],
      ['Próxima semana', 'Seg, 12 de out'],
      ['Sem data', ''],
    ])
    expect(presetsFrom(wednesday).at(-1)?.day).toBe(null)
  })

  test('never points to today from the weekend or next-week presets', () => {
    const saturday = new Date(2026, 9, 10)
    const monday = new Date(2026, 9, 12)

    expect(presetsFrom(saturday)[2]?.day).toEqual(new Date(2026, 9, 17))
    expect(presetsFrom(monday)[3]?.day).toEqual(new Date(2026, 9, 19))
  })
})
