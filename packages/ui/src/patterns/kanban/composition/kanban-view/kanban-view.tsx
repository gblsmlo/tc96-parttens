import { DragDropProvider, DragOverlay } from '@dnd-kit/react'
import { ScrollArea } from '@tc96/ui/scroll-area'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useCollapsedGroups } from '../../../collection/shared/hooks/use-collapsed-groups'
import type { KanbanCardSkeletonAnatomy } from '../../components/kanban-card-skeleton'
import { KanbanColumn } from '../../components/kanban-column'
import { KanbanColumnSelector } from '../../components/kanban-column-selector'
import { useActiveColumnId } from '../../hooks/use-active-column-id'
import { useHorizontalDragScroll } from '../../hooks/use-horizontal-drag-scroll'
import { useKanbanDragAndDrop } from '../../hooks/use-kanban-drag-and-drop'
import type {
  KanbanCardMove,
  KanbanColumnActions,
  KanbanColumnData,
  KanbanColumnOption,
} from '../../types'

export interface KanbanViewProps<TCard = unknown> {
  columns: KanbanColumnData<TCard>[]
  collapsedGroupIds?: readonly string[]
  defaultCollapsedGroupIds?: readonly string[]
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  renderRecord: (card: TCard) => ReactNode
  getKey: (card: TCard) => string | number
  getRecordLabel?: (card: TCard) => string
  getGroupActions?: (
    column: KanbanColumnData<TCard>,
  ) => KanbanColumnActions | undefined
  emptyGroupLabel?: ReactNode
  loading?: boolean
  loadingAnatomy?: KanbanCardSkeletonAnatomy
  loadingCount?: number
  loadingLabel?: string
  mobileColumnHint?: string
  onRecordMove?: (move: KanbanCardMove<TCard>) => boolean | Promise<boolean>
  renderGroupTitle?: (column: KanbanColumnData<TCard>) => ReactNode
  renderHeaderActions?: (column: KanbanColumnData<TCard>) => ReactNode
}

