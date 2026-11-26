import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tc96/ui/card'
import {
  DataCollectionCaption,
  DataCollectionListRow,
} from '../../shared/collection/data-collection-record-parts'
import {
  Documents3AccessField,
  Documents3CreatedAtField,
  Documents3CreatedByField,
  type Documents3FieldContext,
  Documents3PinnedBadge,
  Documents3PinnedMark,
  Documents3TypeIcon,
  Documents3UploadState,
  documents3Opens,
  documents3UploadOf,
} from './documents-3-fields'
import {
  Documents3RowActions,
  documents3RowActionsOf,
} from './documents-3-row-actions'
import type { Documents3Record } from './types'

const detailOf = (item: Documents3Record): string | null | undefined => {
  if (item.kind === 'file') return item.size
  if (item.kind === 'link') return item.site ?? item.url
  return item.excerpt
}

export const renderDocuments3ListRow =
  (context: Documents3FieldContext) => (item: Documents3Record) => {
    const { labels, onOpen } = context
    const detail = detailOf(item)
    const hasUpload = documents3UploadOf(item) !== null
    return (
      <DataCollectionListRow
        actions={
          documents3RowActionsOf(context, item).length > 0 ? (
            <Documents3RowActions context={context} item={item} />
          ) : undefined
        }
        caption={[
          ...(detail ? [detail] : []),
          ...(item.linkedTo ? [item.linkedTo] : []),
        ]}
        fields={
          hasUpload ? (
            <Documents3UploadState context={context} item={item} />
          ) : (
            <>
              <Documents3AccessField context={context} item={item} />
              <Documents3CreatedAtField context={context} item={item} />
              <Documents3CreatedByField
                avatarOnly
                context={context}
                item={item}
              />
            </>
          )
        }
        icon={<Documents3TypeIcon context={context} item={item} />}
        mark={
          item.pinned ? (
            <Documents3PinnedMark context={context} item={item} />
          ) : undefined
        }
        onOpen={
          onOpen && documents3Opens(item) ? () => onOpen(item.id) : undefined
        }
        openLabel={labels.openRecord(item.name)}
        title={item.name}
      />
    )
  }

export const renderDocuments3GalleryCard =
  (context: Documents3FieldContext) => (item: Documents3Record) => {
    const { labels, onOpen } = context
    const detail = detailOf(item)
    const hasUpload = documents3UploadOf(item) !== null
    return (
      <Card
        className="h-full min-h-52 overflow-hidden"
        data-slot="documents-3-card"
        render={<article aria-label={item.name} />}
      >
        <div
          className="relative flex aspect-video shrink-0 items-center justify-center bg-muted"
          data-slot="documents-3-preview"
        >
          <Documents3TypeIcon context={context} item={item} size="xl" />
          <Documents3PinnedBadge context={context} item={item} />
        </div>
        <CardHeader className="gap-1 p-4">
          <CardTitle
            className="flex min-w-0 items-center gap-1 text-sm leading-5"
            render={(props) => <h3 {...props} />}
          >
            {onOpen && documents3Opens(item) ? (
              <button
                aria-label={labels.openRecord(item.name)}
                className="min-w-0 truncate text-start outline-none after:absolute after:inset-0 focus-visible:underline"
                onClick={() => onOpen(item.id)}
                type="button"
              >
                {item.name}
              </button>
            ) : (
              <span className="min-w-0 truncate">{item.name}</span>
            )}
          </CardTitle>
          <CardDescription className="truncate text-xs tabular-nums">
            <DataCollectionCaption
              parts={[
                ...(detail ? [detail] : []),
                ...(item.linkedTo ? [item.linkedTo] : []),
              ]}
            />
          </CardDescription>
          {documents3RowActionsOf(context, item).length > 0 ? (
            <CardAction className="relative z-10">
              <Documents3RowActions context={context} item={item} />
            </CardAction>
          ) : null}
        </CardHeader>
        <CardFooter className="mt-auto justify-between gap-3 px-4 pt-0 pb-4">
          {hasUpload ? (
            <Documents3UploadState context={context} item={item} />
          ) : (
            <>
              <Documents3CreatedByField context={context} item={item} />
              <Documents3CreatedAtField context={context} item={item} />
            </>
          )}
        </CardFooter>
      </Card>
    )
  }
