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
import { resolveRecordDialog2Labels } from './labels'
import {
  createRecordDialog2AvailabilityOptions,
  createRecordDialog2CalendarOptions,
  createRecordDialog2RecurrenceOptions,
  createRecordDialog2ReminderOptions,
  createRecordDialog2TypeOptions,
} from './record-dialog-2-options'
import {
  defaultRecordDialog2Slot,
  RECORD_DIALOG_2_TIME_ZONE,
  recordDialog2EventWindow,
  recordDialog2ScheduleDay,
  recordDialog2SlotSchedule,
} from './record-dialog-2-schedule'
import type {
  RecordDialog2Availability,
  RecordDialog2Calendar,
  RecordDialog2Props,
  RecordDialog2Type,
  RecordDialog2Values,
} from './types'
import { useRecordDialog2Draft } from './use-record-dialog-2-draft'
import { recordDialog2Variants } from './variants'

export function RecordDialog2({
  availabilityOptions: availabilityOptionsProp,
  calendarOptions: calendarOptionsProp,
  className,
  labels: labelsProp,
  locale = 'pt-BR',
  onCreate,
  onOpenChange,
  open,
  people,
  slot = defaultRecordDialog2Slot,
  timeZone = RECORD_DIALOG_2_TIME_ZONE,
  typeOptions: typeOptionsProp,
}: Readonly<RecordDialog2Props>) {
  const labels = useMemo(
    () => resolveRecordDialog2Labels(labelsProp),
    [labelsProp],
  )
  const typeOptions = useMemo(
    () => typeOptionsProp ?? createRecordDialog2TypeOptions(labels),
    [labels, typeOptionsProp],
  )
  const calendarOptions = useMemo(
    () => calendarOptionsProp ?? createRecordDialog2CalendarOptions(labels),
    [calendarOptionsProp, labels],
  )
  const availabilityOptions = useMemo(
    () =>
      availabilityOptionsProp ?? createRecordDialog2AvailabilityOptions(labels),
    [availabilityOptionsProp, labels],
  )
  const recurrenceOptions = useMemo(
    () => createRecordDialog2RecurrenceOptions(labels.schedule),
    [labels.schedule],
  )
  const reminderOptions = useMemo(
    () => createRecordDialog2ReminderOptions(labels.schedule),
    [labels.schedule],
  )
  const {
    draft,
    latest,
    reset: resetDraft,
    update,
  } = useRecordDialog2Draft(() => ({
    availability: 'busy' as RecordDialog2Availability,
    calendar: 'personal' as RecordDialog2Calendar,
    guests: [] as readonly string[],
    link: null as string | null,
    location: null as string | null,
    phones: [] as readonly string[],
    schedule: recordDialog2SlotSchedule(slot),
    title: '',
    type: 'meeting' as RecordDialog2Type,
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
        const window = recordDialog2EventWindow({
          allDay: schedule.allDay,
          day: recordDialog2ScheduleDay(schedule),
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
        const parsed: RecordDialog2Values = {
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
      <div className={recordDialog2Variants({ part: 'body' })}>
        <RecordDialogHeadline
          descriptionLabel={labels.description}
          descriptionMinHeight
          descriptionPlaceholder={labels.descriptionPlaceholder}
          onTitleChange={(title) => update({ title })}
          title={draft.title}
          titleLabel={labels.title}
          titlePlaceholder={labels.titlePlaceholder}
        />
        <div className={recordDialog2Variants({ part: 'properties' })}>
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
              update({ type: (value as RecordDialog2Type | null) ?? 'meeting' })
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
                calendar: (value as RecordDialog2Calendar | null) ?? 'personal',
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
                availability:
                  (value as RecordDialog2Availability | null) ?? 'busy',
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
