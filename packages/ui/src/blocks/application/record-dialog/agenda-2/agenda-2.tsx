import {
  defaultPropertyLabels,
  propertyDisplayIcons,
} from '@tc96/ui/patterns/properties/core'
import { PeopleProperty } from '@tc96/ui/patterns/properties/display/people/people-property'
import { PhoneProperty } from '@tc96/ui/patterns/properties/display/phone/phone-property'
import { ScheduleProperty } from '@tc96/ui/patterns/properties/display/schedule/schedule-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import { RecordDialog } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog'
import { RecordDialogCreateMore } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-create-more'
import { RecordDialogHeadline } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-headline'
import { useMemo, useState } from 'react'
import {
  createAgenda2AvailabilityOptions,
  createAgenda2CalendarOptions,
  createAgenda2RecurrenceOptions,
  createAgenda2ReminderOptions,
  createAgenda2TypeOptions,
} from './agenda-2-options'
import {
  AGENDA_2_TIME_ZONE,
  agenda2EventWindow,
  agenda2ScheduleDay,
  agenda2SlotSchedule,
  defaultAgenda2Slot,
} from './agenda-2-schedule'
import { resolveAgenda2Labels } from './labels'
import type {
  Agenda2Availability,
  Agenda2Calendar,
  Agenda2Props,
  Agenda2Type,
  Agenda2Values,
} from './types'
import { useAgenda2Draft } from './use-agenda-2-draft'

