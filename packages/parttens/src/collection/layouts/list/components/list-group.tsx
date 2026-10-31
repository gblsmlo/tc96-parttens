import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@tc96/ui/collapsible'
import { Empty, EmptyDescription } from '@tc96/ui/empty'
import { Separator } from '@tc96/ui/separator'
import { ChevronDownIcon, ChevronRightIcon, PlusIcon } from 'lucide-react'
import { Fragment, type ReactNode, useId } from 'react'
import type { CollectionGroup } from '../../../types/collection'
import { ListItemSkeleton } from './list-item-skeleton'
import { ListViewItem } from './list-view-item'

export interface ListGroupActions {
  addLabel?: string
  onAddRecord?: (groupId: string) => void
}

export interface ListGroupProps<TRecord> {
  actions?: ListGroupActions
  collapsed: boolean
  separated?: boolean
  emptyLabel: ReactNode
  group: CollectionGroup<TRecord>
  onCollapsedChange: (collapsed: boolean) => void
  renderRecord: (record: TRecord) => ReactNode
  renderGroupTitle?: (group: CollectionGroup<TRecord>) => ReactNode
  getKey: (record: TRecord) => string | number
  loading?: boolean
  loadingRecordCount?: number
  loadingRecordLabel?: string
}

export function ListGroup<TRecord>({
  actions,
  collapsed,
  separated = false,
  emptyLabel,
  getKey,
  group,
  loading = false,
  loadingRecordCount = 1,
  loadingRecordLabel,
  onCollapsedChange,
  renderGroupTitle,
  renderRecord,
}: ListGroupProps<TRecord>) {
  const instanceId = useId()
  const titleId = `list-group-title-${instanceId}`
  const groupLabel = typeof group.label === 'string' ? group.label : group.id
  const loadingItems = Array.from(
    { length: loadingRecordCount },
    (_, position) => ({
      id: `${group.id}-loading-${position + 1}`,
    }),
  )

  return (
    <Collapsible
      onOpenChange={(open) => onCollapsedChange(!open)}
      open={!collapsed}
    >
      <section
        aria-labelledby={titleId}
        className="flex flex-col gap-0.5"
        data-slot="list-group"
      >
        <div
          className="flex min-h-9 items-center justify-between rounded-lg bg-card/90 px-1"
          data-slot="list-group-header"
        >
          <div className="flex min-w-0 items-center gap-1">
            <CollapsibleTrigger
              render={
                <Button
                  aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${groupLabel}`}
                  size="icon-sm"
                  variant="ghost"
                />
              }
            >
              {collapsed ? (
                <ChevronRightIcon aria-hidden="true" />
              ) : (
                <ChevronDownIcon aria-hidden="true" />
              )}
            </CollapsibleTrigger>
            {renderGroupTitle ? null : (
              <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
                {group.icon}
              </span>
            )}
            <h2 className="truncate font-medium text-sm" id={titleId}>
              {renderGroupTitle?.(group) ?? group.label}
            </h2>
            <Badge
              className="size-5 min-w-5 shrink-0 rounded-full p-0 text-xs tabular-nums sm:size-5 sm:min-w-5"
              data-slot="list-group-count"
              variant="secondary"
            >
              {group.count}
            </Badge>
          </div>
          {!loading && actions?.onAddRecord ? (
            <Button
              aria-label={actions.addLabel ?? `Add item to ${groupLabel}`}
              onClick={() => actions.onAddRecord?.(group.id)}
              size="icon-sm"
              variant="ghost"
            >
              <PlusIcon aria-hidden="true" />
            </Button>
          ) : null}
        </div>
        <CollapsiblePanel>
          <div className="flex flex-col" data-slot="list-group-items">
            {loading ? (
              loadingItems.map((record) => (
                <ListItemSkeleton
                  key={record.id}
                  {...(loadingRecordLabel ? { label: loadingRecordLabel } : {})}
                />
              ))
            ) : group.records.length ? (
              group.records.map((record, position) => (
                <Fragment key={getKey(record)}>
                  {separated && position > 0 ? (
                    <Separator className="bg-border/40" />
                  ) : null}
                  <ListViewItem record={record} renderRecord={renderRecord} />
                </Fragment>
              ))
            ) : (
              <Empty>
                <EmptyDescription>{emptyLabel}</EmptyDescription>
              </Empty>
            )}
          </div>
        </CollapsiblePanel>
      </section>
    </Collapsible>
  )
}
