import { DataCollectionListRow } from '../../shared/collection/data-collection-record-parts'
import {
  canUnarchiveLegal5,
  hasLegal5KindMark,
  Legal5DeadlineField,
  type Legal5FieldContext,
  Legal5KindMark,
  Legal5OwnerField,
  Legal5PhaseField,
  Legal5TagsField,
  Legal5UnarchiveButton,
} from './legal-5-fields'
import type { Legal5Record } from './types'

export const renderLegal5ListRow =
  (context: Legal5FieldContext) => (item: Legal5Record) => {
    const { onOpen } = context
    return (
      <DataCollectionListRow
        actions={
          canUnarchiveLegal5(context, item) ? (
            <Legal5UnarchiveButton context={context} item={item} />
          ) : undefined
        }
        caption={[...(item.number ? [item.number] : []), ...item.clients]}
        fields={
          <>
            <Legal5PhaseField context={context} item={item} readOnly />
            <Legal5DeadlineField item={item} />
            <Legal5TagsField context={context} item={item} />
            <Legal5OwnerField avatarOnly context={context} item={item} />
          </>
        }
        mark={
          hasLegal5KindMark(item) ? (
            <Legal5KindMark context={context} item={item} />
          ) : undefined
        }
        onOpen={onOpen ? () => onOpen(item.id) : undefined}
        title={item.title}
      />
    )
  }
