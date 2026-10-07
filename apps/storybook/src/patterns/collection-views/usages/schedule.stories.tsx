import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { rangeModes, ScheduleUsage } from '../fixtures/schedule-usage'

const meta = {
  argTypes: {
    defaultMode: {
      control: 'inline-radio',
      options: rangeModes.map((mode) => mode.value),
    },
  },
  component: ScheduleUsage,
  parameters: {
    docs: {
      description: {
        component: [
          'A team schedule as a `CalendarView` alone: meetings, customer visits, focus blocks, deadlines and all-day absences in one collection.',
          'The toolbar owns the period: "Hoje" and the arrows move the `anchor`, the Dia/Semana/Mês toggle sets `mode`, and the `ViewSettingsMenu` filters by owner and type. A drop calls `onItemReschedule`, which writes the new window, and the "+N" of a full month cell opens that day through `onSelectDay`.',
        ].join('\n\n'),
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Usages/Schedule',
} satisfies Meta<typeof ScheduleUsage>

export default meta

type Story = StoryObj<typeof meta>

const period = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="schedule-period"]')?.textContent ??
  ''

const cellOf = (canvasElement: HTMLElement, id: string) =>
  canvasElement
    .querySelector(`[data-calendar-item-id="${id}"]`)
    ?.closest('[data-calendar-date]')
    ?.getAttribute('data-calendar-date')

export const Week: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-calendar-mode="week"]'),
    ).not.toBeNull()
    await expect(cellOf(canvasElement, 'EVT-312')).toBe('2026-10-14')
    await expect(
      canvasElement.querySelector(
        '[data-calendar-all-day-date="2026-10-15"] [data-calendar-item-id="EVT-316"]',
      ),
    ).not.toBeNull()
  },
}

export const Month: Story = {
  args: { defaultMode: 'month' },
}

export const Day: Story = {
  args: { defaultMode: 'day' },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { initialEvents: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum compromisso com esses filtros.'),
    ).toBeInTheDocument()
  },
}

export const NavigatePeriod: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The next arrow moves the anchor one week ahead and shows the customer visit on the 20th; "Hoje" brings the week of the 14th back.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const current = period(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Próximo período' }),
    )
    await waitFor(() => expect(period(canvasElement)).not.toBe(current))
    await expect(cellOf(canvasElement, 'EVT-320')).toBe('2026-10-20')
    await expect(
      canvasElement.querySelector('[data-calendar-item-id="EVT-312"]'),
    ).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Hoje' }))
    await waitFor(() => expect(period(canvasElement)).toBe(current))
    await expect(cellOf(canvasElement, 'EVT-312')).toBe('2026-10-14')
  },
}

export const SwitchRange: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The toggle switches the same collection between month, day and week.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const [label, mode] of [
      ['Mês', 'month'],
      ['Dia', 'day'],
      ['Semana', 'week'],
    ] as const) {
      await userEvent.click(canvas.getByRole('button', { name: label }))
      await waitFor(() =>
        expect(
          canvasElement.querySelector(`[data-calendar-mode="${mode}"]`),
        ).not.toBeNull(),
      )
    }
  },
}

export const OpenDayFromOverflow: Story = {
  args: { defaultMode: 'month' },
  parameters: {
    docs: {
      description: {
        story:
          'The 14th holds four events and the month shows three. The "+1" calls `onSelectDay`, and the schedule opens that day in the time grid with every event.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', {
        name: /^Mostrar todos os 4 itens de quarta/,
      }),
    )
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-calendar-mode="day"]'),
      ).not.toBeNull(),
    )
    for (const id of ['EVT-303', 'EVT-312', 'EVT-313', 'EVT-314']) {
      await expect(cellOf(canvasElement, id)).toBe('2026-10-14')
    }
  },
}

export const RescheduleWithKeyboard: Story = {
  args: { defaultMode: 'month' },
  parameters: {
    docs: {
      description: {
        story:
          'From the handle: Space picks up the customer demo, ArrowRight moves it one cell ahead (10px per press) and Space drops it. `onItemReschedule` writes the new day and the time stays the same.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const overlay = () =>
      canvasElement.ownerDocument.querySelector('[data-dnd-overlay]')

    await expect(cellOf(canvasElement, 'EVT-311')).toBe('2026-10-13')
    within(canvasElement)
      .getByRole('button', { name: 'Mover Demo para Banco Aurora' })
      .focus()
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(overlay()).not.toBeEmptyDOMElement())
    const cellWidth =
      canvasElement
        .querySelector('[data-calendar-date="2026-10-13"]')
        ?.getBoundingClientRect().width ?? 0
    for (let step = 0; step < Math.round(cellWidth / 10); step += 1) {
      await userEvent.keyboard('[ArrowRight]')
    }
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(overlay()).toBeEmptyDOMElement())

    await waitFor(() =>
      expect(cellOf(canvasElement, 'EVT-311')).toBe('2026-10-14'),
    )
    await expect(
      within(
        canvasElement.querySelector(
          '[data-calendar-item-id="EVT-311"]',
        ) as HTMLElement,
      ).getByText('10:00'),
    ).toBeInTheDocument()
  },
}

export const FilterByType: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The type filter lives in the consumer: only customer events reach the collection, and the calendar never filters on its own.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Tipo' }))
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Cliente' }),
    )
    await userEvent.keyboard('[Escape]')

    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-calendar-item-id="EVT-312"]'),
      ).toBeNull(),
    )
    await expect(cellOf(canvasElement, 'EVT-311')).toBe('2026-10-13')
  },
}
