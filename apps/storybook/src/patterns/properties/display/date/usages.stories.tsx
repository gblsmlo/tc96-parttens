import { ptBR } from '@daypicker/react/locale'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateProperty } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { DateCanvas } from './date-canvas.tsx'
import { DateAndTimeBadge, StatefulDate } from './date-layouts.tsx'

const meta = {
  decorators: [DateCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Date/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TargetDate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The target date of a project, on the [Default](?path=/story/patterns-properties-display-date-layouts--default) layout: a date the team aims for, with Sem previsão while none is set and Limpar previsão in the calendar.',
      },
    },
  },
  render: () => (
    <StatefulDate
      ariaLabel="Data prevista"
      calendarLocale={ptBR}
      locale="pt-BR"
      timeZone="UTC"
      value="2026-08-28T12:00:00.000Z"
      labels={{ clear: 'Limpar previsão', fallback: 'Sem previsão' }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Data prevista: 28 de ago.',
      }),
    ).toBeVisible()
  },
}

export const OverdueInvoice: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The due date of an unpaid invoice, on the [Default](?path=/story/patterns-properties-display-date-layouts--default) layout with `isOverdue`: the consumer writes venceu into `displayLabel`, which reaches the trigger name.',
      },
    },
  },
  render: () => (
    <StatefulDate
      ariaLabel="Vencimento"
      calendarLocale={ptBR}
      displayLabel="14 nov · venceu"
      isOverdue
      locale="pt-BR"
      timeZone="UTC"
      value="2026-11-14T12:00:00.000Z"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Vencimento: 14 nov · venceu',
      }),
    ).toBeVisible()
  },
}

export const Deadline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The deadline of a legal task, on the [Default](?path=/story/patterns-properties-display-date-layouts--default) layout: the day and the short month in Portuguese, with Sem prazo while none is set.',
      },
    },
  },
  render: () => (
    <StatefulDate
      ariaLabel="Prazo"
      calendarLocale={ptBR}
      locale="pt-BR"
      timeZone="UTC"
      value="2026-06-19T12:00:00.000Z"
      labels={{ fallback: 'Sem prazo' }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Prazo: 19 de jun.' }),
    ).toBeVisible()
  },
}

export const LastActivity: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The last activity of a contact, on the [Default](?path=/story/patterns-properties-display-date-layouts--default) layout, read-only with a `plain` surface: a relative time in `displayLabel`, and the full date and time in the tooltip.',
      },
    },
  },
  render: () => (
    <DateProperty
      displayLabel="há 53 minutos"
      locale="pt-BR"
      readOnly
      timeZone="America/Sao_Paulo"
      tooltip
      value="2026-11-13T17:07:00.000Z"
      variant="plain"
      labels={ptBRPropertyLabels.date}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('há 53 minutos')).toBeVisible()
  },
}

export const DateAndTime: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A date and a time in one badge, a case the [Default](?path=/story/patterns-properties-display-date-layouts--default) layout of `DateProperty` does not cover, since it holds only the day: a composition of `Badge`, `Calendar` and a time field.',
      },
    },
  },
  render: () => <DateAndTimeBadge initialValue="2026-06-19T14:30:00.000Z" />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Agendamento: 19 de jun. de 2026, 14:30',
      }),
    ).toBeVisible()
  },
}
