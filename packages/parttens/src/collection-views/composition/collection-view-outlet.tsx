import { type ReactNode, useMemo } from 'react'

import { DataGrid, type DataGridProps } from '../views/data-grid/data-grid'
import {
  KanbanView,
  type KanbanViewProps,
} from '../views/kanban/components/kanban-view'
import type { KanbanColumnData } from '../views/kanban/types'
import {
  ListView,
  type ListViewProps,
} from '../views/list/components/list-view'
import { projectCollection } from '../shared/lib/project-collection'
import type { CollectionDefinition, CollectionGroup } from '../types/collection'
import { useCollectionPreferences } from '../store/collection-provider'

/**
 * O DataGrid recebe a tabela montada pelo consumer — colunas, ordenação e
 * seleção são do domínio, não da coleção. O outlet só decide quando ela entra.
 */
export type CollectionDataGridViewProps<TItem> = DataGridProps<TItem>

export type CollectionKanbanViewProps<TItem> = Omit<
  KanbanViewProps<TItem>,
  'columns' | 'getKey' | 'renderCard'
>

export type CollectionListViewProps<TItem> = Omit<
  ListViewProps<TItem>,
  'collection' | 'grouping' | 'renderItem'
>

export interface CollectionViewOutletProps<TItem> {
  collection: CollectionDefinition<TItem>
  groups?: readonly CollectionGroup<TItem>[]
  datagrid?: CollectionDataGridViewProps<TItem>
  kanban?: CollectionKanbanViewProps<TItem>
  list?: CollectionListViewProps<TItem>
  renderKanbanItem: (item: TItem) => ReactNode
  renderListItem: (item: TItem) => ReactNode
}

export function CollectionViewOutlet<TItem>({
  collection,
  groups,
  datagrid,
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
    // Oferecer o modo na toolbar sem passar a tabela é erro de programação, do
    // mesmo tipo que projetar grupos sem dimensão — não um estado a degradar.
    if (!datagrid) {
      throw new Error(
        'CollectionViewOutlet: a view "datagrid" exige a prop `datagrid`.',
      )
    }

    return <DataGrid {...datagrid} />
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
