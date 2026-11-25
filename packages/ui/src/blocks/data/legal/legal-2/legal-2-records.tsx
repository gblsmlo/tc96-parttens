import { DataCollectionListRow } from '../../shared/collection/data-collection-record-parts'
import {
  type Legal2FieldContext,
  Legal2OwnerField,
  Legal2QueueField,
  Legal2StatusField,
  Legal2TermField,
} from './legal-2-fields'
import type { Legal2Contract } from './types'

export const renderLegal2ListRow =
  (context: Legal2FieldContext) => (item: Legal2Contract) => {
    const { formatValue, labels, onOpen } = context
    return (
      <DataCollectionListRow
        caption={[
          item.code,
          labels.types[item.type],
          item.client,
          item.value === null ? labels.noValue : formatValue(item.value),
        ]}
        fields={
          <>
            <Legal2StatusField context={context} item={item} />
            <Legal2QueueField context={context} item={item} />
            <Legal2TermField context={context} item={item} />
            <Legal2OwnerField avatarOnly context={context} item={item} />
          </>
        }
        onOpen={onOpen ? () => onOpen(item.id) : undefined}
        title={item.title}
      />
    )
  }
