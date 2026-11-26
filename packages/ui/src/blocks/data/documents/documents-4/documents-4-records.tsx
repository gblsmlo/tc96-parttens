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
  type Documents4FieldContext,
  Documents4OwnerField,
  Documents4PinnedMark,
  Documents4TypeIcon,
  Documents4UpdatedField,
} from './documents-4-fields'
import {
  documents4FieldWidth,
  documents4LeadingWidth,
} from './documents-4-options'
import {
  Documents4RowActions,
  hasDocuments4RowActions,
} from './documents-4-row-actions'
import type { Documents4Labels, Documents4Record } from './types'

export const documents4CaptionOf = (
  item: Documents4Record,
  labels: Documents4Labels,
): string[] => [labels.types[item.type], ...(item.size ? [item.size] : [])]

export const documents4OpenTrigger =
  'max-w-full truncate text-start outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset'

export interface Documents4ListHeaderSelection {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Documents4ListHeader({
  context,
  selection,
}: Readonly<{
  context: Documents4FieldContext
  selection?: Documents4ListHeaderSelection
}>) {
  const { labels } = context
  return (
    <ListViewHeader data-slot="documents-4-list-header">
      <ListViewHeaderCell
        always
        className={cn(documents4LeadingWidth, '-me-0.5 ps-1')}
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
      <ListViewHeaderCell className={documents4FieldWidth.owner}>
        {labels.columns.owner}
      </ListViewHeaderCell>
      <ListViewHeaderCell always className={documents4FieldWidth.updated}>
        {labels.columns.updated}
      </ListViewHeaderCell>
      {hasDocuments4RowActions(context) ? (
        <ListViewHeaderCell always className="w-8">
          <span className="sr-only">{labels.columns.actions}</span>
        </ListViewHeaderCell>
      ) : null}
    </ListViewHeader>
  )
}

export const renderDocuments4ListRow =
  (context: Documents4FieldContext) => (item: Documents4Record) => {
    const { labels, onOpen, onSelectedChange, pinnedOrder, selectedIds } =
      context
    const selected = selectedIds.has(item.id)
    const pinnedIndex = pinnedOrder.get(item.id)
    const icon = <Documents4TypeIcon context={context} item={item} size="sm" />
    return (
      <ListRow
        className={cn(
          pinnedIndex !== undefined &&
            'sticky z-20 rounded-none bg-[color-mix(in_srgb,var(--background),var(--card)_40%)] hover:bg-[color-mix(in_srgb,var(--background),var(--muted)_50%)]',
          pinnedIndex !== undefined &&
            pinnedIndex === pinnedOrder.size - 1 &&
            'border-b',
          selected && pinnedIndex !== undefined && 'bg-muted hover:bg-muted',
        )}
        style={
          pinnedIndex === undefined
            ? undefined
            : { top: `calc(var(--spacing) * (10 + ${pinnedIndex} * 12.5))` }
        }
        data-pinned={item.pinned ? '' : undefined}
        data-slot="documents-4-row"
        interactive={Boolean(onOpen)}
        selected={selected}
      >
        <ListRowLeading className={cn(documents4LeadingWidth, '-me-0.5 ps-1')}>
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
            <Documents4PinnedMark context={context} item={item} />
          </ListRowHeader>
          <ListRowDescription className="text-xs tabular-nums">
            <DataCollectionCaption parts={documents4CaptionOf(item, labels)} />
          </ListRowDescription>
        </ListRowBody>
        <ListRowTrailing className="gap-3">
          <ListRowField className={documents4FieldWidth.owner}>
            <Documents4OwnerField context={context} item={item} />
          </ListRowField>
          <ListRowField always className={documents4FieldWidth.updated}>
            <Documents4UpdatedField context={context} item={item} />
          </ListRowField>
          {hasDocuments4RowActions(context) ? (
            <ListRowAction className="w-8 justify-end">
              <Documents4RowActions context={context} item={item} />
            </ListRowAction>
          ) : null}
        </ListRowTrailing>
      </ListRow>
    )
  }

export const renderDocuments4GalleryCard =
  (context: Documents4FieldContext) => (item: Documents4Record) => {
    const { labels, onOpen } = context
    return (
      <Card
        className="h-full min-h-52 overflow-hidden"
        data-slot="documents-4-card"
        render={<article aria-label={item.name} />}
      >
        <div
          className="flex aspect-video shrink-0 items-center justify-center overflow-hidden bg-muted"
          data-slot="documents-4-preview"
        >
          {item.previewUrl ? (
            <img
              alt=""
              className="size-full object-cover"
              loading="lazy"
              src={item.previewUrl}
            />
          ) : (
            <Documents4TypeIcon context={context} item={item} size="xl" />
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
                className={documents4OpenTrigger}
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
            <DataCollectionCaption parts={documents4CaptionOf(item, labels)} />
          </CardDescription>
          {hasDocuments4RowActions(context) ? (
            <CardAction className="relative z-10">
              <Documents4RowActions context={context} item={item} />
            </CardAction>
          ) : null}
        </CardHeader>
        <CardFooter className="mt-auto justify-between gap-3 px-4 pt-0 pb-4">
          <span className="min-w-0 truncate">
            <Documents4OwnerField context={context} item={item} />
          </span>
          <Documents4UpdatedField context={context} item={item} />
        </CardFooter>
      </Card>
    )
  }
