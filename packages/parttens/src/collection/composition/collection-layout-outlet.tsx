import type { RowData } from '@tanstack/react-table'
import { type ReactNode, useCallback, useMemo } from 'react'
import {
  CalendarView,
  type CalendarViewProps,
} from '../layouts/calendar/components/calendar-view'
import {
  DataGrid,
  type DataGridProps,
} from '../layouts/data-grid/components/data-grid'
import {
  DataTable,
  type DataTableProps,
} from '../layouts/data-table/data-table'
import {
  GalleryView,
  type GalleryViewProps,
} from '../layouts/gallery/components/gallery-view'
import {
  KanbanView,
  type KanbanViewProps,
} from '../layouts/kanban/components/kanban-view'
import type { KanbanCardMove, KanbanColumnData } from '../layouts/kanban/types'
import {
  ListView,
  type ListViewProps,
} from '../layouts/list/components/list-view'
import { projectCollection } from '../shared/lib/project-collection'
import { useCollectionPreferences } from '../store/collection-provider'
import type {
  CollectionDefinition,
  CollectionGroup,
  CollectionRecordChange,
} from '../types/collection'

export type CollectionCalendarViewProps<TRecord> = Omit<
  CalendarViewProps<TRecord>,
  'collection'
>

export type CollectionDataGridViewProps<TRecord extends RowData> =
  DataGridProps<TRecord>

export type CollectionDataTableViewProps<TRecord extends RowData> =
  DataTableProps<TRecord>

export type CollectionGalleryViewProps<TRecord> = Omit<
  GalleryViewProps<TRecord>,
  'collection' | 'renderRecord'
>

export interface CollectionKanbanCardMove<TRecord>
  extends KanbanCardMove<TRecord> {
  sourceGroup: CollectionGroup<TRecord>
  targetGroup: CollectionGroup<TRecord>
}

export interface CollectionKanbanViewProps<TRecord>
  extends Omit<
    KanbanViewProps<TRecord>,
    'columns' | 'getKey' | 'onMoveCard' | 'renderCard'
  > {
  onMoveCard?: (
    move: CollectionKanbanCardMove<TRecord>,
  ) => boolean | Promise<boolean>
}

export type CollectionListViewProps<TRecord> = Omit<
  ListViewProps<TRecord>,
  'collection' | 'grouping' | 'renderRecord'
>

export interface CollectionLayoutOutletProps<TRecord extends RowData> {
  collection: CollectionDefinition<TRecord>
  groups?: readonly CollectionGroup<TRecord>[]
  /** Obrigatória quando o layout é `calendar`: agenda, modo e fuso são do consumer. */
  calendar?: CollectionCalendarViewProps<TRecord>
  datagrid?: CollectionDataGridViewProps<TRecord>
  datatable?: CollectionDataTableViewProps<TRecord>
  gallery?: CollectionGalleryViewProps<TRecord>
  kanban?: CollectionKanbanViewProps<TRecord>
  list?: CollectionListViewProps<TRecord>
  onRecordChange?: (
    change: CollectionRecordChange<TRecord>,
  ) => boolean | Promise<boolean>
  renderGalleryRecord?: (record: TRecord) => ReactNode
  renderKanbanRecord?: (record: TRecord) => ReactNode
  renderListRecord?: (record: TRecord) => ReactNode
}

export function CollectionLayoutOutlet<TRecord extends RowData>({
  collection,
  groups,
  calendar,
  datagrid,
  datatable,
  gallery,
  kanban,
  list,
  onRecordChange,
  renderGalleryRecord,
  renderKanbanRecord,
  renderListRecord,
}: CollectionLayoutOutletProps<TRecord>) {
  const { preferences } = useCollectionPreferences()
  const canRenderKanban = Boolean(renderKanbanRecord)
  const kanbanGroups = useMemo(
    () =>
      preferences.layout === 'kanban' && canRenderKanban
        ? (groups ?? projectCollection(collection, preferences.groupBy))
        : [],
    [
      canRenderKanban,
      collection,
      groups,
      preferences.groupBy,
      preferences.layout,
    ],
  )
  const columns = useMemo<KanbanColumnData<TRecord>[]>(
    () =>
      kanbanGroups.map((group) => ({
        cards: [...group.records],
        count: group.count,
        id: group.id,
        title: group.label,
      })),
    [kanbanGroups],
  )
  const { onMoveCard: onCollectionMoveCard, ...kanbanProps } = kanban ?? {}
  const canWriteGroup = Boolean(
    onRecordChange &&
      collection.groupings.find(({ id }) => id === preferences.groupBy)
        ?.setGroupId,
  )
  const onMoveCard = useCallback(
    (move: KanbanCardMove<TRecord>) => {
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

      if (!onRecordChange || !setGroupId || sourceGroup.id === targetGroup.id)
        return false

      return onRecordChange({
        grouping: targetGroup.grouping,
        record: setGroupId(move.card, targetGroup.value),
        previousRecord: move.card,
        reason: 'grouping',
      })
    },
    [collection.groupings, kanbanGroups, onCollectionMoveCard, onRecordChange],
  )

  if (preferences.layout === 'datagrid') {
    if (!datagrid) {
      throw new Error(
        'CollectionLayoutOutlet: o layout "datagrid" exige a prop `datagrid`.',
      )
    }

    return <DataGrid {...datagrid} />
  }

  if (preferences.layout === 'datatable') {
    if (!datatable) {
      throw new Error(
        'CollectionLayoutOutlet: o layout "datatable" exige a prop `datatable`.',
      )
    }

    return <DataTable {...datatable} />
  }

  if (preferences.layout === 'calendar') {
    if (!calendar) {
      throw new Error(
        'CollectionLayoutOutlet: o layout "calendar" exige a prop `calendar`.',
      )
    }

    return <CalendarView collection={collection} {...calendar} />
  }

  if (preferences.layout === 'gallery') {
    if (!renderGalleryRecord) {
      throw new Error(
        'CollectionLayoutOutlet: o layout "gallery" exige a prop `renderGalleryRecord`.',
      )
    }

    return (
      <GalleryView
        collection={collection}
        renderRecord={renderGalleryRecord}
        {...gallery}
      />
    )
  }

  if (preferences.layout === 'list') {
    if (!renderListRecord) {
      throw new Error(
        'CollectionLayoutOutlet: o layout "list" exige a prop `renderListRecord`.',
      )
    }

    return (
      <ListView
        collection={collection}
        grouping={preferences.groupBy}
        renderRecord={renderListRecord}
        {...list}
        groups={groups ?? list?.groups}
      />
    )
  }

  if (!renderKanbanRecord) {
    throw new Error(
      'CollectionLayoutOutlet: o layout "kanban" exige a prop `renderKanbanRecord`.',
    )
  }

  return (
    <KanbanView
      columns={columns}
      getCardLabel={collection.getLabel}
      getKey={collection.getKey}
      renderCard={renderKanbanRecord}
      {...kanbanProps}
      {...(onCollectionMoveCard || canWriteGroup ? { onMoveCard } : {})}
    />
  )
}
