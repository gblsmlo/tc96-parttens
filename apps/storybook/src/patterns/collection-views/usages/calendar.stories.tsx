import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { CalendarUsage } from '../fixtures/calendar-usage'

const meta = {
  component: CalendarUsage,
  parameters: {
    docs: {
      description: {
        component: [
          'The sales calendar of the Pipeline usage as a `CalendarView` alone: calls, meetings, demos and proposals tied to each deal, plus the expected close date of every open deal as an all-day item.',
          'The toolbar moves the period and switches Dia/Semana/Mês, and the `ViewSettingsMenu` filters by owner, activity type and deal stage. Dragging an activity or its top and bottom edges writes the new window through `onItemReschedule`. Nova atividade and a click on an empty slot of the time grid (`onSelectSlot`) open the `CreateEvent` dialog of `Patterns/RecordDialog`, and the saved event is added to the calendar. Interaction coverage lives in `Views/Calendar/Interactions`.',
        ].join('\n\n'),
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Usages/Calendar',
} satisfies Meta<typeof CalendarUsage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CreateActivity: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Nova atividade opens the create dialog on the anchor day at 09:00-10:00; saving adds the activity to the calendar.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Nova atividade' }),
    )
    const dialog = within(
      await screen.findByRole('dialog', { name: 'New event' }),
    )
    expect(dialog.getByLabelText('Start time')).toHaveValue('09:00')
    expect(dialog.getByLabelText('End time')).toHaveValue('10:00')
    await userEvent.type(
      dialog.getByRole('textbox', { name: 'Event title' }),
      'Revisão de contrato',
    )
    await userEvent.click(dialog.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    const chip = canvasElement.querySelector(
      '[data-calendar-date="2026-10-14"] [data-calendar-item-id]',
    )
    expect(chip).not.toBeNull()
    expect(
      await canvas.findByRole('button', { name: 'Abrir Revisão de contrato' }),
    ).toBeInTheDocument()
  },
}

export const CreateActivityFromSlot: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A click on an empty slot of the time grid opens the create dialog with that day and the 15-minute slot under the pointer; saving places the activity there.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const column = canvasElement.querySelector<HTMLElement>(
      '[data-slot="calendar-time-grid"] [data-calendar-date="2026-10-15"]',
    )
    if (!column) throw new Error('time grid column did not mount')

    const rect = column.getBoundingClientRect()
    const coords = {
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + (rect.height * (10.5 * 60 + 7)) / 1440,
    }
    await userEvent.pointer([
      { coords, keys: '[MouseLeft>]', target: column },
      { coords, keys: '[/MouseLeft]', target: column },
    ])

    const dialog = within(
      await screen.findByRole('dialog', { name: 'New event' }),
    )
    expect(dialog.getByLabelText('Start time')).toHaveValue('10:30')
    expect(dialog.getByLabelText('End time')).toHaveValue('10:45')
    await userEvent.type(
      dialog.getByRole('textbox', { name: 'Event title' }),
      'Alinhamento rápido',
    )
    await userEvent.click(dialog.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    const open = await canvas.findByRole('button', {
      name: 'Abrir Alinhamento rápido',
    })
    expect(column.contains(open)).toBe(true)
  },
}
