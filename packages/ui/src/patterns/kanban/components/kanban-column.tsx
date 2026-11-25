import { CollisionPriority } from '@dnd-kit/abstract'
import { useDroppable } from '@dnd-kit/react'
import { DotsThreeIcon, PlusIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { ScrollArea } from '@tc96/ui/scroll-area'
import { cn } from '@tc96/utils'
import type { CSSProperties, ReactNode } from 'react'
import { memo, useId } from 'react'

import { defaultColumnColor } from '../lib/column-color'
import { createColumnDropId } from '../lib/drag-and-drop'
import type {
  KanbanBoardColumn,
  KanbanColumnActions,
  KanbanColumnData,
} from '../types'
import { KanbanBadge } from './kanban-badge'
import {
  KanbanCardSkeleton,
  type KanbanCardSkeletonAnatomy,
} from './kanban-card-skeleton'
import { KanbanColumnSettings } from './kanban-column-settings'
import { SortableKanbanCard } from './sortable-kanban-card'

export interface KanbanColumnProps<TCard = unknown> {
  column: KanbanColumnData<TCard>
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  renderRecord: (card: TCard) => ReactNode
  getKey: (card: TCard) => string | number
  emptyGroupLabel?: ReactNode
  className?: string
  getCardDragId?: (card: TCard) => string
  getRecordLabel?: (card: TCard) => string
  loading?: boolean
  loadingAnatomy?: KanbanCardSkeletonAnatomy
  loadingCount?: number
  loadingLabel?: string
  renderGroupTitle?: (column: KanbanColumnData<TCard>) => ReactNode
  renderHeaderActions?: (column: KanbanColumnData<TCard>) => ReactNode
  sortableCards?: boolean
  actions?: KanbanColumnActions
}

function KanbanEmptyState({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <div
      className={cn(
        'min-w-0 max-w-full rounded-md border border-dashed px-3 py-6 text-center text-muted-foreground text-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}

function KanbanColumnHeader<TCard>({
  actions,
  column,
  onCollapsedChange,
  renderGroupTitle,
  renderHeaderActions,
  titleId,
}: Readonly<{
  actions?: KanbanColumnActions
  column: KanbanBoardColumn<TCard>
  onCollapsedChange?: (collapsed: boolean) => void
  renderGroupTitle?: (column: KanbanColumnData<TCard>) => ReactNode
  renderHeaderActions?: (column: KanbanColumnData<TCard>) => ReactNode
  titleId: string
}>) {
  const settingsLabel =
    actions?.settingsLabel ?? `Configurar seção ${column.title}`
  const settingsPopover = Boolean(
    (actions?.onColorChange && actions.colorOptions?.length) ||
      onCollapsedChange,
  )

  return (
    <header
      className={cn(
        'mb-3 flex shrink-0 items-center justify-between gap-3 pt-3',
        column.collapsed ? 'flex-col px-1.5' : 'px-3',
      )}
    >
      <div
        className={cn(
          'flex min-w-0 items-center gap-2',
          column.collapsed && 'flex-col',
        )}
      >
        <span
          aria-hidden="true"
          className="size-3 shrink-0 rounded-full"
          style={{ backgroundColor: column.color ?? defaultColumnColor }}
        />
        <h2
          className={cn(
            'truncate font-semibold text-sm leading-none',
            column.collapsed && 'order-1 max-h-48 [writing-mode:vertical-rl]',
          )}
          id={titleId}
        >
          {renderGroupTitle?.(column) ?? column.title}
        </h2>
        <KanbanBadge
          className={column.collapsed ? 'order-0' : undefined}
          tone="neutral"
        >
          {column.count}
        </KanbanBadge>
      </div>
      {actions?.onSettingsOpen ||
      settingsPopover ||
      (!column.collapsed && actions?.onRecordAdd) ||
      renderHeaderActions ? (
        <div
          className={cn(
            'flex shrink-0 items-center gap-0.5',
            column.collapsed && 'flex-col',
          )}
        >
          {!column.collapsed && actions?.onRecordAdd ? (
            <Button
              aria-label={
                actions.addLabel ?? `Adicionar item à seção ${column.title}`
              }
              onClick={() => actions.onRecordAdd?.(column.id)}
              size="icon-sm"
              variant="ghost"
            >
              <PlusIcon aria-hidden="true" />
            </Button>
          ) : null}
          {settingsPopover ? (
            <KanbanColumnSettings
              actions={actions ?? {}}
              column={column}
              label={settingsLabel}
              {...(onCollapsedChange ? { onCollapsedChange } : {})}
            />
          ) : actions?.onSettingsOpen ? (
            <Button
              aria-label={settingsLabel}
              onClick={() => actions.onSettingsOpen?.(column.id)}
              size="icon-sm"
              variant="ghost"
            >
              <DotsThreeIcon aria-hidden="true" />
            </Button>
          ) : null}
          {renderHeaderActions?.(column)}
        </div>
      ) : null}
    </header>
  )
}

interface KanbanColumnCardsProps<TCard> {
  column: KanbanBoardColumn<TCard>
  emptyGroupLabel: ReactNode
  getCardDragId?: (card: TCard) => string
  getRecordLabel: (card: TCard) => string
  getKey: (card: TCard) => string | number
  loading: boolean
  loadingAnatomy?: KanbanCardSkeletonAnatomy
  loadingCount: number
  loadingLabel?: string
  renderRecord: (card: TCard) => ReactNode
  sortableCards: boolean
}

function KanbanColumnCards<TCard>({
  column,
  emptyGroupLabel,
  getCardDragId,
  getRecordLabel,
  getKey,
  loading,
  loadingAnatomy,
  loadingCount,
  loadingLabel,
  renderRecord,
  sortableCards,
}: KanbanColumnCardsProps<TCard>) {
  if (loading) {
    const loadingCards = Array.from(
      { length: loadingCount },
      (_, position) => ({
        id: `${column.id}-loading-${position + 1}`,
      }),
    )

    return loadingCards.map((card) => (
      <KanbanCardSkeleton
        key={card.id}
        {...loadingAnatomy}
        {...(loadingLabel ? { label: loadingLabel } : {})}
      />
    ))
  }

  if (!column.cards.length) {
    return (
      <KanbanEmptyState className="bg-card/60 py-10">
        {emptyGroupLabel}
      </KanbanEmptyState>
    )
  }

  const sortable = sortableCards && getCardDragId

  return column.cards.map((card, index) => (
    <KanbanColumnCard
      card={card}
      columnId={column.id}
      dragLabel={`Mover card ${getRecordLabel(card)}`}
      index={index}
      key={getKey(card)}
      renderRecord={renderRecord}
      {...(sortable ? { dragId: getCardDragId(card) } : {})}
    />
  ))
}

interface KanbanColumnCardProps<TCard> {
  card: TCard
  columnId: string
  dragId?: string
  dragLabel: string
  index: number
  renderRecord: (card: TCard) => ReactNode
}

const KanbanColumnCard = memo(function KanbanColumnCard<TCard>({
  card,
  columnId,
  dragId,
  dragLabel,
  index,
  renderRecord,
}: KanbanColumnCardProps<TCard>) {
  const content = (
    <KanbanCardContentSlot card={card} renderRecord={renderRecord} />
  )

  if (dragId === undefined) {
    return (
      <div className="min-w-0 max-w-full" data-kanban-card-container="">
        {content}
      </div>
    )
  }

  return (
    <SortableKanbanCard
      columnId={columnId}
      dragLabel={dragLabel}
      id={dragId}
      index={index}
    >
      {content}
    </SortableKanbanCard>
  )
}) as <TCard>(props: KanbanColumnCardProps<TCard>) => ReactNode

const KanbanCardContentSlot = memo(function KanbanCardContentSlot<TCard>({
  card,
  renderRecord,
}: Pick<KanbanColumnCardProps<TCard>, 'card' | 'renderRecord'>) {
  return renderRecord(card)
}) as <TCard>(
  props: Pick<KanbanColumnCardProps<TCard>, 'card' | 'renderRecord'>,
) => ReactNode

export function KanbanColumn<TCard>({
  column: columnData,
  collapsed = false,
  renderRecord,
  getKey,
  emptyGroupLabel = 'Nenhum item nesta coluna.',
  className,
  getCardDragId,
  getRecordLabel = (card) => String(getKey(card)),
  loading = false,
  loadingAnatomy,
  loadingCount = 1,
  loadingLabel,
  renderGroupTitle,
  renderHeaderActions,
  sortableCards = false,
  actions,
  onCollapsedChange,
}: KanbanColumnProps<TCard>) {
  const column: KanbanBoardColumn<TCard> = collapsed
    ? { ...columnData, collapsed }
    : columnData
  const instanceId = useId()
  const titleId = `kanban-column-title-${instanceId}`
  const color = column.color ?? defaultColumnColor
  const surfaceStyle: CSSProperties = {
    backgroundColor: `color-mix(in srgb, var(--card) 96%, ${color} 4%)`,
    borderColor: `color-mix(in srgb, ${color} 8%, transparent)`,
  }
  const { ref } = useDroppable({
    accept: 'kanban-card',
    collisionPriority: CollisionPriority.Lowest,
    id: createColumnDropId(column.id, instanceId),
    data: { columnId: column.id, type: 'column' },
    disabled: !sortableCards || !!column.collapsed,
    type: 'kanban-column',
  })

  return (
    <section
      aria-labelledby={titleId}
      data-collapsed={column.collapsed ? 'true' : undefined}
      data-slot="kanban-column"
      className={cn(
        'flex h-full min-h-0 min-w-0 max-w-full flex-col rounded-lg border border-border bg-card text-card-foreground shadow-none',
        column.collapsed && 'w-12',
        className,
      )}
      style={surfaceStyle}
    >
      <KanbanColumnHeader
        column={column}
        titleId={titleId}
        {...(!loading && actions ? { actions } : {})}
        {...(!loading && onCollapsedChange ? { onCollapsedChange } : {})}
        {...(renderGroupTitle ? { renderGroupTitle } : {})}
        {...(renderHeaderActions ? { renderHeaderActions } : {})}
      />

      {!column.collapsed ? (
        <ScrollArea className="min-h-0 flex-1" fill scrollFade>
          <div
            ref={ref}
            className="grid h-full min-h-full min-w-0 max-w-full content-start gap-2 px-2 pb-2"
          >
            <KanbanColumnCards
              column={column}
              emptyGroupLabel={emptyGroupLabel}
              getRecordLabel={getRecordLabel}
              getKey={getKey}
              loading={loading}
              {...(loadingAnatomy ? { loadingAnatomy } : {})}
              loadingCount={loadingCount}
              renderRecord={renderRecord}
              sortableCards={sortableCards}
              {...(getCardDragId ? { getCardDragId } : {})}
              {...(loadingLabel ? { loadingLabel } : {})}
            />
          </div>
        </ScrollArea>
      ) : null}
    </section>
  )
}
