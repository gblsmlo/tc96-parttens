import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { CreateEventDemo } from '../create-event-demo'

const onCreateEvent = fn()

const meta = {
  args: { onCreate: onCreateEvent },
  component: CreateEventDemo,
  parameters: {
    docs: {
      description: {
        component:
          'RecordDialog as quick capture with the properties as rows: a borderless title and description, then labeled rows (`RecordGroupRow`) whose values are property displays.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Create/Row Properties',
} satisfies Meta<typeof CreateEventDemo>

export default meta

type Story = StoryObj<typeof meta>

export const RowProperties: Story = {
  beforeEach: () => {
    onCreateEvent.mockClear()
  },
  parameters: {
    docs: {
      description: {
        story:
          'Quick capture of a calendar event or appointment, prefilled with the clicked slot: title and description, then a property list ordered from what places the event to what classifies it: Date (a `ScheduleProperty` for the day, times, repeat and reminders), Guests, Location, Type (Event, Appointment), Calendar (Appointments, Sales, Personal) and Availability (Busy, Free). The payload carries `start` and `end` as ISO instants in the calendar time zone, or the whole day when All day is on, plus `frequency`, `until` and `reminderMinutes` from the schedule. Create more keeps the dialog open after saving and puts the fields back to their defaults.',
      },
    },
  },
  render: () => <CreateEventDemo onCreate={onCreateEvent} />,
}

const openSchedule = async (dialog: HTMLElement) => {
  await userEvent.click(within(dialog).getByRole('button', { name: /^Date:/ }))
  return waitFor(() => {
    const popup = document.querySelector<HTMLElement>(
      '[data-slot="schedule-popup"]',
    )
    if (!popup) throw new Error('The schedule popup did not open.')
    return within(popup)
  })
}

const closeSchedule = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() =>
    expect(document.querySelector('[data-slot="schedule-popup"]')).toBeNull(),
  )
}

const pickTime = async (
  dialog: HTMLElement,
  field: 'Start' | 'End',
  time: string,
) => {
  const popup = await openSchedule(dialog)
  await userEvent.click(popup.getByRole('button', { name: 'Time' }))
  await userEvent.click(popup.getByRole('combobox', { name: field }))
  await userEvent.click(await screen.findByRole('option', { name: time }))
  await closeSchedule()
}

export const RowPropertiesInteraction: Story = {
  ...RowProperties,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'New event' })
    const save = within(dialog).getByRole('button', { name: 'Save' })
    const title = within(dialog).getByRole('textbox', { name: 'Event title' })
    const type = within(dialog).getByRole('combobox', { name: /^Type/ })
    const calendar = within(dialog).getByRole('combobox', { name: /^Calendar/ })
    const availability = within(dialog).getByRole('combobox', {
      name: /^Availability/,
    })
    const labels = Array.from(
      dialog.querySelectorAll('[data-slot="record-group-row-label"]'),
      (label) => label.textContent,
    )

    expect(labels).toEqual([
      'Date',
      'Guests',
      'Location',
      'Type',
      'Calendar',
      'Availability',
    ])
    expect(
      within(dialog).getByRole('switch', { name: 'Create more' }),
    ).not.toBeChecked()
    expect(save).toBeDisabled()
    await waitFor(() => expect(title).toHaveFocus())
    await userEvent.type(title, 'Discovery call')
    expect(save).toBeEnabled()
    expect(
      within(dialog).getByRole('button', { name: /^Date:/ }),
    ).toHaveTextContent('Oct 14 · 14:00 – 15:00')

    expect(type).toHaveTextContent('Event')
    expect(calendar).toHaveTextContent('Personal')

    await userEvent.click(type)
    await userEvent.click(
      await screen.findByRole('option', { name: 'Appointment' }),
    )
    await waitFor(() => expect(type).toHaveTextContent('Appointment'))
    await screen.findByRole('dialog', { name: 'New appointment' })

    await pickTime(dialog, 'Start', '16:00')
    await userEvent.click(save)
    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'End time must be after the start time.',
    )
    expect(onCreateEvent).not.toHaveBeenCalled()
    expect(dialog).toBeVisible()

    await pickTime(dialog, 'End', '17:30')
    expect(
      within(dialog).getByRole('button', { name: /^Date:/ }),
    ).toHaveTextContent('Oct 14 · 16:00 – 17:30')

    const addGuests = within(dialog).getByRole('button', { name: 'Add guests' })
    expect(addGuests).toHaveAttribute('data-slot', 'property-surface')
    expect(addGuests).toHaveAttribute('data-empty', 'true')
    await userEvent.click(addGuests)
    await userEvent.click(
      await screen.findByRole('option', { name: /Ana Souza/ }),
    )
    expect(
      document.querySelector('[data-slot="combobox-positioner"]'),
    ).toHaveAttribute('data-align', 'start')
    await userEvent.keyboard('{Escape}')
    expect(
      screen.getByRole('dialog', { name: 'New appointment' }),
    ).toBeVisible()
    const chips = dialog.querySelector('[data-slot="combobox-chips"]')
    await waitFor(() =>
      expect(chips && getComputedStyle(chips).boxShadow).not.toContain('3px'),
    )

    await userEvent.type(
      within(dialog).getByRole('textbox', { name: 'Location' }),
      'Rua Augusta, 1500',
    )

    const popup = await openSchedule(dialog)
    await userEvent.click(popup.getByRole('button', { name: 'Reminders' }))
    await userEvent.click(popup.getByRole('button', { name: 'Add reminder' }))
    await userEvent.click(
      await screen.findByRole('option', { name: '1 hour before' }),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await closeSchedule()

    await userEvent.click(calendar)
    await userEvent.click(await screen.findByRole('option', { name: 'Sales' }))
    await waitFor(() => expect(calendar).toHaveTextContent('Sales'))

    await userEvent.click(availability)
    await userEvent.click(await screen.findByRole('option', { name: 'Free' }))
    await waitFor(() => expect(availability).toHaveTextContent('Free'))

    await userEvent.click(save)
    await waitFor(() =>
      expect(onCreateEvent).toHaveBeenCalledWith({
        allDay: false,
        availability: 'free',
        calendar: 'sales',
        description: '',
        end: '2026-10-14T20:30:00.000Z',
        frequency: null,
        guests: ['ana'],
        location: 'Rua Augusta, 1500',
        reminderMinutes: [30, 60],
        start: '2026-10-14T19:00:00.000Z',
        title: 'Discovery call',
        type: 'appointment',
        until: null,
      }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }))
    const reopened = await screen.findByRole('dialog', { name: 'New event' })
    await userEvent.type(
      within(reopened).getByRole('textbox', { name: 'Event title' }),
      'Team offsite',
    )
    const allDayPopup = await openSchedule(reopened)
    await userEvent.click(allDayPopup.getByRole('button', { name: 'Time' }))
    await userEvent.click(allDayPopup.getByRole('switch', { name: 'All day' }))
    await closeSchedule()
    expect(
      within(reopened).getByRole('button', { name: /^Date:/ }),
    ).toHaveTextContent(/^Oct 14$/)
    expect(
      within(reopened).getByRole('combobox', { name: /^Availability/ }),
    ).toHaveTextContent('Busy')
    expect(
      within(reopened).getByRole('textbox', { name: 'Description' }),
    ).toHaveAttribute('placeholder', 'Add notes or a meeting link')

    const createMore = within(reopened).getByRole('switch', {
      name: 'Create more',
    })
    await userEvent.click(createMore)
    await userEvent.type(
      within(reopened).getByRole('textbox', { name: 'Location' }),
      'Main office',
    )
    await userEvent.keyboard('{Control>}{Enter}{/Control}')
    await waitFor(() =>
      expect(onCreateEvent).toHaveBeenLastCalledWith({
        allDay: true,
        availability: 'busy',
        calendar: 'personal',
        description: '',
        end: '2026-10-15T03:00:00.000Z',
        frequency: null,
        guests: [],
        location: 'Main office',
        reminderMinutes: [30],
        start: '2026-10-14T03:00:00.000Z',
        title: 'Team offsite',
        type: 'event',
        until: null,
      }),
    )
    expect(onCreateEvent).toHaveBeenCalledTimes(2)
    await waitFor(() =>
      expect(
        within(reopened).getByRole('textbox', { name: 'Event title' }),
      ).toHaveValue(''),
    )
    expect(screen.getByRole('dialog', { name: 'New event' })).toBeVisible()
    expect(
      within(reopened).getByRole('button', { name: /^Date:/ }),
    ).toHaveTextContent('Oct 14 · 14:00 – 15:00')
    expect(
      within(reopened).getByRole('textbox', { name: 'Location' }),
    ).toHaveValue('')
    expect(createMore).toBeChecked()
  },
  tags: ['!dev', '!autodocs'],
}
