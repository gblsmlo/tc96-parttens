import {
  DataCollectionKanbanCard,
  DataCollectionListRow,
} from '../../shared/collection/data-collection-record-parts'
import {
  Legal1DeadlineField,
  type Legal1FieldContext,
  Legal1NumberField,
  Legal1OwnerField,
  Legal1QueueField,
  Legal1StatusField,
} from './legal-1-fields'
import type { Legal1Case } from './types'

export const renderLegal1ListRow =
  (context: Legal1FieldContext) => (item: Legal1Case) => {
    const { labels, onOpen } = context
    return (
      <DataCollectionListRow
        caption={[item.client, labels.areas[item.area]]}
        fields={
          <>
            <Legal1NumberField context={context} item={item} />
            <Legal1StatusField context={context} item={item} />
            <Legal1QueueField context={context} item={item} />
            <Legal1DeadlineField context={context} item={item} />
            <Legal1OwnerField avatarOnly context={context} item={item} />
          </>
        }
        onOpen={onOpen ? () => onOpen(item.id) : undefined}
        title={item.title}
      />
    )
  }

export const renderLegal1KanbanCard =
  (context: Legal1FieldContext) => (item: Legal1Case) => {
    const { labels, onOpen } = context
    return (
      <DataCollectionKanbanCard
        caption={[item.client]}
        fields={[
          {
            id: 'number',
            interactive: true,
            label: labels.columns.number,
            value: (
              <Legal1NumberField
                context={context}
                item={item}
                variant="plain"
              />
            ),
          },
          {
            id: 'status',
            interactive: true,
            label: labels.columns.status,
            value: (
              <Legal1StatusField
                context={context}
                item={item}
                variant="plain"
              />
            ),
          },
          {
            id: 'queue',
            interactive: true,
            label: labels.columns.queue,
            value: (
              <Legal1QueueField context={context} item={item} variant="plain" />
            ),
          },
          {
            id: 'deadline',
            label: labels.columns.deadline,
            value: (
              <Legal1DeadlineField
                context={context}
                item={item}
                variant="plain"
              />
            ),
          },
          {
            id: 'owner',
            interactive: true,
            label: labels.columns.owner,
            value: (
              <Legal1OwnerField context={context} item={item} variant="plain" />
            ),
          },
        ]}
        onOpen={onOpen ? () => onOpen(item.id) : undefined}
        openLabel={labels.openCase(item.title)}
        title={item.title}
      />
    )
  }
