'use client'

import type { RowData } from '@tanstack/react-table'
import {
  type CollectionCalendarViewProps,
  type CollectionKanbanViewProps,
  CollectionLayoutOutlet,
  type CollectionLayoutOutletProps,
} from '@tc96/ui/patterns/collection/composition/collection-layout-outlet'
import { CollectionProvider } from '@tc96/ui/patterns/collection/store/collection-provider'
import type { DataTableSelectionActionsProp } from '@tc96/ui/patterns/data-table/data-table'
import type { DataTableTable } from '@tc96/ui/patterns/data-table/data-table-features'
import { type ReactNode, useMemo } from 'react'
import type { DataCollectionMode } from './types'
import { useControllable } from './use-controllable'

const layoutOf = {
  calendar: 'calendar',
  kanban: 'kanban',
  list: 'list',
  table: 'datatable',
} as const satisfies Record<DataCollectionMode, string>

export type DataCollectionDefinition<TRecord extends RowData> =
  CollectionLayoutOutletProps<TRecord>['collection']

export interface DataCollectionProps<TRecord extends RowData> {
  calendar?: CollectionCalendarViewProps<TRecord>
  collapsedGroupIds?: readonly string[]
  collection: DataCollectionDefinition<TRecord>
  emptyGroupMessage?: string
  emptyMessage: string
  footer?: ReactNode
  getGroupToggleLabel?: (group: string, collapsed: boolean) => string
  getRowCanOpen?: (record: TRecord) => boolean
  getRowOpenLabel?: (record: TRecord) => string
  groupBy?: string | null
  kanban?: CollectionKanbanViewProps<TRecord>
  label: string
  loadingMore?: boolean
  mode: DataCollectionMode
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  onEndReached?: () => void
  onGroupByChange?: (groupBy: string | null) => void
  onOpen?: (record: TRecord) => void
  renderKanbanRecord?: (record: TRecord) => ReactNode
  renderListRecord?: (record: TRecord) => ReactNode
  selectionActions?: DataTableSelectionActionsProp<TRecord>
  table: DataTableTable<TRecord>
}

export function DataCollection<TRecord extends RowData>({
  calendar,
  collapsedGroupIds,
  collection,
  emptyGroupMessage,
  emptyMessage,
  footer,
  getGroupToggleLabel,
  getRowCanOpen,
  getRowOpenLabel,
  groupBy: groupByProp,
  kanban,
  label,
  loadingMore,
  mode,
  onCollapsedGroupIdsChange,
  onEndReached,
  onGroupByChange,
  onOpen,
  renderKanbanRecord,
  renderListRecord,
  selectionActions,
  table,
}: Readonly<DataCollectionProps<TRecord>>) {
  const [groupBy, setGroupBy] = useControllable<string | null>(
    groupByProp,
    null,
    onGroupByChange,
  )
  const activeGroupBy = useMemo(() => {
    if (mode === 'calendar') return null
    const known = collection.groupings.some(({ id }) => id === groupBy)
    if (mode === 'kanban')
      return known ? groupBy : (collection.groupings[0]?.id ?? null)
    return known ? groupBy : null
  }, [collection.groupings, groupBy, mode])
  const preferences = useMemo(
    () => ({ groupBy: activeGroupBy, layout: layoutOf[mode] }),
    [activeGroupBy, mode],
  )

  const tableGrouping = useMemo(() => {
    const dimension =
      mode === 'table'
        ? collection.groupings.find(({ id }) => id === activeGroupBy)
        : undefined
    if (!dimension) return undefined
    const labelOf = new Map(
      dimension.options.map((option) => [option.id, option.label]),
    )
    const idOf = new Map(
      dimension.options.map((option) => [
        option.label,
        `${dimension.id}:${option.id}`,
      ]),
    )
    if (dimension.unassignedLabel)
      idOf.set(dimension.unassignedLabel, `${dimension.id}:unassigned`)
    const prefix = `${dimension.id}:`
    const labelOfId = new Map([...idOf].map(([group, id]) => [id, group]))
    return {
      getRowGroup: (record: TRecord) => {
        const groupId = dimension.getGroupId(record)
        if (groupId === null) return dimension.unassignedLabel ?? null
        return labelOf.get(groupId) ?? groupId
      },
      toGroups: (ids: readonly string[]) =>
        ids.map(
          (id) =>
            labelOfId.get(id) ??
            (id.startsWith(prefix) ? id.slice(prefix.length) : id),
        ),
      toIds: (groups: readonly string[]) =>
        groups.map((group) => idOf.get(group) ?? `${prefix}${group}`),
    }
  }, [activeGroupBy, collection.groupings, mode])

  return (
    <div
      className="grid min-w-0 gap-3"
      data-group-by={activeGroupBy ?? undefined}
      data-mode={mode}
      data-slot="data-collection"
    >
      <CollectionProvider
        collection={collection}
        onPreferencesChange={(next, { reason }) => {
          if (reason === 'grouping') setGroupBy(next.groupBy)
        }}
        preferences={preferences}
      >
        <CollectionLayoutOutlet
          calendar={calendar}
          collection={collection}
          datatable={{
            'aria-label': label,
            collapsedGroupIds:
              tableGrouping && collapsedGroupIds
                ? tableGrouping.toGroups(collapsedGroupIds)
                : undefined,
            emptyMessage,
            getGroupToggleLabel,
            getRowCanOpen: getRowCanOpen
              ? (row) => getRowCanOpen(row.original)
              : undefined,
            getRowGroup: tableGrouping?.getRowGroup,
            getRowOpenLabel: getRowOpenLabel
              ? (row) => getRowOpenLabel(row.original)
              : undefined,
            loadingMore,
            onCollapsedGroupIdsChange:
              tableGrouping && onCollapsedGroupIdsChange
                ? (groups) =>
                    onCollapsedGroupIdsChange(tableGrouping.toIds(groups))
                : undefined,
            onEndReached,
            onRowOpen: onOpen ? (row) => onOpen(row.original) : undefined,
            selectionActions,
            table,
          }}
          kanban={kanban}
          list={{
            collapsedGroupIds,
            emptyGroupLabel: emptyGroupMessage ?? emptyMessage,
            emptyMessage,
            getGroupToggleLabel,
            onCollapsedGroupIdsChange,
          }}
          renderKanbanRecord={renderKanbanRecord}
          renderListRecord={renderListRecord}
        />
        {footer}
      </CollectionProvider>
    </div>
  )
}
