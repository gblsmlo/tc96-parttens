import { ptBR } from '@daypicker/react/locale'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { emptyScheduleValue, ScheduleProperty } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
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
  parameters: {
    docs: {
      description: {
        story:
          'A weekly meeting, on the [Default](?path=/story/patterns-properties-display-schedule-layouts--default) layout: the day, the start and end times and the repeat icon, with two reminders in the footer.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'The deadline of a legal task, on the [Date Only Popup](?path=/story/patterns-properties-display-schedule-layouts--date-only-popup) layout: a day with no time, recurrence or reminders, and Sem prazo while none is set.',
      },
    },
  },
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
          today={scheduleToday}
          value={{ ...emptyScheduleValue, from: new Date(2026, 9, 16) }}
          labels={{ fallback: 'Sem prazo' }}
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

export const QuarterlyReview: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A quarterly review, on the [Default](?path=/story/patterns-properties-display-schedule-layouts--default) layout with the consumer's own frequencies and reminders: Trimestralmente is not one of the default options.",
      },
    },
  },
  render: () => (
    <dl className="grid grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">Evento</dt>
      <dd>Revisão trimestral de resultados</dd>
      <dt className="text-muted-foreground">Data</dt>
      <dd>
        <StatefulSchedule
          ariaLabel="Data"
          calendarLocale={ptBR}
          recurrenceOptions={[
            { label: 'Mensalmente', value: 'monthly' },
            { label: 'Trimestralmente', value: 'quarterly' },
          ]}
          reminderOptions={[
            { label: '1 hora antes', value: '60' },
            { label: '1 dia antes', value: '1440' },
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
        name: 'Data: 3 de nov · 15:00 – 16:30 · Trimestralmente',
      }),
    ).toBeVisible()
  },
}

export const ReadOnlyAgenda: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An agenda of calls and meetings, on the [Default](?path=/story/patterns-properties-display-schedule-layouts--default) layout, read-only with a `plain` surface: a timed day, an all-day day and a weekday recurrence.',
      },
    },
  },
  render: () => (
    <ul className="flex w-80 flex-col gap-2 text-sm">
      <li className="flex items-center justify-between gap-4">
        <span>Ligar para Acme Corp</span>
        <ScheduleProperty
          locale="pt-BR"
          ariaLabel="Data"
          value={{
            ...emptyScheduleValue,
            allDay: false,
            from: new Date(2026, 9, 8),
            startTime: '10:30',
          }}
          variant="plain"
          labels={ptBRPropertyLabels.schedule}
        />
      </li>
      <li className="flex items-center justify-between gap-4">
        <span>Enviar proposta revisada</span>
        <ScheduleProperty
          locale="pt-BR"
          ariaLabel="Data"
          value={{ ...emptyScheduleValue, from: new Date(2026, 9, 9) }}
          variant="plain"
          labels={ptBRPropertyLabels.schedule}
        />
      </li>
      <li className="flex items-center justify-between gap-4">
        <span>Reunião de status</span>
        <ScheduleProperty
          locale="pt-BR"
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
          labels={ptBRPropertyLabels.schedule}
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
