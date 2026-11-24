import { MapPinIcon } from '@phosphor-icons/react'
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
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { sleep } from '../../../test-utils/sleep'
import {
  availabilityOptions,
  calendarOptions,
  defaultSlot,
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
} from './event-record'
import { people } from './project-record'

export function CreateEventDialog({
  onCreate,
  onOpenChange,
  open,
  slot = defaultSlot,
}: Readonly<{
  onCreate: (values: EventValues) => void | Promise<void>
  onOpenChange: (open: boolean) => void
  open: boolean
  slot?: EventSlot
}>) {
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
    schedule: slotSchedule(slot),
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
        onOpenChange(next)
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
        await sleep(150)
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
  )
}
