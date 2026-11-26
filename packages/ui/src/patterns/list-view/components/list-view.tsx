'use client'

import { Empty, EmptyDescription } from '@tc96/ui/empty'
import { ScrollArea } from '@tc96/ui/scroll-area'
import { Separator } from '@tc96/ui/separator'
import { Fragment, type ReactNode, useMemo, useState } from 'react'

import { projectCollection } from '../../collection/shared/lib/project-collection'
import { skeletonKeys } from '../../collection/shared/lib/skeleton-keys'
import type {
  CollectionDefinition,
  CollectionGroup,
  CollectionGroupingId,
} from '../../collection/types/collection'
import { ListGroup, type ListGroupActions } from './list-group'
import { ListRowHeadingLevelContext } from './list-row'
import {
  ListRowSkeleton,
  type ListRowSkeletonAnatomy,
} from './list-row-skeleton'
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
  getGroupToggleLabel?: (group: string, collapsed: boolean) => string
  header?: ReactNode
  /** `null` lê a coleção como uma lista plana, sem cabeçalho nem colapso. */
  grouping: CollectionGroupingId | null
  loading?: boolean
  loadingAnatomy?: ListRowSkeletonAnatomy
  /** Esqueletos por grupo — ou da lista inteira, quando não há agrupamento. */
  loadingCount?: number
  loadingLabel?: string
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
  getGroupToggleLabel,
  grouping,
  header,
  loading = false,
  loadingAnatomy,
  loadingCount = 1,
  loadingLabel,
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
    <ScrollArea
      aria-busy={loading ? 'true' : undefined}
      className="min-w-0 flex-1 rounded-lg border border-border/80 bg-card/40 shadow-black/5"
      data-collection-grouping={grouping ?? undefined}
      data-slot="list-view"
      viewportProps={{
        className:
          'mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] [--fade-size:1.5rem]',
      }}
    >
      {header ? (
        <div
          className="sticky top-0 z-30 border-b bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] dark:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)]"
          data-slot="list-view-header"
        >
          {header}
        </div>
      ) : null}
      <div className="flex flex-col gap-1 p-2" data-slot="list-view-body">
        {grouping === null && preparedGroups === undefined ? (
          <ListRowHeadingLevelContext.Provider value={2}>
            <div className="flex flex-col gap-0.5" data-slot="list-view-items">
              {loading ? (
                skeletonKeys('loading', loadingCount).map((skeletonKey) => (
                  <ListRowSkeleton
                    key={skeletonKey}
                    {...loadingAnatomy}
                    {...(loadingLabel ? { label: loadingLabel } : {})}
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
          </ListRowHeadingLevelContext.Provider>
        ) : (
          groups.map((group) => {
            const actions = getGroupActions?.(group)

            return (
              <ListGroup
                collapsed={isCollapsed(group)}
                separated={separated}
                emptyGroupLabel={
                  typeof emptyGroupLabel === 'function'
                    ? emptyGroupLabel(group)
                    : emptyGroupLabel
                }
                {...(getGroupToggleLabel ? { getGroupToggleLabel } : {})}
                getKey={collection.getKey}
                stickyBelowHeader={Boolean(header)}
                group={group}
                key={group.id}
                loading={loading}
                {...(loadingAnatomy ? { loadingAnatomy } : {})}
                loadingCount={loadingCount}
                onCollapsedChange={(collapsed) =>
                  setGroupCollapsed(group.id, collapsed)
                }
                {...(renderGroupTitle ? { renderGroupTitle } : {})}
                renderRecord={renderRecord}
                {...(loadingLabel ? { loadingLabel } : {})}
                {...(actions ? { actions } : {})}
              />
            )
          })
        )}
      </div>
    </ScrollArea>
  )
}
