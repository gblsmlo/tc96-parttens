'use client'

import { Empty, EmptyDescription } from '@tc96/ui/empty'
import { Separator } from '@tc96/ui/separator'
import { Fragment, type ReactNode, useMemo, useState } from 'react'

import { projectCollection } from '../../../shared/lib/project-collection'
import { skeletonKeys } from '../../../shared/lib/skeleton-keys'
import type {
  CollectionDefinition,
  CollectionGroup,
  CollectionGroupingId,
} from '../../../types/collection'
import { ListGroup, type ListGroupActions } from './list-group'
import { ListItemHeadingLevelContext } from './list-item'
import { ListItemSkeleton } from './list-item-skeleton'
import { ListViewItem } from './list-view-item'

export interface ListViewProps<TRecord> {
  collection: CollectionDefinition<TRecord>
  groups?: readonly CollectionGroup<TRecord>[]
  collapsedGroupIds?: readonly string[]
  /**
   * Grupo sem itens nasce colapsado. A escolha manual da pessoa prevalece, e um
   * grupo que ganha itens volta a abrir sozinho enquanto ninguém o tocou.
   *
   * Ignorado quando `collapsedGroupIds` é passado: ali o array é a autoridade.
   */
  collapseEmptyGroups?: boolean
  defaultCollapsedGroupIds?: readonly string[]
  separated?: boolean
  emptyGroupLabel?: ReactNode | ((group: CollectionGroup<TRecord>) => ReactNode)
  emptyMessage?: ReactNode
  getGroupActions?: (
    group: CollectionGroup<TRecord>,
  ) => ListGroupActions | undefined
  /** `null` lê a coleção como uma lista plana, sem cabeçalho nem colapso. */
  grouping: CollectionGroupingId | null
  loading?: boolean
  /** Esqueletos por grupo — ou da lista inteira, quando não há agrupamento. */
  loadingRecordCount?: number
  loadingRecordLabel?: string
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  renderGroupTitle?: (group: CollectionGroup<TRecord>) => ReactNode
  renderRecord: (record: TRecord) => ReactNode
}

export function ListView<TRecord>({
  collection,
  groups: preparedGroups,
  collapsedGroupIds: controlledCollapsedGroupIds,
  collapseEmptyGroups = false,
  defaultCollapsedGroupIds = [],
  separated = false,
  emptyGroupLabel = 'No items in this group.',
  emptyMessage = 'No items to show.',
  getGroupActions,
  grouping,
  loading = false,
  loadingRecordCount = 1,
  loadingRecordLabel,
  onCollapsedGroupIdsChange,
  renderGroupTitle,
  renderRecord,
}: ListViewProps<TRecord>) {
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
    group: CollectionGroup<TRecord>,
    choice: boolean | undefined,
  ) => choice ?? (collapseEmptyGroups && group.count === 0 && !loading)

  const isCollapsed = (group: CollectionGroup<TRecord>) =>
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
            {loading ? (
              skeletonKeys('loading', loadingRecordCount).map((skeletonKey) => (
                <ListItemSkeleton
                  key={skeletonKey}
                  {...(loadingRecordLabel ? { label: loadingRecordLabel } : {})}
                />
              ))
            ) : collection.records.length ? (
              collection.records.map((record, position) => (
                <Fragment key={collection.getKey(record)}>
                  {separated && position > 0 ? (
                    <Separator className="bg-border/40" />
                  ) : null}
                  <ListViewItem record={record} renderRecord={renderRecord} />
                </Fragment>
              ))
            ) : (
              <Empty>
                <EmptyDescription>{emptyMessage}</EmptyDescription>
              </Empty>
            )}
          </div>
        </ListItemHeadingLevelContext.Provider>
      ) : (
        groups.map((group) => {
          const actions = getGroupActions?.(group)

          return (
            <ListGroup
              collapsed={isCollapsed(group)}
              separated={separated}
              emptyLabel={
                typeof emptyGroupLabel === 'function'
                  ? emptyGroupLabel(group)
                  : emptyGroupLabel
              }
              getKey={collection.getKey}
              group={group}
              key={group.id}
              loading={loading}
              loadingRecordCount={loadingRecordCount}
              onCollapsedChange={(collapsed) =>
                setGroupCollapsed(group.id, collapsed)
              }
              {...(renderGroupTitle ? { renderGroupTitle } : {})}
              renderRecord={renderRecord}
              {...(loadingRecordLabel ? { loadingRecordLabel } : {})}
              {...(actions ? { actions } : {})}
            />
          )
        })
      )}
    </div>
  )
}
