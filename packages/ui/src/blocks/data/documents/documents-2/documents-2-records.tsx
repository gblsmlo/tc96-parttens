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
  type Documents2FieldContext,
  Documents2OwnerField,
  Documents2PinnedMark,
  Documents2TypeIcon,
  Documents2UpdatedField,
} from './documents-2-fields'
import {
  documents2FieldWidth,
  documents2LeadingWidth,
} from './documents-2-options'
import {
  Documents2RowActions,
  hasDocuments2RowActions,
} from './documents-2-row-actions'
import type { Documents2Labels, Documents2Record } from './types'

export const documents2CaptionOf = (
  item: Documents2Record,
  labels: Documents2Labels,
): string[] => [labels.types[item.type], ...(item.size ? [item.size] : [])]

export const documents2OpenTrigger =
  'max-w-full truncate text-start outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset'

export interface Documents2ListHeaderSelection {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Documents2ListHeader({
  context,
  selection,
}: Readonly<{
  context: Documents2FieldContext
  selection?: Documents2ListHeaderSelection
}>) {
  const { labels } = context
  return (
    <ListViewHeader data-slot="documents-2-list-header">
      <ListViewHeaderCell
        always
        className={cn(documents2LeadingWidth, '-me-0.5 ps-1')}
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
      <ListViewHeaderCell className={documents2FieldWidth.owner}>
        {labels.columns.owner}
      </ListViewHeaderCell>
      <ListViewHeaderCell always className={documents2FieldWidth.updated}>
        {labels.columns.updated}
      </ListViewHeaderCell>
      {hasDocuments2RowActions(context) ? (
        <ListViewHeaderCell always className="w-8">
          <span className="sr-only">{labels.columns.actions}</span>
        </ListViewHeaderCell>
      ) : null}
    </ListViewHeader>
  )
}

export const renderDocuments2ListRow =
  (context: Documents2FieldContext) => (item: Documents2Record) => {
    const { labels, onOpen, onSelectedChange, selectedIds } = context
    const selected = selectedIds.has(item.id)
    const icon = <Documents2TypeIcon context={context} item={item} size="sm" />
    return (
      <ListRow
        data-slot="documents-2-row"
        interactive={Boolean(onOpen)}
        selected={selected}
      >
        <ListRowLeading className={cn(documents2LeadingWidth, '-me-0.5 ps-1')}>
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
            <Documents2PinnedMark context={context} item={item} />
          </ListRowHeader>
          <ListRowDescription className="text-xs tabular-nums">
            <DataCollectionCaption parts={documents2CaptionOf(item, labels)} />
          </ListRowDescription>
        </ListRowBody>
        <ListRowTrailing className="gap-3">
          <ListRowField className={documents2FieldWidth.owner}>
            <Documents2OwnerField context={context} item={item} />
          </ListRowField>
          <ListRowField always className={documents2FieldWidth.updated}>
            <Documents2UpdatedField context={context} item={item} />
          </ListRowField>
          {hasDocuments2RowActions(context) ? (
            <ListRowAction className="w-8 justify-end">
              <Documents2RowActions context={context} item={item} />
            </ListRowAction>
          ) : null}
        </ListRowTrailing>
      </ListRow>
    )
  }

export const renderDocuments2GalleryCard =
  (context: Documents2FieldContext) => (item: Documents2Record) => {
    const { labels, onOpen } = context
    return (
      <Card
        className="h-full min-h-52 overflow-hidden"
        data-slot="documents-2-card"
        render={<article aria-label={item.name} />}
      >
        <div
          className="flex aspect-video shrink-0 items-center justify-center overflow-hidden bg-muted"
          data-slot="documents-2-preview"
        >
          {item.previewUrl ? (
            <img
              alt=""
              className="size-full object-cover"
              loading="lazy"
              src={item.previewUrl}
            />
          ) : (
            <Documents2TypeIcon context={context} item={item} size="xl" />
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
                className={documents2OpenTrigger}
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
            <DataCollectionCaption parts={documents2CaptionOf(item, labels)} />
          </CardDescription>
          {hasDocuments2RowActions(context) ? (
            <CardAction className="relative z-10">
              <Documents2RowActions context={context} item={item} />
            </CardAction>
          ) : null}
        </CardHeader>
        <CardFooter className="mt-auto justify-between gap-3 px-4 pt-0 pb-4">
          <span className="min-w-0 truncate">
            <Documents2OwnerField context={context} item={item} />
          </span>
          <Documents2UpdatedField context={context} item={item} />
        </CardFooter>
      </Card>
    )
  }
