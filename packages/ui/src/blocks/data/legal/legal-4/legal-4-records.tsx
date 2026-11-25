import { LegalListRow } from '../shared/legal-record-parts'
import {
  type Legal4FieldContext,
  Legal4OwnerField,
  Legal4QueueField,
  Legal4SinceField,
  Legal4StatusField,
} from './legal-4-fields'
import type { Legal4Client } from './types'

export const renderLegal4ListRow =
  (context: Legal4FieldContext) => (item: Legal4Client) => {
    const { labels, onOpen } = context
    return (
      <LegalListRow
        caption={[
          labels.kinds[item.kind],
          item.contact?.name ?? labels.noContact,
          labels.activeCases(item.activeCases),
          labels.contractCount(item.contracts),
        ]}
        fields={
          <>
            <Legal4StatusField context={context} item={item} />
            <Legal4QueueField context={context} item={item} />
            <Legal4SinceField context={context} item={item} />
            <Legal4OwnerField avatarOnly context={context} item={item} />
          </>
        }
        onOpen={onOpen ? () => onOpen(item.id) : undefined}
        title={item.name}
      />
    )
  }
