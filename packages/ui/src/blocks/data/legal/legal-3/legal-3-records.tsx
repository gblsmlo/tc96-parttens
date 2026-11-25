import {
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
} from '@tc96/ui/patterns/calendar/composition/calendar-event-chip/calendar-event-chip'
import { DataCollectionListRow } from '../../shared/collection/data-collection-record-parts'
import {
  Legal3DueField,
  type Legal3FieldContext,
  Legal3OwnerField,
  Legal3QueueField,
  Legal3StatusField,
} from './legal-3-fields'
import { legal3ChipTones } from './legal-3-options'
import type { Legal3Deadline } from './types'

export const renderLegal3ListRow =
  (context: Legal3FieldContext) => (item: Legal3Deadline) => {
    const { labels, onOpen } = context
    return (
      <DataCollectionListRow
        caption={[labels.kinds[item.kind], item.caseNumber, item.caseTitle]}
        fields={
          <>
            <Legal3StatusField context={context} item={item} />
            <Legal3QueueField context={context} item={item} />
            <Legal3DueField context={context} item={item} />
            <Legal3OwnerField avatarOnly context={context} item={item} />
          </>
        }
        onOpen={onOpen ? () => onOpen(item.id) : undefined}
        title={item.title}
      />
    )
  }

export const renderLegal3CalendarChip =
  (context: Legal3FieldContext) => (item: Legal3Deadline) => {
    const { formatTime, labels, onOpen } = context
    return (
      <CalendarEventChip
        completed={item.status === 'done'}
        data-status={item.status}
        tone={legal3ChipTones[item.status]}
      >
        {item.allDay ? null : (
          <CalendarEventChipTime dateTime={item.dueAt}>
            {formatTime(item.dueAt)}
          </CalendarEventChipTime>
        )}
        <CalendarEventChipTitle>{item.title}</CalendarEventChipTitle>
        {onOpen ? (
          <CalendarEventChipOpenTrigger
            aria-label={labels.openDeadline(item.title)}
            onClick={() => onOpen(item.id)}
          />
        ) : null}
      </CalendarEventChip>
    )
  }
