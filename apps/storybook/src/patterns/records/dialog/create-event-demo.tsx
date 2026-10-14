import {
  PeopleProperty,
  RecordDialog,
  RecordGroupRow,
  ScheduleProperty,
  SelectProperty,
  TextProperty,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { MapPinIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { CreateMoreSwitch } from './create-more'
import { delay } from './delay'
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
import { RecordHeadline } from './record-headline'

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
  const [title, setTitle] = useState('')
  const [schedule, setSchedule] = useState(() => slotSchedule(slot))
  const [guests, setGuests] = useState<readonly string[]>([])
  const [location, setLocation] = useState<string | null>(null)
  // Mod+Enter submits in the same event as the blur that commits Location, before React re-renders.
  const committedLocation = useRef<string | null>(null)
  const [type, setType] = useState('event')
  const [calendar, setCalendar] = useState('personal')
  const [availability, setAvailability] = useState('busy')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createMore, setCreateMore] = useState(false)

  const reset = () => {
    setTitle('')
    setSchedule(slotSchedule(slot))
    setGuests([])
    setLocation(null)
    committedLocation.current = null
    setType('event')
    setCalendar('personal')
    setAvailability('busy')
    setErrorMessage(null)
  }

  return (
    <RecordDialog
      errorMessage={errorMessage}
      footerStart={
        <CreateMoreSwitch
          checked={createMore}
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
        await delay(150)
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
        <RecordHeadline
          descriptionPlaceholder="Add notes or a meeting link"
          onTitleChange={setTitle}
          title={title}
          titleLabel="Event title"
          titlePlaceholder="Add title"
        />
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
  )
}

export function CreateEventDemo({
  onCreate,
}: Readonly<{
  onCreate: (values: EventValues) => void | Promise<void>
}>) {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Open dialog
      </Button>
      <CreateEventDialog
        onCreate={onCreate}
        onOpenChange={setOpen}
        open={open}
      />
    </>
  )
}
