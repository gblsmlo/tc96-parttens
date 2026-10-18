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
  dialogTitles,
  type EventSlot,
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
          'RecordDialog as the create step of the Calendar usage, with the body of `Create/Row Properties`: a borderless title and description, then Date, Guests, Location, Type, Calendar and Availability as rows. The Date row starts on the day and window of the `slot` the calendar picked. `Patterns/CollectionViews/Usages/Calendar` opens the same dialog from Nova atividade with the anchor day at 09:00-10:00, and from an empty slot of the time grid through `onSelectSlot` and `slotFromCalendar`, then adds the saved event to the calendar.',
          'The dialog reads `slot` when it mounts and puts every field back to it on close, so the calendar gives it a new `key` for each request instead of passing a new slot to an open dialog.',
        ].join('\n\n'),
      },
      source: { inlineLimit: 200 },
    },
  },
  render: function Create({ onCreate, slot }) {
    const initialSchedule = slotSchedule(slot)
    const [open, setOpen] = useState(true)
    const [title, setTitle] = useState('')
    const [schedule, setSchedule] = useState(initialSchedule)
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
      setSchedule(initialSchedule)
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
          Nova atividade
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