export function Agenda2({
  availabilityOptions: availabilityOptionsProp,
  calendarOptions: calendarOptionsProp,
  className,
  labels: labelsProp,
  locale = 'pt-BR',
  onCreate,
  onOpenChange,
  open,
  people,
  slot = defaultAgenda2Slot,
  timeZone = AGENDA_2_TIME_ZONE,
  typeOptions: typeOptionsProp,
}: Readonly<Agenda2Props>) {
  const labels = useMemo(() => resolveAgenda2Labels(labelsProp), [labelsProp])
  const typeOptions = useMemo(
    () => typeOptionsProp ?? createAgenda2TypeOptions(labels),
    [labels, typeOptionsProp],
  )
  const calendarOptions = useMemo(
    () => calendarOptionsProp ?? createAgenda2CalendarOptions(labels),
    [calendarOptionsProp, labels],
  )
  const availabilityOptions = useMemo(
    () => availabilityOptionsProp ?? createAgenda2AvailabilityOptions(labels),
    [availabilityOptionsProp, labels],
  )
  const recurrenceOptions = useMemo(
    () => createAgenda2RecurrenceOptions(labels.schedule),
    [labels.schedule],
  )
  const reminderOptions = useMemo(
    () => createAgenda2ReminderOptions(labels.schedule),
    [labels.schedule],
  )
  const {
    draft,
    latest,
    reset: resetDraft,
    update,
  } = useAgenda2Draft(() => ({
    availability: 'busy' as Agenda2Availability,
    calendar: 'personal' as Agenda2Calendar,
    guests: [] as readonly string[],
    link: null as string | null,
    location: null as string | null,
    phones: [] as readonly string[],
    schedule: agenda2SlotSchedule(slot),
    title: '',
    type: 'meeting' as Agenda2Type,
  }))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createMore, setCreateMore] = useState(false)

  const reset = () => {
    resetDraft()
    setErrorMessage(null)
  }

  const dialogTitle = {
    call: labels.titleCall,
    meeting: labels.titleMeeting,
    video: labels.titleVideo,
  }[draft.type]

  return (
    <RecordDialog
      cancelLabel={labels.cancel}
      className={className}
      errorMessage={errorMessage}
      footerStart={
        <RecordDialogCreateMore
          checked={createMore}
          label={labels.createMore}
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
        const window = agenda2EventWindow({
          allDay: schedule.allDay,
          day: agenda2ScheduleDay(schedule),
          end: schedule.endTime,
          start: schedule.startTime,
          timeZone,
        })
        if (!window.start || !window.end) {
          setErrorMessage(labels.missingTime)
          return false
        }
        if (window.end <= window.start) {
          setErrorMessage(labels.endBeforeStart)
          return false
        }
        const parsed: Agenda2Values = {
          allDay: schedule.allDay,
          availability: values.availability,
          calendar: values.calendar,
          description: String(data.get('description') ?? '').trim(),
          end: window.end,
          frequency: schedule.frequency,
          guests: values.type === 'call' ? [] : values.guests,
          link: values.type === 'video' ? (values.link ?? '').trim() : '',
          location:
            values.type === 'meeting' ? (values.location ?? '').trim() : '',
          phones: values.type === 'call' ? values.phones : [],
          reminderMinutes: schedule.reminders.map(Number),
          start: window.start,
          title: values.title.trim(),
          type: values.type,
          until: schedule.until,
        }
        if (parsed.title === '') return false
        try {
          await onCreate(parsed)
        } catch (error) {
          setErrorMessage(
            error instanceof Error ? error.message : labels.saveFailed,
          )
          return false
        }
        if (createMore) reset()
        return true
      }}
      open={open}
      size="default"
      stretchBody
      submitDisabled={draft.title.trim() === ''}
      submitLabel={labels.submit}
      submitOnModEnter
      submittingLabel={labels.submitting}
      title={dialogTitle}
      titleAncestor={labels.titleAncestor}
    >
      <div className="flex flex-1 flex-col gap-3">
        <RecordDialogHeadline
          descriptionLabel={labels.description}
          descriptionPlaceholder={labels.descriptionPlaceholder}
          onTitleChange={(title) => update({ title })}
          title={draft.title}
          titleLabel={labels.title}
          titlePlaceholder={labels.titlePlaceholder}
        />
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <ScheduleProperty
            ariaLabel={labels.date}
            labels={labels.schedule}
            locale={locale}
            onValueChange={(schedule) => update({ schedule })}
            recurrenceOptions={recurrenceOptions}
            reminderOptions={reminderOptions}
            value={draft.schedule}
            variant="badge"
          />
          <SelectProperty
            ariaLabel={labels.type}
            onValueChange={(value) =>
              update({ type: (value as Agenda2Type | null) ?? 'meeting' })
            }
            options={typeOptions}
            value={draft.type}
            variant="badge"
          />
          {draft.type === 'meeting' ? (
            <TextProperty
              ariaLabel={labels.location}
              icon={propertyDisplayIcons.location}
              labels={{
                ...defaultPropertyLabels.text,
                ...labels.text,
                fallback: labels.locationFallback,
              }}
              onCommit={(location) => update({ location })}
              value={draft.location}
              variant="badge"
            />
          ) : null}
          {draft.type === 'video' ? (
            <TextProperty
              ariaLabel={labels.link}
              icon={propertyDisplayIcons.link}
              labels={{
                ...defaultPropertyLabels.text,
                fallback: labels.linkFallback,
              }}
              onCommit={(link) => update({ link })}
              value={draft.link}
              variant="badge"
            />
          ) : null}
          {draft.type === 'call' ? (
            <PhoneProperty
              ariaLabel={labels.phone}
              display="trigger"
              onValueChange={(phones) => update({ phones })}
              placeholder={labels.phonePlaceholder}
              value={draft.phones}
              variant="badge"
            />
          ) : (
            <PeopleProperty
              ariaLabel={labels.guests}
              display="stack"
              dropdownPlacement={{ align: 'start' }}
              labels={labels.peoplePicker}
              onValueChange={(guests) => update({ guests })}
              options={people}
              placeholder={labels.guestsPlaceholder}
              value={draft.guests}
              variant="badge"
            />
          )}
          <SelectProperty
            ariaLabel={labels.calendar}
            onValueChange={(value) =>
              update({
                calendar: (value as Agenda2Calendar | null) ?? 'personal',
              })
            }
            options={calendarOptions}
            value={draft.calendar}
            variant="badge"
          />
          <SelectProperty
            ariaLabel={labels.availability}
            onValueChange={(value) =>
              update({
                availability: (value as Agenda2Availability | null) ?? 'busy',
              })
            }
            options={availabilityOptions}
            value={draft.availability}
            variant="badge"
          />
        </div>
      </div>
    </RecordDialog>
  )
}
