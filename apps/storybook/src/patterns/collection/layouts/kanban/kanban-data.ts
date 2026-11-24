import type {
  KanbanCardMove,
  KanbanCardSkeletonAnatomy,
  KanbanColumnData,
} from '@tc96/ui/patterns'

export interface SampleCard {
  id: string
  title: string
}

export const sampleColumns: KanbanColumnData<SampleCard>[] = [
  {
    cards: [
      { id: 'card-1', title: 'Primeiro card' },
      { id: 'card-2', title: 'Segundo card' },
    ],
    color: '#94a3b8',
    count: 2,
    id: 'todo',
    title: 'A fazer',
  },
  {
    cards: [{ id: 'card-3', title: 'Terceiro card' }],
    color: '#3b82f6',
    count: 1,
    id: 'doing',
    title: 'Em andamento',
  },
  { cards: [], color: '#22c55e', count: 0, id: 'done', title: 'Concluído' },
]

export const applyCardMove = <TCard extends { id: string }>(
  columns: readonly KanbanColumnData<TCard>[],
  { card, sourceColumnId, targetColumnId, targetIndex }: KanbanCardMove<TCard>,
): KanbanColumnData<TCard>[] =>
  columns.map((column) => {
    const cards = column.cards.filter((current) => current.id !== card.id)
    if (column.id === targetColumnId) {
      cards.splice(targetIndex ?? cards.length, 0, card)
    } else if (column.id !== sourceColumnId) {
      return column
    }
    return { ...column, cards, count: cards.length }
  })

export const taskCardAnatomy: KanbanCardSkeletonAnatomy = {
  assignee: true,
  counts: 3,
  descriptionLines: 2,
  fields: 4,
  menu: true,
}

export const dealCardAnatomy: KanbanCardSkeletonAnatomy = {
  assignee: true,
  counts: 3,
  descriptionLines: 1,
  fields: 3,
  menu: true,
}

export const LOAD_DELAY = 2000
