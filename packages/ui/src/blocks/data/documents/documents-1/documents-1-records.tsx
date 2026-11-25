import { DataCollectionListRow } from '../../shared/collection/data-collection-record-parts'
import {
  Documents1AccessField,
  Documents1CreatedAtField,
  Documents1CreatedByField,
  type Documents1FieldContext,
  Documents1PinnedMark,
  Documents1TypeIcon,
  Documents1UploadState,
  documents1Opens,
  documents1UploadOf,
} from './documents-1-fields'
import {
  Documents1RowActions,
  documents1RowActionsOf,
} from './documents-1-row-actions'
import type { Documents1Record } from './types'

const detailOf = (item: Documents1Record): string | null | undefined => {
  if (item.kind === 'file') return item.size
  if (item.kind === 'link') return item.site ?? item.url
  return item.excerpt
}

export const renderDocuments1ListRow =
  (context: Documents1FieldContext) => (item: Documents1Record) => {
    const { labels, onOpen } = context
    const detail = detailOf(item)
    const hasUpload = documents1UploadOf(item) !== null
    return (
      <DataCollectionListRow
        actions={
          documents1RowActionsOf(context, item).length > 0 ? (
            <Documents1RowActions context={context} item={item} />
          ) : undefined
        }
        caption={[
          ...(detail ? [detail] : []),
          ...(item.linkedTo ? [item.linkedTo] : []),
        ]}
        fields={
          hasUpload ? (
            <Documents1UploadState context={context} item={item} />
          ) : (
            <>
              <Documents1AccessField context={context} item={item} />
              <Documents1CreatedAtField context={context} item={item} />
              <Documents1CreatedByField
                avatarOnly
                context={context}
                item={item}
              />
            </>
          )
        }
        icon={<Documents1TypeIcon context={context} item={item} />}
        mark={
          item.pinned ? (
            <Documents1PinnedMark context={context} item={item} />
          ) : undefined
        }
        onOpen={
          onOpen && documents1Opens(item) ? () => onOpen(item.id) : undefined
        }
        openLabel={labels.openRecord(item.name)}
        title={item.name}
      />
    )
  }
