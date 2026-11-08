import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  PeopleProperty,
  RecordDialog,
  RecordDialogCreateMore,
  RecordDialogHeadline,
  RecordGroupRow,
  ScheduleProperty,
  SelectProperty,
  TextProperty,
  useRecordDraft,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { MapPinIcon } from 'lucide-react'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  availabilityOptions,
  calendarOptions,
  defaultSlot,
  dialogTitles,
  type EventValues,
  eventSchema,
  eventWindow,
  scheduleDay,
  scheduleLabels,
  scheduleRecurrenceOptions,
  scheduleReminderOptions,
  slotSchedule,
  typeOptions,
} from '../event-record'
import { people } from '../project-record'

interface RowPropertiesArgs {
  onCreate: (values: EventValues) => void | Promise<void>
}

const meta = {
  args: { onCreate: fn(async (_values: EventValues) => {}) },
  parameters: {
    docs: {
      description: {
        component:
          'RecordDialog as quick capture with the properties as rows: a borderless title and description, then labeled rows (`RecordGroupRow`) whose values are property displays.',
      },
      source: { inlineLimit: 200 },
    },
  },
  render: function RowProperties({ onCreate }) {
    const [open, setOpen] = useState(true)
    const {
      draft,
      latest,
      reset: resetDraft,
      update,
    } = useRecordDraft(() => ({
      availability: 'busy',
      calendar: 'personal',
      guests: [] as readonly string[],
      location: null as string | null,
      schedule: slotSchedule(defaultSlot),
      title: '',
      type: 'event',
    }))
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [createMore, setCreateMore] = useState(false)

    const reset = () => {
      resetDraft()
      setErrorMessage(null)
    }

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Open dialog
        </Button>
        <RecordDialog
          errorMessage={errorMessage}
          footerStart={
            <RecordDialogCreateMore
              checked={createMore}
              label="Create more"
              onCheckedChange={setCreateMore}
            />
          }
          keepOpenOnSuccess={createMore}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) reset()
          }}
          onSubmit={async (event) => {
            setErrorMessage(null)
            const data = new FormData(event.currentTarget)
            const { schedule, ...values } = latest.current
            const parsed = eventSchema.safeParse({
              allDay: schedule.allDay,
              availability: values.availability,
              calendar: values.calendar,
              description: String(data.get('description') ?? ''),
              frequency: schedule.frequency,
              guests: values.guests,
              location: values.location ?? '',
              reminderMinutes: schedule.reminders.map(Number),
              title: values.title,
              type: values.type,
              until: schedule.until,
              ...eventWindow({
                allDay: schedule.allDay,
                day: scheduleDay(schedule),
                end: schedule.endTime,
                start: schedule.startTime,
              }),
            })
            if (!parsed.success) {
              setErrorMessage(parsed.error.issues[0]?.message ?? null)
              return false
            }
            try {
              await onCreate(parsed.data)
            } catch (error) {
              setErrorMessage(
                error instanceof Error ? error.message : 'Could not save.',
              )
              return false
            }
            if (createMore) reset()
            return true
          }}
          open={open}
          submitDisabled={draft.title.trim() === ''}
          submitLabel="Save"
          submitOnModEnter
          submittingLabel="Saving"
          title={dialogTitles[draft.type] ?? 'New event'}
          titleAncestor="Calendar"
        >
          <div className="grid gap-4">
            <RecordDialogHeadline
              descriptionLabel="Description"
              descriptionPlaceholder="Add notes or a meeting link"
              onTitleChange={(title) => update({ title })}
              title={draft.title}
              titleLabel="Event title"
              titlePlaceholder="Add title"
            />
            <div>
              <RecordGroupRow label="Date">
                <ScheduleProperty
                  ariaLabel="Date"
                  labels={scheduleLabels}
                  locale="en-US"
                  onValueChange={(schedule) => update({ schedule })}
                  recurrenceOptions={scheduleRecurrenceOptions}
                  reminderOptions={scheduleReminderOptions}
                  value={draft.schedule}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Guests">
                <PeopleProperty
                  ariaLabel="Guests"
                  dropdownPlacement={{ align: 'start' }}
                  onValueChange={(guests) => update({ guests })}
                  options={people}
                  placeholder="Add guests"
                  value={draft.guests}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Location">
                <TextProperty
                  ariaLabel="Location"
                  editing="inline"
                  fallback="Add location"
                  icon={MapPinIcon}
                  onCommit={(location) => update({ location })}
                  value={draft.location}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Type">
                <SelectProperty
                  ariaLabel="Type"
                  onValueChange={(value) => update({ type: value ?? 'event' })}
                  options={typeOptions}
                  value={draft.type}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Calendar">
                <SelectProperty
                  ariaLabel="Calendar"
                  onValueChange={(value) =>
                    update({ calendar: value ?? 'personal' })
                  }
                  options={calendarOptions}
                  value={draft.calendar}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Availability">
                <SelectProperty
                  ariaLabel="Availability"
                  onValueChange={(value) =>
                    update({ availability: value ?? 'busy' })
                  }
                  options={availabilityOptions}
                  value={draft.availability}
                />
              </RecordGroupRow>
            </div>
          </div>
        </RecordDialog>
      </>
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Create/Row Properties',
} satisfies Meta<RowPropertiesArgs>

