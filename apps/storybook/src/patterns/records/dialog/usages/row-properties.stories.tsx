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
import { expect, fn, screen, within } from 'storybook/test'
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
    docs: { source: { inlineLimit: 200 } },
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
  title: 'Patterns/Records/Dialog/Usages',
} satisfies Meta<RowPropertiesArgs>

export default meta

type Story = StoryObj<RowPropertiesArgs>

export const RowProperties: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Quick capture of a calendar event or appointment, prefilled with the clicked slot: title and description, then a property list ordered from what places the event to what classifies it: Date (a `ScheduleProperty` for the day, times, repeat and reminders), Guests, Location, Type (Event, Appointment), Calendar (Appointments, Sales, Personal) and Availability (Busy, Free). The payload carries `start` and `end` as ISO instants in the calendar time zone, or the whole day when All day is on, plus `frequency`, `until` and `reminderMinutes` from the schedule. Location commits on blur, so the draft lives in `useRecordDraft` and Mod+Enter reads `latest`. An end before the start, or a failed save, shows in `errorMessage`. Create more keeps the dialog open after saving and puts the fields back to their defaults.',
      },
    },
  },
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'New event' }),
    )

    await expect(
      dialog.getByRole('button', { name: /^Date:/ }),
    ).toHaveTextContent('Oct 14 · 14:00 – 15:00')
    await expect(
      dialog.getByRole('combobox', { name: /^Calendar/ }),
    ).toHaveTextContent('Personal')
    await expect(
      dialog.getByRole('combobox', { name: /^Availability/ }),
    ).toHaveTextContent('Busy')
  },
}
