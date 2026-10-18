import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  PeopleProperty,
  RecordDialog,
  RecordGroupRow,
  ScheduleProperty,
  SelectProperty,
  TextProperty,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { Switch } from '@tc96/ui/switch'
import { Textarea } from '@tc96/ui/textarea'
import { MapPinIcon } from 'lucide-react'
import { useId, useRef, useState } from 'react'
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
    const [title, setTitle] = useState('')
    const [schedule, setSchedule] = useState(() => slotSchedule(defaultSlot))
    const [guests, setGuests] = useState<readonly string[]>([])
    const [location, setLocation] = useState<string | null>(null)
    // Mod+Enter submits in the same event as the blur that commits Location, before React re-renders.
    const committedLocation = useRef<string | null>(null)
    const [type, setType] = useState('event')
    const [calendar, setCalendar] = useState('personal')
    const [availability, setAvailability] = useState('busy')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [createMore, setCreateMore] = useState(false)
    const createMoreId = useId()

    const reset = () => {
      setTitle('')
      setSchedule(slotSchedule(defaultSlot))
      setGuests([])
      setLocation(null)
      committedLocation.current = null
      setType('event')
      setCalendar('personal')
      setAvailability('busy')
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
            <div className="flex items-center gap-2">
              <Switch
                checked={createMore}
                id={createMoreId}
                onCheckedChange={setCreateMore}
              />
              <label className="text-sm" htmlFor={createMoreId}>
                Create more
              </label>
            </div>
          }
          keepOpenOnSuccess={createMore}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) reset()
          }}
          onSubmit={async (event) => {
            setErrorMessage(null)
            const data = new FormData(event.currentTarget)
            const parsed = eventSchema.safeParse({
              allDay: schedule.allDay,
              availability,
              calendar,
              description: String(data.get('description') ?? ''),
              frequency: schedule.frequency,
              guests,
              location: committedLocation.current ?? '',
              reminderMinutes: schedule.reminders.map(Number),
              title,
              type,
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
          submitDisabled={title.trim() === ''}
          submitLabel="Save"
          submitOnModEnter
          submittingLabel="Saving"
          title={dialogTitles[type] ?? 'New event'}
          titleAncestor="Calendar"
        >
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Field name="title">
                <FieldLabel className="sr-only">Event title</FieldLabel>
                <Input
                  autoFocus
                  className="w-full font-semibold text-lg [&_input]:px-0 [&_input]:placeholder:text-muted-foreground/60 [&_input]:focus:placeholder:text-muted-foreground"
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Add title"
                  unstyled
                  value={title}
                />
              </Field>
              <Field name="description">
                <FieldLabel className="sr-only">Description</FieldLabel>
                <Textarea
                  className="w-full [&_textarea]:min-h-16 [&_textarea]:resize-none [&_textarea]:px-0 [&_textarea]:pt-0.5 [&_textarea]:placeholder:text-muted-foreground/60 [&_textarea]:focus:placeholder:text-muted-foreground"
                  placeholder="Add notes or a meeting link"
                  unstyled
                />
              </Field>
            </div>
            <div>
              <RecordGroupRow label="Date">
                <ScheduleProperty
                  ariaLabel="Date"
                  labels={scheduleLabels}
                  locale="en-US"
                  onValueChange={setSchedule}
                  recurrenceOptions={scheduleRecurrenceOptions}
                  reminderOptions={scheduleReminderOptions}
                  value={schedule}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Guests">
                <PeopleProperty
                  ariaLabel="Guests"
                  dropdownPlacement={{ align: 'start' }}
                  onValueChange={setGuests}
                  options={people}
                  placeholder="Add guests"
                  value={guests}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Location">
                <TextProperty
                  ariaLabel="Location"
                  editing="inline"
                  fallback="Add location"
                  icon={MapPinIcon}
                  onCommit={(next) => {
                    committedLocation.current = next
                    setLocation(next)
                  }}
                  value={location}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Type">
                <SelectProperty
                  ariaLabel="Type"
                  onValueChange={(value) => setType(value ?? 'event')}
                  options={typeOptions}
                  value={type}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Calendar">
                <SelectProperty
                  ariaLabel="Calendar"
                  onValueChange={(value) => setCalendar(value ?? 'personal')}
                  options={calendarOptions}
                  value={calendar}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Availability">
                <SelectProperty
                  ariaLabel="Availability"
                  onValueChange={(value) => setAvailability(value ?? 'busy')}
                  options={availabilityOptions}
                  value={availability}
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
    const chips = dialog.querySelector('[data-slot="combobox-chips"]')
    await waitFor(() =>
      expect(chips && getComputedStyle(chips).boxShadow).not.toContain('3px'),
    )
    const guest = within(dialog).getByRole('button', { name: /Ana Souza/ })
    const guestChip = guest.closest<HTMLElement>('[data-slot="combobox-chip"]')
    const addChip = chips?.querySelector<HTMLElement>(
      '[data-slot="property-surface"]',
    )
    if (!guestChip || !addChip)
      throw new Error('The guest chips did not render.')
    expect(getComputedStyle(guestChip).fontSize).toBe(
      getComputedStyle(addChip).fontSize,
    )
    expect(getComputedStyle(guestChip).borderRadius).toBe(
      getComputedStyle(addChip).borderRadius,
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
