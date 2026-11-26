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
import { RecordGroupRow } from '@tc96/ui/patterns/records/group/composition/record-group-row/record-group-row'
import { useMemo, useState } from 'react'
import { resolveRecordDialog1Labels } from './labels'
import {
  createRecordDialog1AvailabilityOptions,
  createRecordDialog1CalendarOptions,
  createRecordDialog1RecurrenceOptions,
  createRecordDialog1ReminderOptions,
  createRecordDialog1TypeOptions,
} from './record-dialog-1-options'
import {
  defaultRecordDialog1Slot,
  RECORD_DIALOG_1_TIME_ZONE,
  recordDialog1EventWindow,
  recordDialog1ScheduleDay,
  recordDialog1SlotSchedule,
} from './record-dialog-1-schedule'
import type {
  RecordDialog1Availability,
  RecordDialog1Calendar,
  RecordDialog1Props,
  RecordDialog1Type,
  RecordDialog1Values,
} from './types'
import { useRecordDialog1Draft } from './use-record-dialog-1-draft'
import { recordDialog1Variants } from './variants'

export function RecordDialog1({
  availabilityOptions: availabilityOptionsProp,
  calendarOptions: calendarOptionsProp,
  className,
  labels: labelsProp,
  locale = 'pt-BR',
  onCreate,
  onOpenChange,
  open,
  people,
  slot = defaultRecordDialog1Slot,
  timeZone = RECORD_DIALOG_1_TIME_ZONE,
  typeOptions: typeOptionsProp,
}: Readonly<RecordDialog1Props>) {
  const labels = useMemo(
    () => resolveRecordDialog1Labels(labelsProp),
    [labelsProp],
  )
  const typeOptions = useMemo(
    () => typeOptionsProp ?? createRecordDialog1TypeOptions(labels),
    [labels, typeOptionsProp],
  )
  const calendarOptions = useMemo(
    () => calendarOptionsProp ?? createRecordDialog1CalendarOptions(labels),
    [calendarOptionsProp, labels],
  )
  const availabilityOptions = useMemo(
    () =>
      availabilityOptionsProp ?? createRecordDialog1AvailabilityOptions(labels),
    [availabilityOptionsProp, labels],
  )
  const recurrenceOptions = useMemo(
    () => createRecordDialog1RecurrenceOptions(labels.schedule),
    [labels.schedule],
  )
  const reminderOptions = useMemo(
    () => createRecordDialog1ReminderOptions(labels.schedule),
    [labels.schedule],
  )
  const {
    draft,
    latest,
    reset: resetDraft,
    update,
  } = useRecordDialog1Draft(() => ({
    availability: 'busy' as RecordDialog1Availability,
    calendar: 'personal' as RecordDialog1Calendar,
    guests: [] as readonly string[],
    link: null as string | null,
    location: null as string | null,
    phones: [] as readonly string[],
    schedule: recordDialog1SlotSchedule(slot),
    title: '',
    type: 'meeting' as RecordDialog1Type,
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
        const window = recordDialog1EventWindow({
          allDay: schedule.allDay,
          day: recordDialog1ScheduleDay(schedule),
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
        const parsed: RecordDialog1Values = {
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
      stretchBody
      submitDisabled={draft.title.trim() === ''}
      submitLabel={labels.submit}
      submitOnModEnter
      submittingLabel={labels.submitting}
      title={dialogTitle}
      titleAncestor={labels.titleAncestor}
    >
      <div className={recordDialog1Variants({ part: 'body' })}>
        <RecordDialogHeadline
          descriptionLabel={labels.description}
          descriptionMinHeight
          descriptionPlaceholder={labels.descriptionPlaceholder}
          onTitleChange={(title) => update({ title })}
          title={draft.title}
          titleLabel={labels.title}
          titlePlaceholder={labels.titlePlaceholder}
        />
        <div className={recordDialog1Variants({ part: 'rows' })}>
          <RecordGroupRow label={labels.date}>
            <ScheduleProperty
              ariaLabel={labels.date}
              labels={labels.schedule}
              locale={locale}
              onValueChange={(schedule) => update({ schedule })}
              recurrenceOptions={recurrenceOptions}
              reminderOptions={reminderOptions}
              value={draft.schedule}
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.type}>
            <SelectProperty
              ariaLabel={labels.type}
              onValueChange={(value) =>
                update({
                  type: (value as RecordDialog1Type | null) ?? 'meeting',
                })
              }
              options={typeOptions}
              value={draft.type}
            />
          </RecordGroupRow>
          {draft.type === 'meeting' ? (
            <RecordGroupRow label={labels.location}>
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
              />
            </RecordGroupRow>
          ) : null}
          {draft.type === 'video' ? (
            <RecordGroupRow label={labels.link}>
              <TextProperty
                ariaLabel={labels.link}
                icon={propertyDisplayIcons.link}
                labels={{
                  ...defaultPropertyLabels.text,
                  fallback: labels.linkFallback,
                }}
                onCommit={(link) => update({ link })}
                value={draft.link}
              />
            </RecordGroupRow>
          ) : null}
          {draft.type === 'call' ? (
            <RecordGroupRow label={labels.phone}>
              <PhoneProperty
                ariaLabel={labels.phone}
                display="trigger"
                onValueChange={(phones) => update({ phones })}
                placeholder={labels.phonePlaceholder}
                value={draft.phones}
                variant="badge"
              />
            </RecordGroupRow>
          ) : (
            <RecordGroupRow label={labels.guests}>
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
            </RecordGroupRow>
          )}
          <RecordGroupRow label={labels.calendar}>
            <SelectProperty
              ariaLabel={labels.calendar}
              onValueChange={(value) =>
                update({
                  calendar:
                    (value as RecordDialog1Calendar | null) ?? 'personal',
                })
              }
              options={calendarOptions}
              value={draft.calendar}
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.availability}>
            <SelectProperty
              ariaLabel={labels.availability}
              onValueChange={(value) =>
                update({
                  availability:
                    (value as RecordDialog1Availability | null) ?? 'busy',
                })
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
