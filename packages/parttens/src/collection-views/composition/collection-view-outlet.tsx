import type { RowData } from '@tanstack/react-table'
import { type ReactNode, useCallback, useMemo } from 'react'
import { projectCollection } from '../shared/lib/project-collection'
import { useCollectionPreferences } from '../store/collection-provider'
import type {
  CollectionDefinition,
  CollectionGroup,
  CollectionItemChange,
} from '../types/collection'
import {
  CalendarView,
  type CalendarViewProps,
} from '../views/calendar/components/calendar-view'
import {
  DataGrid,
  type DataGridProps,
} from '../views/data-grid/components/data-grid'
import { DataTable, type DataTableProps } from '../views/data-table/data-table'
import {
  GalleryView,
  type GalleryViewProps,
} from '../views/gallery/components/gallery-view'
import {
  KanbanView,
  type KanbanViewProps,
} from '../views/kanban/components/kanban-view'
import type { KanbanCardMove, KanbanColumnData } from '../views/kanban/types'
import {
  ListView,
  type ListViewProps,
} from '../views/list/components/list-view'

export type CollectionCalendarViewProps<TItem> = Omit<
  CalendarViewProps<TItem>,
  'collection'
>

export type CollectionDataGridViewProps<TItem extends RowData> =
  DataGridProps<TItem>

export type CollectionDataTableViewProps<TItem extends RowData> =
  DataTableProps<TItem>

export type CollectionGalleryViewProps<TItem> = Omit<
  GalleryViewProps<TItem>,
  'collection' | 'renderItem'
>

export interface CollectionKanbanCardMove<TItem> extends KanbanCardMove<TItem> {
  sourceGroup: CollectionGroup<TItem>
  targetGroup: CollectionGroup<TItem>
}

export interface CollectionKanbanViewProps<TItem>
  extends Omit<
    KanbanViewProps<TItem>,
    'columns' | 'getKey' | 'onMoveCard' | 'renderCard'
  > {
  onMoveCard?: (
    move: CollectionKanbanCardMove<TItem>,
  ) => boolean | Promise<boolean>
}

export type CollectionListViewProps<TItem> = Omit<
  ListViewProps<TItem>,
  'collection' | 'grouping' | 'renderItem'
>

export interface CollectionViewOutletProps<TItem extends RowData> {
  collection: CollectionDefinition<TItem>
  groups?: readonly CollectionGroup<TItem>[]
  /** Obrigatória quando a view é `calendar`: agenda, modo e fuso são do consumer. */
  calendar?: CollectionCalendarViewProps<TItem>
  datagrid?: CollectionDataGridViewProps<TItem>
  datatable?: CollectionDataTableViewProps<TItem>
  gallery?: CollectionGalleryViewProps<TItem>
  kanban?: CollectionKanbanViewProps<TItem>
  list?: CollectionListViewProps<TItem>
  onItemChange?: (
    change: CollectionItemChange<TItem>,
  ) => boolean | Promise<boolean>
  renderGalleryItem?: (item: TItem) => ReactNode
  renderKanbanItem?: (item: TItem) => ReactNode
  renderListItem?: (item: TItem) => ReactNode
}

export function CollectionViewOutlet<TItem extends RowData>({
  collection,
  groups,
  calendar,
  datagrid,
  datatable,
  gallery,
  kanban,
  list,
  onItemChange,
  renderGalleryItem,
  renderKanbanItem,
  renderListItem,
}: CollectionViewOutletProps<TItem>) {
  const { preferences } = useCollectionPreferences()
  const canRenderKanban = Boolean(renderKanbanItem)
  const kanbanGroups = useMemo(
    () =>
      preferences.view === 'kanban' && canRenderKanban
        ? (groups ?? projectCollection(collection, preferences.groupBy))
        : [],
    [
      canRenderKanban,
      collection,
      groups,
      preferences.groupBy,
      preferences.view,
    ],
  )
  const columns = useMemo<KanbanColumnData<TItem>[]>(
    () =>
      kanbanGroups.map((group) => ({
        cards: [...group.items],
        count: group.count,
        id: group.id,
        title: group.label,
      })),
    [kanbanGroups],
  )
  const { onMoveCard: onCollectionMoveCard, ...kanbanProps } = kanban ?? {}
  const canWriteGroup = Boolean(
    onItemChange &&
      collection.groupings.find(({ id }) => id === preferences.groupBy)
        ?.setGroupId,
  )
  const onMoveCard = useCallback(
    (move: KanbanCardMove<TItem>) => {
      const sourceGroup = kanbanGroups.find(
        (group) => group.id === move.sourceColumnId,
      )
      const targetGroup = kanbanGroups.find(
        (group) => group.id === move.targetColumnId,
      )

      if (!sourceGroup || !targetGroup) return false
      if (onCollectionMoveCard)
        return onCollectionMoveCard({ ...move, sourceGroup, targetGroup })

      const setGroupId = collection.groupings.find(
        ({ id }) => id === targetGroup.grouping,
      )?.setGroupId

      if (!onItemChange || !setGroupId || sourceGroup.id === targetGroup.id)
        return false

      return onItemChange({
        grouping: targetGroup.grouping,
        item: setGroupId(move.card, targetGroup.value),
        previousItem: move.card,
        reason: 'grouping',
      })
    },
    [collection.groupings, kanbanGroups, onCollectionMoveCard, onItemChange],
  )

  if (preferences.view === 'datagrid') {
    if (!datagrid) {
      throw new Error(
        'CollectionViewOutlet: a view "datagrid" exige a prop `datagrid`.',
      )
    }

    return <DataGrid {...datagrid} />
  }

  if (preferences.view === 'datatable') {
    if (!datatable) {
      throw new Error(
        'CollectionViewOutlet: a view "datatable" exige a prop `datatable`.',
      )
    }

    return <DataTable {...datatable} />
  }

  if (preferences.view === 'calendar') {
    if (!calendar) {
      throw new Error(
        'CollectionViewOutlet: a view "calendar" exige a prop `calendar`.',
      )
    }

    return <CalendarView collection={collection} {...calendar} />
  }

  if (preferences.view === 'gallery') {
    if (!renderGalleryItem) {
      throw new Error(
        'CollectionViewOutlet: a view "gallery" exige a prop `renderGalleryItem`.',
      )
    }

    return (
      <GalleryView
        collection={collection}
        renderItem={renderGalleryItem}
        {...gallery}
      />
    )
  }

  if (preferences.view === 'list') {
    if (!renderListItem) {
      throw new Error(
        'CollectionViewOutlet: a view "list" exige a prop `renderListItem`.',
      )
    }

    return (
      <ListView
        collection={collection}
        grouping={preferences.groupBy}
        renderItem={renderListItem}
        {...list}
        groups={groups ?? list?.groups}
      />
    )
  }

  if (!renderKanbanItem) {
    throw new Error(
      'CollectionViewOutlet: a view "kanban" exige a prop `renderKanbanItem`.',
    )
  }

  return (
    <KanbanView
      columns={columns}
      getCardLabel={collection.getLabel}
      getKey={collection.getKey}
      renderCard={renderKanbanItem}
      {...kanbanProps}
      {...(onCollectionMoveCard || canWriteGroup ? { onMoveCard } : {})}
    />
  )
}
