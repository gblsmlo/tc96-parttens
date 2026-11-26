import {
  DataCollectionKanbanCard,
  type DataCollectionKanbanField,
} from '../../shared/collection/data-collection-record-parts'
import {
  Crm3DeadlineField,
  type Crm3FieldContext,
  Crm3NextActionField,
  Crm3OwnerField,
  Crm3TagsField,
  Crm3ValueField,
} from './crm-3-fields'
import type { Crm3Lead } from './types'

export const renderCrm3KanbanCard =
  (context: Crm3FieldContext) => (item: Crm3Lead) => {
    const { labels, onOpen } = context
    const fields: DataCollectionKanbanField[] = [
      {
        id: 'next-action',
        label: labels.columns.nextAction,
        value: <Crm3NextActionField context={context} item={item} />,
      },
    ]
    if (item.nextActionAt)
      fields.push({
        id: 'next-action-at',
        label: labels.columns.nextActionAt,
        value: <Crm3DeadlineField context={context} item={item} />,
      })
    if (item.valueCents !== null)
      fields.push({
        id: 'value',
        label: labels.columns.value,
        value: <Crm3ValueField context={context} item={item} />,
      })
    if (item.tagIds.length > 0)
      fields.push({
        id: 'tags',
        label: labels.columns.tags,
        value: <Crm3TagsField context={context} item={item} />,
      })

    return (
      <DataCollectionKanbanCard
        caption={item.contact ? [item.contact] : []}
        fields={fields}
        footer={
          item.ownerId ? (
            <Crm3OwnerField
              avatarOnly
              context={{ ...context, onOwnerChange: undefined }}
              item={item}
              variant="plain"
            />
          ) : undefined
        }
        onOpen={onOpen ? () => onOpen(item.id) : undefined}
        openLabel={labels.openRecord(item.title)}
        title={item.title}
      />
    )
  }
