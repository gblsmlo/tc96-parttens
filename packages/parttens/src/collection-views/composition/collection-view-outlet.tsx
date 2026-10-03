import type { RowData } from '@tanstack/react-table'
import { type ReactNode, useMemo } from 'react'
import { projectCollection } from '../shared/lib/project-collection'
import { useCollectionPreferences } from '../store/collection-provider'
import type { CollectionDefinition, CollectionGroup } from '../types/collection'
import {
  CalendarView,
  type CalendarViewProps,
} from '../views/calendar/components/calendar-view'
import { DataGrid, type DataGridProps } from '../views/data-grid/data-grid'
import { DataTable, type DataTableProps } from '../views/data-table/data-table'
import {
  KanbanView,
  type KanbanViewProps,
} from '../views/kanban/components/kanban-view'
import type { KanbanColumnData } from '../views/kanban/types'
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

export type CollectionKanbanViewProps<TItem> = Omit<
  KanbanViewProps<TItem>,
  'columns' | 'getKey' | 'renderCard'
>

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
  kanban?: CollectionKanbanViewProps<TItem>
  list?: CollectionListViewProps<TItem>
  renderKanbanItem: (item: TItem) => ReactNode
  renderListItem: (item: TItem) => ReactNode
}

export function CollectionViewOutlet<TItem extends RowData>({
  collection,
  groups,
  calendar,
  datagrid,
  datatable,
  kanban,
  list,
  renderKanbanItem,
  renderListItem,
}: CollectionViewOutletProps<TItem>) {
  const { preferences } = useCollectionPreferences()
  const columns = useMemo<KanbanColumnData<TItem>[]>(() => {
    if (preferences.view !== 'kanban') return []

    return (groups ?? projectCollection(collection, preferences.groupBy)).map(
      (group) => ({
        cards: [...group.items],
        count: group.count,
        id: group.id,
        title: group.label,
      }),
    )
  }, [collection, groups, preferences.groupBy, preferences.view])

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

  if (preferences.view === 'list') {
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

  return (
    <KanbanView
      columns={columns}
      getCardLabel={collection.getLabel}
      getKey={collection.getKey}
      renderCard={renderKanbanItem}
      {...kanban}
    />
  )
}
