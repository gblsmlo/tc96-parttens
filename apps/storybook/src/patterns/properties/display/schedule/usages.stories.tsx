import { ptBR } from '@daypicker/react/locale'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { emptyScheduleValue, ScheduleProperty } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { ScheduleCanvas } from './schedule-canvas.tsx'
import { scheduleToday } from './schedule-data.ts'
import { StatefulSchedule } from './schedule-layouts.tsx'

const meta = {
  decorators: [ScheduleCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Schedule/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const PipelineMeeting: Story = {
  render: () => (
    <dl className="grid grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">Evento</dt>
      <dd>Revisão semanal do pipeline</dd>
      <dt className="text-muted-foreground">Data</dt>
      <dd>
        <StatefulSchedule
          ariaLabel="Data"
          calendarLocale={ptBR}
          today={scheduleToday}
          value={{
            allDay: false,
            endTime: '10:00',
            frequency: 'weekly',
            from: new Date(2026, 9, 12),
            reminders: ['10', '60'],
            startTime: '09:00',
            until: null,
          }}
        />
      </dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Data: 12 de out · 09:00 – 10:00 · Semanalmente',
      }),
    ).toBeVisible()
  },
}

export const TaskDeadline: Story = {
  render: () => (
    <dl className="grid grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">Tarefa</dt>
      <dd>Protocolar recurso no TRT</dd>
      <dt className="text-muted-foreground">Prazo</dt>
      <dd>
        <StatefulSchedule
          ariaLabel="Prazo"
          calendarLocale={ptBR}
          dateOnly
          fallback="Sem prazo"
          today={scheduleToday}
          value={{ ...emptyScheduleValue, from: new Date(2026, 9, 16) }}
        />
      </dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Prazo: 16 de out' }),
    ).toBeVisible()
  },
}

export const EnglishEvent: Story = {
  render: () => (
    <dl className="grid grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">Event</dt>
      <dd>Quarterly business review</dd>
      <dt className="text-muted-foreground">Date</dt>
      <dd>
        <StatefulSchedule
          ariaLabel="Date"
          labels={{
            addReminder: 'Add reminder',
            allDay: 'All day',
            back: 'Back',
            end: 'End',
            frequency: 'Frequency',
            nextWeek: 'Next week',
            noDate: 'No date',
            noReminders: 'No reminder found.',
            noRepeat: 'Does not repeat',
            presets: 'Date presets',
            reminders: 'Reminders',
            removeReminder: 'Remove reminder',
            repeat: 'Repeat',
            start: 'Start',
            thisWeekend: 'This weekend',
            time: 'Time',
            today: 'Today',
            tomorrow: 'Tomorrow',
            until: 'Until',
            untilFallback: 'No end',
          }}
          locale="en-US"
          recurrenceOptions={[
            { label: 'Monthly', value: 'monthly' },
            { label: 'Quarterly', value: 'quarterly' },
          ]}
          reminderOptions={[
            { label: '1 hour before', value: '60' },
            { label: '1 day before', value: '1440' },
          ]}
          today={scheduleToday}
          value={{
            allDay: false,
            endTime: '16:30',
            frequency: 'quarterly',
            from: new Date(2026, 10, 3),
            reminders: ['1440'],
            startTime: '15:00',
            until: null,
          }}
        />
      </dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Date: Nov 3 · 15:00 – 16:30 · Quarterly',
      }),
    ).toBeVisible()
  },
}

export const ReadOnlyAgenda: Story = {
  render: () => (
    <ul className="flex w-80 flex-col gap-2 text-sm">
      <li className="flex items-center justify-between gap-4">
        <span>Ligar para Acme Corp</span>
        <ScheduleProperty
          ariaLabel="Data"
          value={{
            ...emptyScheduleValue,
            allDay: false,
            from: new Date(2026, 9, 8),
            startTime: '10:30',
          }}
          variant="plain"
        />
      </li>
      <li className="flex items-center justify-between gap-4">
        <span>Enviar proposta revisada</span>
        <ScheduleProperty
          ariaLabel="Data"
          value={{ ...emptyScheduleValue, from: new Date(2026, 9, 9) }}
          variant="plain"
        />
      </li>
      <li className="flex items-center justify-between gap-4">
        <span>Reunião de status</span>
        <ScheduleProperty
          ariaLabel="Data"
          value={{
            allDay: false,
            endTime: '15:30',
            frequency: 'weekdays',
            from: new Date(2026, 9, 7),
            reminders: [],
            startTime: '15:00',
            until: null,
          }}
          variant="plain"
        />
      </li>
    </ul>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Data: 7 de out · 15:00 – 15:30 · Dias úteis',
      }),
    ).toBeVisible()
  },
}
