import { CollisionPriority } from '@dnd-kit/abstract'
import { useDroppable } from '@dnd-kit/react'
import { Button } from '@tc96/ui/button'
import { ScrollArea } from '@tc96/ui/scroll-area'
import { cn } from '@tc96/utils'
import { EllipsisIcon, PlusIcon } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { memo, useId } from 'react'

import { createColumnDropId } from '../lib/drag-and-drop'
import type { KanbanColumnActions, KanbanColumnData } from '../types'
import { KanbanBadge } from './kanban-badge'
import { KanbanCardSkeleton } from './kanban-card-skeleton'
import { SortableKanbanCard } from './sortable-kanban-card'

export interface KanbanColumnProps<TCard = unknown> {
  column: KanbanColumnData<TCard>
  renderCard: (card: TCard) => ReactNode
  getKey: (card: TCard) => string | number
  emptyLabel?: string
  className?: string
  getCardDragId?: (card: TCard) => string
  getCardLabel?: (card: TCard) => string
  loading?: boolean
  loadingCardCount?: number
  loadingCardLabel?: string
  renderColumnTitle?: (column: KanbanColumnData<TCard>) => ReactNode
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
  renderColumnTitle,
  renderHeaderActions,
  titleId,
}: Readonly<{
  actions?: KanbanColumnActions
  column: KanbanColumnData<TCard>
  renderColumnTitle?: (column: KanbanColumnData<TCard>) => ReactNode
  renderHeaderActions?: (column: KanbanColumnData<TCard>) => ReactNode
  titleId: string
}>) {
  return (
    <header
      className={cn(
        'mb-3 flex shrink-0 items-center justify-between gap-3 px-3 pt-3',
        column.collapsed && 'flex-col px-1.5',
      )}
    >
      <div
        className={cn(
          'flex min-w-0 items-center gap-2',
          column.collapsed && 'flex-col',
        )}
      >
        {column.color ? (
          <span
            aria-hidden="true"
            className="size-3 shrink-0 rounded-full"
            style={{ backgroundColor: column.color }}
          />
        ) : null}
        <h2
          className={cn(
            'truncate font-semibold text-sm leading-none',
            column.collapsed && 'order-1 max-h-48 [writing-mode:vertical-rl]',
          )}
          id={titleId}
        >
          {renderColumnTitle?.(column) ?? column.title}
        </h2>
        <KanbanBadge
          className={column.collapsed ? 'order-0' : undefined}
          tone="neutral"
        >
          {column.count}
        </KanbanBadge>
      </div>
      {actions?.onOpenSettings ||
      (!column.collapsed && actions?.onAddCard) ||
      renderHeaderActions ? (
        <div
          className={cn(
            'flex shrink-0 items-center gap-0.5',
            column.collapsed && 'flex-col',
          )}
        >
          {!column.collapsed && actions?.onAddCard ? (
            <Button
              aria-label={
                actions.addLabel ?? `Adicionar item à seção ${column.title}`
              }
              onClick={() => actions.onAddCard?.(column.id)}
              size="icon-sm"
              variant="ghost"
            >
              <PlusIcon aria-hidden="true" />
            </Button>
          ) : null}
          {actions?.onOpenSettings ? (
            <Button
              aria-label={
                actions.settingsLabel ?? `Configurar seção ${column.title}`
              }
              onClick={() => actions.onOpenSettings?.(column.id)}
              size="icon-sm"
              variant="ghost"
            >
              <EllipsisIcon aria-hidden="true" />
            </Button>
          ) : null}
          {renderHeaderActions?.(column)}
        </div>
      ) : null}
    </header>
  )
}

interface KanbanColumnCardsProps<TCard> {
  column: KanbanColumnData<TCard>
  emptyLabel: string
  getCardDragId?: (card: TCard) => string
  getCardLabel: (card: TCard) => string
  getKey: (card: TCard) => string | number
  loading: boolean
  loadingCardCount: number
  loadingCardLabel?: string
  renderCard: (card: TCard) => ReactNode
  sortableCards: boolean
}