export default meta

type Story = StoryObj<RowPropertiesArgs>

export const RowProperties: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Quick capture of a calendar event or appointment, prefilled with the clicked slot: title and description, then a property list ordered from what places the event to what classifies it: Date (a `ScheduleProperty` for the day, times, repeat and reminders), Guests, Location, Type (Event, Appointment), Calendar (Appointments, Sales, Personal) and Availability (Busy, Free). The payload carries `start` and `end` as ISO instants in the calendar time zone, or the whole day when All day is on, plus `frequency`, `until` and `reminderMinutes` from the schedule. Create more keeps the dialog open after saving and puts the fields back to their defaults.',
      },
    },
  },
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
  play: async ({ args }) => {
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
    expect(args.onCreate).not.toHaveBeenCalled()
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
    expect(
      within(dialog).getByRole('button', { name: /Ana Souza/ }),
    ).toBeVisible()

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
      expect(args.onCreate).toHaveBeenCalledWith({
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
      expect(args.onCreate).toHaveBeenLastCalledWith({
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
    expect(args.onCreate).toHaveBeenCalledTimes(2)
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

export const ModEnterAfterCommit: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Location is an inline `TextProperty` that commits on blur. `useRecordDraft` keeps the committed value in `latest`, so Mod+Enter right after the edit submits it before React re-renders.',
      },
    },
  },
}

export const ModEnterAfterCommitInteraction: Story = {
  ...ModEnterAfterCommit,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog', { name: 'New event' })
    await userEvent.type(
      within(dialog).getByRole('textbox', { name: 'Event title' }),
      'Quick sync',
    )
    await userEvent.type(
      within(dialog).getByRole('textbox', { name: 'Location' }),
      'Room 4',
    )
    await userEvent.keyboard('{Control>}{Enter}{/Control}')
    await waitFor(() =>
      expect(args.onCreate).toHaveBeenCalledWith(
        expect.objectContaining({ location: 'Room 4', title: 'Quick sync' }),
      ),
    )
    expect(args.onCreate).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
  tags: ['!dev', '!autodocs'],
}

export const FailedSubmit: Story = {
  args: {
    onCreate: fn(async (_values: EventValues) => {
      await new Promise((resolve) => setTimeout(resolve, 150))
      throw new Error('Could not save the event. Try again.')
    }),
  },
  parameters: {
    docs: {
      description: {
        story:
          'When the save fails the dialog stays open, the title and the properties keep their values, the message shows in the alert above the footer and focus returns to the submit button.',
      },
    },
  },
}

export const FailedSubmitInteraction: Story = {
  ...FailedSubmit,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog', { name: 'New event' })
    const title = within(dialog).getByRole('textbox', { name: 'Event title' })
    const calendar = within(dialog).getByRole('combobox', { name: /^Calendar/ })
    const save = within(dialog).getByRole('button', { name: 'Save' })

    await userEvent.type(title, 'Discovery call')
    await userEvent.click(calendar)
    await userEvent.click(await screen.findByRole('option', { name: 'Sales' }))
    await waitFor(() => expect(calendar).toHaveTextContent('Sales'))

    await userEvent.click(save)
    await within(dialog).findByRole('button', { name: 'Saving' })
    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'Could not save the event. Try again.',
    )

    await waitFor(() => expect(save).toBeEnabled())
    expect(args.onCreate).toHaveBeenCalledTimes(1)
    expect(title).toHaveValue('Discovery call')
    expect(calendar).toHaveTextContent('Sales')
    expect(
      within(dialog).getByRole('button', { name: /^Date:/ }),
    ).toHaveTextContent('Oct 14 · 14:00 – 15:00')
    expect(dialog).toBeVisible()
    expect(document.activeElement).toBe(save)
  },
  tags: ['!dev', '!autodocs'],
}
