import { FileTextIcon } from '@phosphor-icons/react'
import { DataCollectionListRow } from '../../shared/collection/data-collection-record-parts'
import {
  Legal9AmountField,
  Legal9BillingModelField,
  type Legal9FieldContext,
  Legal9OwnerField,
  Legal9StatusField,
} from './legal-9-fields'
import type { Legal9Record } from './types'

export const renderLegal9ListRow =
  (context: Legal9FieldContext) => (item: Legal9Record) => {
    const { labels, onOpen } = context
    return (
      <DataCollectionListRow
        caption={[item.holder ?? labels.noHolder]}
        fields={
          <>
            <Legal9StatusField context={context} item={item} />
            <Legal9BillingModelField context={context} item={item} />
            <Legal9AmountField context={context} item={item} />
            <Legal9OwnerField avatarOnly context={context} item={item} />
          </>
        }
        icon={<FileTextIcon aria-hidden="true" />}
        onOpen={onOpen ? () => onOpen(item.id) : undefined}
        openLabel={labels.openRecord(item.title)}
        title={item.title}
      />
    )
  }
