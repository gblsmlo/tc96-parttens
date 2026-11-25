import {
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
} from '@tc96/ui/patterns/calendar/composition/calendar-event-chip/calendar-event-chip'
import type { CollectionCalendarViewProps } from '@tc96/ui/patterns/collection/composition/collection-layout-outlet'
import { DataCollectionListRow } from '../../shared/collection/data-collection-record-parts'
import {
  Agenda1CancelButton,
  Agenda1CompletedMark,
  type Agenda1FieldContext,
  Agenda1KindField,
  Agenda1ModalityField,
  Agenda1OwnerField,
  agenda1CaptionOf,
  canCancelAgenda1,
} from './agenda-1-fields'
import { agenda1ChipTones } from './agenda-1-options'
import type { Agenda1Entry } from './types'

type Agenda1RenderContext = Parameters<
  CollectionCalendarViewProps<Agenda1Entry>['renderRecord']
>[1]

export const renderAgenda1ListRow =
  (context: Agenda1FieldContext) => (entry: Agenda1Entry) => {
    const { labels, onOpen } = context
    return (
      <DataCollectionListRow
        actions={
          canCancelAgenda1(context, entry) ? (
            <Agenda1CancelButton context={context} entry={entry} />
          ) : undefined
        }
        caption={agenda1CaptionOf({ context, entry })}
        fields={
          <>
            <Agenda1KindField context={context} entry={entry} />
            <Agenda1ModalityField context={context} entry={entry} />
            <Agenda1OwnerField avatarOnly context={context} entry={entry} />
          </>
        }
        mark={
          entry.completed ? (
            <Agenda1CompletedMark context={context} entry={entry} />
          ) : undefined
        }
        onOpen={onOpen ? () => onOpen(entry) : undefined}
        openLabel={labels.openEntry(entry.title)}
        title={entry.title}
      />
    )
  }

export const renderAgenda1CalendarChip =
  (context: Agenda1FieldContext) =>
  (entry: Agenda1Entry, placement: Agenda1RenderContext) => {
    const { formatters, labels, onOpen } = context
    const showsTime =
      !entry.allDay && placement.placement !== 'all-day' && placement.isStart
    const time = showsTime ? (
      <CalendarEventChipTime dateTime={entry.start}>
        {formatters.time(entry.start)}
      </CalendarEventChipTime>
    ) : null
    const title = <CalendarEventChipTitle>{entry.title}</CalendarEventChipTitle>

    return (
      <CalendarEventChip
        aria-label={labels.entryName(labels.kinds[entry.kind], entry.title)}
        completed={Boolean(entry.completed)}
        data-kind={entry.kind}
        display={placement.placement === 'time-grid' ? 'block' : 'chip'}
        tone={agenda1ChipTones[entry.kind]}
      >
        {placement.placement === 'month' ? (
          <>
            {time}
            {title}
          </>
        ) : (
          <>
            {title}
            {time}
          </>
        )}
        {onOpen ? (
          <CalendarEventChipOpenTrigger
            aria-label={labels.openEntry(entry.title)}
            onClick={() => onOpen(entry)}
          />
        ) : null}
      </CalendarEventChip>
    )
  }