export function KanbanView<TCard>({
  columns,
  collapsedGroupIds,
  defaultCollapsedGroupIds,
  onCollapsedGroupIdsChange,
  renderRecord,
  getKey,
  getRecordLabel,
  getGroupActions,
  emptyGroupLabel,
  loading = false,
  loadingAnatomy,
  loadingCount = 1,
  loadingLabel,
  mobileColumnHint,
  onRecordMove,
  renderGroupTitle,
  renderHeaderActions,
}: KanbanViewProps<TCard>) {
  const shownColumns = useMemo(
    () => columns.filter((column) => !column.hidden),
    [columns],
  )
  const [activeColumnId, setActiveColumnId] = useActiveColumnId(shownColumns)
  const {
    cardDragEnabled,
    focusCardDragId,
    getCardDragId,
    handleCardFocusRestored,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    visibleColumns,
  } = useKanbanDragAndDrop({
    columns: shownColumns,
    getKey,
    ...(!loading && onRecordMove ? { onRecordMove } : {}),
  })
  const { isDragging: isBoardDragging, rootRef } = useHorizontalDragScroll()
  const boardContentRef = useRef<HTMLDivElement | null>(null)
  const columnOptions = createColumnOptions(shownColumns)
  const cardsByDragId = useMemo(
    () =>
      new Map(
        visibleColumns.flatMap((column) =>
          column.cards.map((card) => [getCardDragId(card), card] as const),
        ),
      ),
    [getCardDragId, visibleColumns],
  )
  const activeColumn = useMemo(
    () =>
      visibleColumns.find((column) => column.id === activeColumnId) ??
      visibleColumns[0],
    [activeColumnId, visibleColumns],
  )
  const columnProps = {
    getCardDragId,
    getKey,
    loading,
    ...(loadingAnatomy ? { loadingAnatomy } : {}),
    loadingCount,
    loadingLabel,
    renderGroupTitle,
    renderHeaderActions,
    renderRecord,
    sortableCards: cardDragEnabled,
    ...(emptyGroupLabel ? { emptyGroupLabel } : {}),
    ...(getRecordLabel ? { getRecordLabel } : {}),
  }
  const showHorizontalScrollbar = cardDragEnabled && isBoardDragging
  const collapsible = Boolean(onCollapsedGroupIdsChange)
  const { collapsedGroupIds: collapsedIds, setGroupCollapsed } =
    useCollapsedGroups({
      controlled: collapsedGroupIds,
      defaultValue: defaultCollapsedGroupIds ?? [],
      onChange: onCollapsedGroupIdsChange,
    })
  const getColumnProps = (column: KanbanColumnData<TCard>) => {
    const actions = getGroupActions?.(column)
    const collapsed = collapsedIds.includes(column.id)

    return {
      collapsed,
      ...(actions ? { actions } : {}),
      ...(collapsible
        ? {
            onCollapsedChange: (next: boolean) =>
              setGroupCollapsed(column.id, next),
          }
        : {}),
    }
  }

  useLayoutEffect(() => {
    if (!focusCardDragId) return

    const frame = requestAnimationFrame(() => {
      const card = Array.from(
        boardContentRef.current?.querySelectorAll<HTMLElement>(
          '[data-kanban-card-drag-id]',
        ) ?? [],
      ).find(
        (element) =>
          element.getAttribute('data-kanban-card-drag-id') === focusCardDragId,
      )

      if (!card) return
      card.focus({ preventScroll: true })
      card.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
        inline: 'nearest',
      })
      handleCardFocusRestored()
    })

    return () => cancelAnimationFrame(frame)
  }, [focusCardDragId, handleCardFocusRestored])

  return (
    <div
      aria-busy={loading ? 'true' : undefined}
      className="h-full min-h-0"
      data-slot="kanban-view"
    >
      <DragDropProvider
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
      >
        <div className="flex h-full min-h-0 flex-col gap-2">
          <KanbanColumnSelector
            columns={columnOptions}
            onValueChange={setActiveColumnId}
            value={activeColumnId}
            {...(mobileColumnHint ? { hint: mobileColumnHint } : {})}
          />

          <div className="grid min-h-0 flex-1 gap-2 md:hidden">
            {activeColumn ? (
              <KanbanColumn
                column={activeColumn}
                {...columnProps}
                sortableCards={false}
                {...getColumnProps(activeColumn)}
              />
            ) : null}
          </div>

          <ScrollArea
            className={cn(
              'hidden min-h-0 flex-1 md:block',
              '[&_[data-orientation=horizontal][data-slot=scroll-area-scrollbar]]:!delay-0',
              showHorizontalScrollbar
                ? '[&_[data-orientation=horizontal][data-slot=scroll-area-scrollbar]]:!opacity-100'
                : '[&_[data-orientation=horizontal][data-slot=scroll-area-scrollbar]]:!pointer-events-none [&_[data-orientation=horizontal][data-slot=scroll-area-scrollbar]]:!opacity-0',
              cardDragEnabled
                ? '[&_[data-slot=scroll-area-viewport]]:cursor-grab [&_[data-slot=scroll-area-viewport]]:select-none'
                : '[&_[data-slot=scroll-area-viewport]]:cursor-default',
              showHorizontalScrollbar &&
                '[&_[data-slot=scroll-area-viewport]]:cursor-grabbing',
            )}
            data-kanban-board-scroll-area=""
            data-kanban-horizontal-scrollbar={
              showHorizontalScrollbar ? 'visible' : 'hidden'
            }
            fill
            ref={cardDragEnabled ? rootRef : undefined}
            scrollFade
          >
            <div
              className="flex h-full min-h-full w-max gap-2 [&>[data-slot=kanban-column]]:shrink-0 [&>[data-slot=kanban-column]:not([data-collapsed])]:w-76 xl:[&>[data-slot=kanban-column]:not([data-collapsed])]:w-88"
              ref={boardContentRef}
            >
              {visibleColumns.map((column) => (
                <KanbanColumn
                  column={column}
                  key={column.id}
                  {...columnProps}
                  {...getColumnProps(column)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
        <DragOverlay className="pointer-events-none" dropAnimation={null}>
          {(source) => {
            const card = cardsByDragId.get(String(source.id))
            return card ? renderRecord(card) : null
          }}
        </DragOverlay>
      </DragDropProvider>
    </div>
  )
}

function createColumnOptions(
  columns: KanbanColumnData[],
): KanbanColumnOption[] {
  return columns.map((column) => ({
    label: `${column.title} · ${column.count}`,
    value: column.id,
  }))
}
