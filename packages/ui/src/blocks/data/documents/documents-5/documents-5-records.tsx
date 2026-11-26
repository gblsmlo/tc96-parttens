import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tc96/ui/card'
import { Checkbox } from '@tc96/ui/checkbox'
import {
  ListRow,
  ListRowAction,
  ListRowBody,
  ListRowDescription,
  ListRowField,
  ListRowHeader,
  ListRowLeading,
  ListRowOpenTrigger,
  ListRowSelect,
  ListRowTitle,
  ListRowTrailing,
} from '@tc96/ui/patterns/list-view/components/list-row'
import {
  ListViewHeader,
  ListViewHeaderCell,
} from '@tc96/ui/patterns/list-view/components/list-view-header'
import { cn } from '@tc96/utils'
import { DataCollectionCaption } from '../../shared/collection/data-collection-record-parts'
import {
  type Documents5FieldContext,
  Documents5OwnerField,
  Documents5PinnedMark,
  Documents5TypeIcon,
  Documents5UpdatedField,
} from './documents-5-fields'
import {
  documents5FieldWidth,
  documents5LeadingWidth,
} from './documents-5-options'
import {
  Documents5RowActions,
  hasDocuments5RowActions,
} from './documents-5-row-actions'
import type { Documents5Labels, Documents5Record } from './types'

export const documents5CaptionOf = (
  item: Documents5Record,
  labels: Documents5Labels,
): string[] => [labels.types[item.type], ...(item.size ? [item.size] : [])]

export const documents5OpenTrigger =
  'max-w-full truncate text-start outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset'

export interface Documents5ListHeaderSelection {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Documents5ListHeader({
  context,
  selection,
}: Readonly<{
  context: Documents5FieldContext
  selection?: Documents5ListHeaderSelection
}>) {
  const { labels } = context
  return (
    <ListViewHeader data-slot="documents-5-list-header">
      <ListViewHeaderCell
        always
        className={cn(documents5LeadingWidth, '-me-0.5 ps-1')}
      >
        {selection ? (
          <Checkbox
            aria-label={labels.selectAll}
            checked={selection.checked}
            indeterminate={selection.indeterminate}
            onCheckedChange={(checked) =>
              selection.onCheckedChange(checked === true)
            }
          />
        ) : null}
      </ListViewHeaderCell>
      <ListViewHeaderCell always className="flex-1">
        {labels.columns.name}
      </ListViewHeaderCell>
      <ListViewHeaderCell className={documents5FieldWidth.owner}>
        {labels.columns.owner}
      </ListViewHeaderCell>
      <ListViewHeaderCell always className={documents5FieldWidth.updated}>
        {labels.columns.updated}
      </ListViewHeaderCell>
      {hasDocuments5RowActions(context) ? (
        <ListViewHeaderCell always className="w-8">
          <span className="sr-only">{labels.columns.actions}</span>
        </ListViewHeaderCell>
      ) : null}
    </ListViewHeader>
  )
}

export const renderDocuments5ListRow =
  (context: Documents5FieldContext) => (item: Documents5Record) => {
    const { labels, onOpen, onSelectedChange, selectedIds } = context
    const selected = selectedIds.has(item.id)
    const icon = <Documents5TypeIcon context={context} item={item} size="sm" />
    return (
      <ListRow
        data-slot="documents-5-row"
        interactive={Boolean(onOpen)}
        selected={selected}
      >
        <ListRowLeading className={cn(documents5LeadingWidth, '-me-0.5 ps-1')}>
          {onSelectedChange ? (
            <ListRowSelect
              aria-label={labels.selectRecord(item.name)}
              checked={selected}
              onCheckedChange={(checked) =>
                onSelectedChange(item.id, checked === true)
              }
            >
              {icon}
            </ListRowSelect>
          ) : (
            icon
          )}
        </ListRowLeading>
        <ListRowBody>
          <ListRowHeader>
            <ListRowTitle>
              {onOpen ? (
                <ListRowOpenTrigger
                  aria-label={labels.openRecord(item.name)}
                  onClick={() => onOpen(item.id)}
                >
                  {item.name}
                </ListRowOpenTrigger>
              ) : (
                item.name
              )}
            </ListRowTitle>
            <Documents5PinnedMark context={context} item={item} />
          </ListRowHeader>
          <ListRowDescription className="text-xs tabular-nums">
            <DataCollectionCaption parts={documents5CaptionOf(item, labels)} />
          </ListRowDescription>
        </ListRowBody>
        <ListRowTrailing className="gap-3">
          <ListRowField className={documents5FieldWidth.owner}>
            <Documents5OwnerField context={context} item={item} />
          </ListRowField>
          <ListRowField always className={documents5FieldWidth.updated}>
            <Documents5UpdatedField context={context} item={item} />
          </ListRowField>
          {hasDocuments5RowActions(context) ? (
            <ListRowAction className="w-8 justify-end">
              <Documents5RowActions context={context} item={item} />
            </ListRowAction>
          ) : null}
        </ListRowTrailing>
      </ListRow>
    )
  }

export const renderDocuments5GalleryCard =
  (context: Documents5FieldContext) => (item: Documents5Record) => {
    const { labels, onOpen } = context
    return (
      <Card
        className="h-full min-h-52 overflow-hidden"
        data-slot="documents-5-card"
        render={<article aria-label={item.name} />}
      >
        <div
          className="flex aspect-video shrink-0 items-center justify-center overflow-hidden bg-muted"
          data-slot="documents-5-preview"
        >
          {item.previewUrl ? (
            <img
              alt=""
              className="size-full object-cover"
              loading="lazy"
              src={item.previewUrl}
            />
          ) : (
            <Documents5TypeIcon context={context} item={item} size="xl" />
          )}
        </div>
        <CardHeader className="gap-1 p-4">
          <CardTitle
            className="truncate text-sm leading-5"
            render={(props) => <h3 {...props} />}
          >
            {onOpen ? (
              <button
                aria-label={labels.openRecord(item.name)}
                className={documents5OpenTrigger}
                onClick={() => onOpen(item.id)}
                type="button"
              >
                {item.name}
              </button>
            ) : (
              item.name
            )}
          </CardTitle>
          <CardDescription className="truncate text-xs tabular-nums">
            <DataCollectionCaption parts={documents5CaptionOf(item, labels)} />
          </CardDescription>
          {hasDocuments5RowActions(context) ? (
            <CardAction className="relative z-10">
              <Documents5RowActions context={context} item={item} />
            </CardAction>
          ) : null}
        </CardHeader>
        <CardFooter className="mt-auto justify-between gap-3 px-4 pt-0 pb-4">
          <span className="min-w-0 truncate">
            <Documents5OwnerField context={context} item={item} />
          </span>
          <Documents5UpdatedField context={context} item={item} />
        </CardFooter>
      </Card>
    )
  }
