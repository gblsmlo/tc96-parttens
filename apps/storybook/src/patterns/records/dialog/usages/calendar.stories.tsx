import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { CreateEventDialog } from '../create-event-dialog'
import type { EventSlot, EventValues } from '../event-record'

interface CalendarArgs {
  onCreate: (values: EventValues) => void | Promise<void>
  slot: EventSlot
}

const meta = {
  argTypes: {
    onCreate: { control: false },
    slot: {
      control: 'object',
      description:
        'The day (an ISO instant at noon UTC) and the `HH:mm` window of the Date row. The dialog reads it when it mounts and when it closes, so a change shows on the next open.',
    },
  },
  args: {
    onCreate: fn((_values: EventValues) => {}),
    slot: { date: '2026-10-14T12:00:00.000Z', end: '10:00', start: '09:00' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'RecordDialog as the create step of the Calendar usage, with the body of `Create/Row Properties`: a borderless title and description, then Date, Guests, Location, Type, Calendar and Availability as rows. `CreateEventDialog` takes the `slot` the calendar picked and starts the Date row on that day and window. `Patterns/CollectionViews/Usages/Calendar` opens it from Nova atividade with the anchor day at 09:00-10:00, and from an empty slot of the time grid through `onSelectSlot` and `slotFromCalendar`, then adds the saved event to the calendar.',
          'The dialog reads `slot` when it mounts and puts every field back to it on close, so the calendar gives it a new `key` for each request instead of passing a new slot to an open dialog.',
        ].join('\n\n'),
      },
    },
  },
  render: function Create({ onCreate, slot }) {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Nova atividade
        </Button>
        <CreateEventDialog
          onCreate={onCreate}
          onOpenChange={setOpen}
          open={open}
          slot={slot}
        />
      </>
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Usages/Calendar',
} satisfies Meta<CalendarArgs>

export default meta

type Story = StoryObj<CalendarArgs>

export const Create: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Nova atividade on the anchor day: the Date row starts on Oct 14 from 09:00 to 10:00. Save stays disabled until the title has text, and `onCreate` receives `start` and `end` as ISO instants in America/Sao_Paulo.',
      },
    },
  },
}

export const CreateInteraction: Story = {
  ...Create,
  play: async ({ args }) => {
    const findDialog = () => screen.findByRole('dialog', { name: 'New event' })
    const dialog = within(await findDialog())
    const save = dialog.getByRole('button', { name: 'Save' })
    const title = dialog.getByRole('textbox', { name: 'Event title' })

    expect(dialog.getByRole('button', { name: /^Date:/ })).toHaveTextContent(
      'Oct 14 · 09:00 – 10:00',
    )
    expect(save).toBeDisabled()
    await waitFor(() => expect(title).toHaveFocus())
    await userEvent.type(title, 'Revisão de contrato')
    expect(save).toBeEnabled()

    const calendar = dialog.getByRole('combobox', { name: /^Calendar/ })
    await userEvent.click(calendar)
    await userEvent.click(await screen.findByRole('option', { name: 'Sales' }))
    await waitFor(() => expect(calendar).toHaveTextContent('Sales'))

    await userEvent.click(save)
    await waitFor(() =>
      expect(args.onCreate).toHaveBeenCalledWith({
        allDay: false,
        availability: 'busy',
        calendar: 'sales',
        description: '',
        end: '2026-10-14T13:00:00.000Z',
        frequency: null,
        guests: [],
        location: '',
        reminderMinutes: [30],
        start: '2026-10-14T12:00:00.000Z',
        title: 'Revisão de contrato',
        type: 'event',
        until: null,
      }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

    await userEvent.click(
      screen.getByRole('button', { name: 'Nova atividade' }),
    )
    const reopened = within(await findDialog())
    expect(reopened.getByRole('textbox', { name: 'Event title' })).toHaveValue(
      '',
    )
    expect(
      reopened.getByRole('combobox', { name: /^Calendar/ }),
    ).toHaveTextContent('Personal')
    expect(reopened.getByRole('button', { name: /^Date:/ })).toHaveTextContent(
      'Oct 14 · 09:00 – 10:00',
    )
  },
  tags: ['!dev', '!autodocs'],
}