function KanbanColumnCards<TCard>({
  column,
  emptyLabel,
  getCardDragId,
  getCardLabel,
  getKey,
  loading,
  loadingCardCount,
  loadingCardLabel,
  renderCard,
  sortableCards,
}: KanbanColumnCardsProps<TCard>) {
  if (loading) {
    const loadingCards = Array.from(
      { length: loadingCardCount },
      (_, position) => ({
        id: `${column.id}-loading-${position + 1}`,
      }),
    )

    return loadingCards.map((card) => (
      <KanbanCardSkeleton
        key={card.id}
        {...(loadingCardLabel ? { label: loadingCardLabel } : {})}
      />
    ))
  }

  if (!column.cards.length) {
    return (
      <KanbanEmptyState className="bg-card/60 py-10">
        {emptyLabel}
      </KanbanEmptyState>
    )
  }

  const sortable = sortableCards && getCardDragId

  return column.cards.map((card, index) => (
    <KanbanColumnCard
      card={card}
      columnId={column.id}
      dragLabel={`Mover card ${getCardLabel(card)}`}
      index={index}
      key={getKey(card)}
      renderCard={renderCard}
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
  renderCard: (card: TCard) => ReactNode
}

// Cada troca de coluna durante o arraste renderiza o board de novo, e a
// insercao desloca o indice de todos os cards abaixo dela. O involucro
// sortable precisa do indice novo; o conteudo do consumidor, nao.
const KanbanColumnCard = memo(function KanbanColumnCard<TCard>({
  card,
  columnId,
  dragId,
  dragLabel,
  index,
  renderCard,
}: KanbanColumnCardProps<TCard>) {
  const content = <KanbanCardContentSlot card={card} renderCard={renderCard} />

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
  renderCard,
}: Pick<KanbanColumnCardProps<TCard>, 'card' | 'renderCard'>) {
  return renderCard(card)
}) as <TCard>(
  props: Pick<KanbanColumnCardProps<TCard>, 'card' | 'renderCard'>,
) => ReactNode

export function KanbanColumn<TCard>({
  column,
  renderCard,
  getKey,
  emptyLabel = 'Nenhum item nesta coluna.',
  className,
  getCardDragId,
  getCardLabel = (card) => String(getKey(card)),
  loading = false,
  loadingCardCount = 1,
  loadingCardLabel,
  renderColumnTitle,
  renderHeaderActions,
  sortableCards = false,
  actions,
}: KanbanColumnProps<TCard>) {
  const instanceId = useId()
  const titleId = `kanban-column-title-${instanceId}`
  const surfaceStyle: CSSProperties | undefined = column.color
    ? {
        backgroundColor: `color-mix(in srgb, var(--card) 96%, ${column.color} 4%)`,
        borderColor: `color-mix(in srgb, ${column.color} 8%, transparent)`,
      }
    : undefined
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
        {...(renderColumnTitle ? { renderColumnTitle } : {})}
        {...(renderHeaderActions ? { renderHeaderActions } : {})}
      />

      {!column.collapsed ? (
        <ScrollArea className="min-h-0 flex-1" fill scrollbarGutter scrollFade>
          <div
            ref={ref}
            className="grid h-full min-h-full min-w-0 max-w-full content-start gap-2 px-2 pb-2"
          >
            <KanbanColumnCards
              column={column}
              emptyLabel={emptyLabel}
              getCardLabel={getCardLabel}
              getKey={getKey}
              loading={loading}
              loadingCardCount={loadingCardCount}
              renderCard={renderCard}
              sortableCards={sortableCards}
              {...(getCardDragId ? { getCardDragId } : {})}
              {...(loadingCardLabel ? { loadingCardLabel } : {})}
            />
          </div>
        </ScrollArea>
      ) : null}
    </section>
  )
}
