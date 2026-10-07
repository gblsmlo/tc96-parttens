import {
  DateProperty,
  PeopleProperty,
  RecordDialog,
  SelectProperty,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { Switch } from '@tc96/ui/switch'
import { Textarea } from '@tc96/ui/textarea'
import {
  AlignLeftIcon,
  ClockIcon,
  type LucideIcon,
  MapPinIcon,
  UsersIcon,
} from 'lucide-react'
import { type ReactNode, useId, useState } from 'react'
import { delay } from './delay'
import {
  availabilityOptions,
  calendarGroups,
  defaultSlot,
  dialogTitles,
  type EventValues,
  eventSchema,
  eventWindow,
  reminderOptions,
} from './event-record'
import { people } from './project-record'

function EventRow({
  children,
  icon: Icon,
}: Readonly<{ children: ReactNode; icon: LucideIcon }>) {
  return (
    <div className="flex gap-3">
      <span className="flex h-7 shrink-0 items-center">
        <Icon aria-hidden className="size-4 text-muted-foreground" />
      </span>
      <div className="grid min-w-0 flex-1 gap-1">{children}</div>
    </div>
  )
}

export function CreateEventDemo({
  onCreate,
}: Readonly<{ onCreate: (values: EventValues) => void }>) {
  const allDayId = useId()
  const [open, setOpen] = useState(true)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(defaultSlot.date)
  const [start, setStart] = useState(defaultSlot.start)
  const [end, setEnd] = useState(defaultSlot.end)
  const [allDay, setAllDay] = useState(false)
  const [guests, setGuests] = useState<readonly string[]>([])
  const [calendar, setCalendar] = useState('event')
  const [availability, setAvailability] = useState('busy')
  const [reminder, setReminder] = useState('30')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const reset = () => {
    setTitle('')
    setDate(defaultSlot.date)
    setStart(defaultSlot.start)
    setEnd(defaultSlot.end)
    setAllDay(false)
    setGuests([])
    setCalendar('event')
    setAvailability('busy')
    setReminder('30')
    setErrorMessage(null)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Open dialog
      </Button>
      <RecordDialog
        errorMessage={errorMessage}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) reset()
        }}
        onSubmit={async (event) => {
          setErrorMessage(null)
          const data = new FormData(event.currentTarget)
          const parsed = eventSchema.safeParse({
            allDay,
            availability,
            calendar,
            description: String(data.get('description') ?? ''),
            guests,
            location: String(data.get('location') ?? ''),
            reminderMinutes: reminder === 'none' ? null : Number(reminder),
            title,
            ...eventWindow({ allDay, date, end, start }),
          })
          if (!parsed.success) {
            setErrorMessage(parsed.error.issues[0]?.message ?? null)
            return false
          }
          await delay(150)
          onCreate(parsed.data)
          return true
        }}
        open={open}
        submitDisabled={title.trim() === ''}
        submitLabel="Save"
        submitOnModEnter
        submittingLabel="Saving"
        title={dialogTitles[calendar] ?? 'New event'}
        titleAncestor="Calendar"
      >
        <div className="grid gap-4">
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
          <EventRow icon={ClockIcon}>
            <div className="flex flex-wrap items-center gap-2">
              <DateProperty
                allowClear={false}
                ariaLabel="Date"
                locale="en-US"
                onValueChange={(value) => {
                  if (value) setDate(value)
                }}
                timeZone="UTC"
                value={date}
              />
              {allDay ? null : (
                <>
                  <Input
                    aria-label="Start time"
                    className="w-28"
                    nativeInput
                    onChange={(event) => setStart(event.currentTarget.value)}
                    size="sm"
                    type="time"
                    value={start}
                  />
                  <span aria-hidden className="text-muted-foreground text-sm">
                    –
                  </span>
                  <Input
                    aria-label="End time"
                    className="w-28"
                    nativeInput
                    onChange={(event) => setEnd(event.currentTarget.value)}
                    size="sm"
                    type="time"
                    value={end}
                  />
                </>
              )}
              <div className="flex items-center gap-2">
                <Switch
                  checked={allDay}
                  id={allDayId}
                  onCheckedChange={setAllDay}
                />
                <label className="text-sm" htmlFor={allDayId}>
                  All day
                </label>
              </div>
            </div>
          </EventRow>
          <EventRow icon={UsersIcon}>
            <div className="flex min-h-7 items-center">
              <PeopleProperty
                ariaLabel="Guests"
                onValueChange={setGuests}
                options={people}
                placeholder="Add guests"
                value={guests}
              />
            </div>
          </EventRow>
          <EventRow icon={MapPinIcon}>
            <Field name="location">
              <FieldLabel className="sr-only">Location</FieldLabel>
              <Input
                className="w-full [&_input]:px-0 [&_input]:placeholder:text-muted-foreground/60 [&_input]:focus:placeholder:text-muted-foreground"
                placeholder="Add location"
                unstyled
              />
            </Field>
          </EventRow>
          <EventRow icon={AlignLeftIcon}>
            <Field name="description">
              <FieldLabel className="sr-only">Description</FieldLabel>
              <Textarea
                className="w-full [&_textarea]:min-h-16 [&_textarea]:resize-none [&_textarea]:px-0 [&_textarea]:pt-0.5 [&_textarea]:placeholder:text-muted-foreground/60 [&_textarea]:focus:placeholder:text-muted-foreground"
                placeholder="Add description"
                unstyled
              />
            </Field>
          </EventRow>
          <div className="flex min-h-7 flex-wrap items-center gap-2">
            <SelectProperty
              ariaLabel="Calendar"
              groups={calendarGroups}
              onValueChange={(value) => setCalendar(value ?? 'event')}
              value={calendar}
            />
            <SelectProperty
              ariaLabel="Availability"
              onValueChange={(value) => setAvailability(value ?? 'busy')}
              options={availabilityOptions}
              value={availability}
            />
            <SelectProperty
              ariaLabel="Reminder"
              onValueChange={(value) => setReminder(value ?? 'none')}
              options={reminderOptions}
              value={reminder}
            />
          </div>
        </div>
      </RecordDialog>
    </>
  )
}
