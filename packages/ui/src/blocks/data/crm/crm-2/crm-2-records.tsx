import {
  DataCollectionKanbanCard,
  type DataCollectionKanbanField,
} from '../../shared/collection/data-collection-record-parts'
import {
  Crm2DeadlineField,
  type Crm2FieldContext,
  Crm2NextActionField,
  Crm2OwnerField,
  Crm2TagsField,
  Crm2ValueField,
} from './crm-2-fields'
import type { Crm2Lead } from './types'

export const renderCrm2KanbanCard =
  (context: Crm2FieldContext) => (item: Crm2Lead) => {
    const { labels, onOpen } = context
    const fields: DataCollectionKanbanField[] = [
      {
        id: 'next-action',
        label: labels.columns.nextAction,
        value: <Crm2NextActionField context={context} item={item} />,
      },
    ]
    if (item.nextActionAt)
      fields.push({
        id: 'next-action-at',
        label: labels.columns.nextActionAt,
        value: <Crm2DeadlineField context={context} item={item} />,
      })
    if (item.valueCents !== null)
      fields.push({
        id: 'value',
        label: labels.columns.value,
        value: <Crm2ValueField context={context} item={item} />,
      })
    if (item.tagIds.length > 0)
      fields.push({
        id: 'tags',
        label: labels.columns.tags,
        value: <Crm2TagsField context={context} item={item} />,
      })

    return (
      <DataCollectionKanbanCard
        caption={item.contact ? [item.contact] : []}
        fields={fields}
        footer={
          item.ownerId ? (
            <Crm2OwnerField
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
