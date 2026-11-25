import { NewspaperIcon } from '@phosphor-icons/react'
import { IconFrame } from '@tc96/ui/icon-frame'
import { DataCollectionListRow } from '../../shared/collection/data-collection-record-parts'
import type { Legal7FieldContext } from './legal-7-fields'
import type { Legal7Publication } from './types'

export const renderLegal7ListRow =
  (context: Legal7FieldContext) => (item: Legal7Publication) => {
    const { formatDate, labels, onOpen } = context
    return (
      <DataCollectionListRow
        caption={[
          formatDate(item.availableOn),
          item.number ?? labels.noNumber,
          item.lawsuitTitle ?? labels.noLawsuit,
        ]}
        fields={
          <span
            className="text-muted-foreground text-sm"
            data-slot="legal-7-wait"
          >
            {item.wait}
          </span>
        }
        icon={
          <IconFrame shape="rounded" size="sm">
            <NewspaperIcon aria-hidden="true" />
          </IconFrame>
        }
        onOpen={onOpen ? () => onOpen(item.id) : undefined}
        openLabel={labels.openPublication(
          formatDate(item.availableOn),
          item.tribunal,
        )}
        title={labels.kindAndTribunal(item.kind, item.tribunal)}
      />
    )
  }
