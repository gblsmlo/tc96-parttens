'use client'

import { type ReactNode, useMemo, useState } from 'react'

import { projectCollection } from '../../../shared/lib/project-collection'
import type {
  CollectionDefinition,
  CollectionGroup,
  CollectionGroupingId,
} from '../../../types/collection'
import { ListGroup, type ListGroupActions } from './list-group'
import { ListItemHeadingLevelContext } from './list-item'
import { ListItemSkeleton } from './list-item-skeleton'
import { ListViewItem } from './list-view-item'

export interface ListViewProps<TItem> {
  collection: CollectionDefinition<TItem>
  groups?: readonly CollectionGroup<TItem>[]
  collapsedGroupIds?: readonly string[]
  /**
   * Grupo sem itens nasce colapsado. A escolha manual da pessoa prevalece, e um
   * grupo que ganha itens volta a abrir sozinho enquanto ninguém o tocou.
   *
   * Ignorado quando `collapsedGroupIds` é passado: ali o array é a autoridade.
   */
  collapseEmptyGroups?: boolean
  defaultCollapsedGroupIds?: readonly string[]
  emptyGroupLabel?: ReactNode | ((group: CollectionGroup<TItem>) => ReactNode)
  getGroupActions?: (
    group: CollectionGroup<TItem>,
  ) => ListGroupActions | undefined
  /** `null` lê a coleção como uma lista plana, sem cabeçalho nem colapso. */
  grouping: CollectionGroupingId | null
  loading?: boolean
  /** Esqueletos por grupo — ou da lista inteira, quando não há agrupamento. */
  loadingItemCount?: number
  loadingItemLabel?: string
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  renderGroupTitle?: (group: CollectionGroup<TItem>) => ReactNode
  renderItem: (item: TItem) => ReactNode
}

export function ListView<TItem>({
  collection,
  groups: preparedGroups,
  collapsedGroupIds: controlledCollapsedGroupIds,
  collapseEmptyGroups = false,
  defaultCollapsedGroupIds = [],
  emptyGroupLabel = 'No items in this group.',
  getGroupActions,
  grouping,
  loading = false,
  loadingItemCount = 1,
  loadingItemLabel,
  onCollapsedGroupIdsChange,
  renderGroupTitle,
  renderItem,
}: ListViewProps<TItem>) {
  const [choices, setChoices] = useState<Readonly<Record<string, boolean>>>(
    () =>
      Object.fromEntries(
        defaultCollapsedGroupIds.map((groupId) => [groupId, true]),
      ),
  )
  const groups = useMemo(
    () =>
      preparedGroups ??
      (grouping === null ? [] : projectCollection(collection, grouping)),
    [collection, grouping, preparedGroups],
  )

  const resolveCollapsed = (
    group: CollectionGroup<TItem>,
    choice: boolean | undefined,
  ) => choice ?? (collapseEmptyGroups && group.count === 0 && !loading)

  const isCollapsed = (group: CollectionGroup<TItem>) =>
    controlledCollapsedGroupIds
      ? controlledCollapsedGroupIds.includes(group.id)
      : resolveCollapsed(group, choices[group.id])

  const setGroupCollapsed = (groupId: string, collapsed: boolean) => {
    if (controlledCollapsedGroupIds) {
      onCollapsedGroupIdsChange?.(
        collapsed
          ? [
              ...controlledCollapsedGroupIds.filter((id) => id !== groupId),
              groupId,
            ]
          : controlledCollapsedGroupIds.filter((id) => id !== groupId),
      )
      return
    }

    const nextChoices = { ...choices, [groupId]: collapsed }
    setChoices(nextChoices)
    onCollapsedGroupIdsChange?.(
      groups
        .filter((group) => resolveCollapsed(group, nextChoices[group.id]))
        .map((group) => group.id),
    )
  }

  return (
    <div
      className="flex min-w-0 flex-col gap-1 p-2 rounded-lg bg-card/40 shadow-black/5 border border-border/80"
      aria-busy={loading ? 'true' : undefined}
      data-collection-grouping={grouping ?? undefined}
      data-slot="list-view"
    >
      {grouping === null && preparedGroups === undefined ? (
        <ListItemHeadingLevelContext.Provider value={2}>
          <div className="flex flex-col" data-slot="list-view-items">
            {loading
              ? Array.from({ length: loadingItemCount }, (_, position) => (
                  <ListItemSkeleton
                    key={`loading-${position + 1}`}
                    {...(loadingItemLabel ? { label: loadingItemLabel } : {})}
                  />
                ))
              : collection.items.map((item) => (
                  <ListViewItem
                    item={item}
                    key={collection.getKey(item)}
                    renderItem={renderItem}
                  />
                ))}
          </div>
        </ListItemHeadingLevelContext.Provider>
      ) : (
        groups.map((group) => {
          const actions = getGroupActions?.(group)

          return (
            <ListGroup
              collapsed={isCollapsed(group)}
              emptyLabel={
                typeof emptyGroupLabel === 'function'
                  ? emptyGroupLabel(group)
                  : emptyGroupLabel
              }
              getKey={collection.getKey}
              group={group}
              key={group.id}
              loading={loading}
              loadingItemCount={loadingItemCount}
              onCollapsedChange={(collapsed) =>
                setGroupCollapsed(group.id, collapsed)
              }
              {...(renderGroupTitle ? { renderGroupTitle } : {})}
              renderItem={renderItem}
              {...(loadingItemLabel ? { loadingItemLabel } : {})}
              {...(actions ? { actions } : {})}
            />
          )
        })
      )}
    </div>
  )
}
