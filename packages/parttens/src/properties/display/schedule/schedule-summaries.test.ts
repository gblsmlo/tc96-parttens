import { describe, expect, test } from 'bun:test'
import { defaultSchedulePropertyLabels } from './schedule-labels'
import { scheduleSectionSummary } from './schedule-summaries'
import {
  defaultScheduleRecurrenceOptions,
  defaultScheduleReminderOptions,
  emptyScheduleValue,
  type ScheduleValue,
} from './schedule-value'

const summary = (
  section: Parameters<typeof scheduleSectionSummary>[0],
  value: Partial<ScheduleValue>,
) =>
  scheduleSectionSummary(section, {
    labels: defaultSchedulePropertyLabels,
    locale: 'pt-BR',
    recurrenceOptions: defaultScheduleRecurrenceOptions,
    reminderOptions: defaultScheduleReminderOptions,
    value: { ...emptyScheduleValue, ...value },
  })

describe('scheduleSectionSummary', () => {
  test('time reads all-day until a start time is set', () => {
    expect(summary('time', {})).toEqual({ filled: false, text: 'Dia inteiro' })
    expect(
      summary('time', { allDay: false, endTime: '16:00', startTime: '14:00' }),
    ).toEqual({ filled: true, text: '14:00 – 16:00' })
    expect(summary('time', { allDay: false, startTime: '14:00' })).toEqual({
      filled: true,
      text: '14:00',
    })
    expect(
      summary('time', { allDay: true, endTime: '16:00', startTime: '14:00' }),
    ).toEqual({ filled: false, text: 'Dia inteiro' })
  })

  test('repeat reads the frequency and its end day', () => {
    expect(summary('repeat', {})).toEqual({
      filled: false,
      text: 'Não repete',
    })
    expect(summary('repeat', { frequency: 'weekly' })).toEqual({
      filled: true,
      text: 'Semanalmente',
    })
    expect(
      summary('repeat', {
        frequency: 'weekly',
        until: '2026-12-18T12:00:00.000Z',
      }),
    ).toEqual({ filled: true, text: 'Semanalmente · Até 18 de dez.' })
  })

  test('reminders name the closest one and count the rest', () => {
    expect(summary('reminders', {})).toEqual({
      filled: false,
      text: 'Adicionar lembrete',
    })
    expect(summary('reminders', { reminders: ['1440'] })).toEqual({
      filled: true,
      text: '1 dia antes',
    })
    expect(summary('reminders', { reminders: ['1440', '30'] })).toEqual({
      filled: true,
      text: '30 min antes +1',
    })
  })
})
