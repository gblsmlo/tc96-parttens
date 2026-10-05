import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  KanbanCard,
  KanbanCardDescription,
  KanbanCardHeader,
  KanbanCardOpenTrigger,
  KanbanCardTitle,
  type KanbanColumnData,
  KanbanView,
  RecordPreview,
  RecordPreviewAction,
} from '@tc96/parttens'
import { ArrowRightIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

interface BoardCard {
  columnId: string
  description: string
  id: string
  title: string
}

const boardColumns = [
  { id: 'todo', title: 'To do' },
  { id: 'doing', title: 'In progress' },
  { id: 'done', title: 'Done' },
]

const initialCards: BoardCard[] = [
  {
    columnId: 'todo',
    description: 'Sign-up flow with e-mail and social login.',
    id: 'card-1',
    title: 'Implement onboarding',
  },
  {
    columnId: 'doing',
    description: 'Cover the payment step.',
    id: 'card-2',
    title: 'Checkout tests',
  },
]

function toColumns(cards: BoardCard[]): KanbanColumnData<BoardCard>[] {
  return boardColumns.map((column) => {
    const columnCards = cards.filter((card) => card.columnId === column.id)
    return { ...column, cards: columnCards, count: columnCards.length }
  })
}

function PreviewBoard() {
  const boardRef = useRef<HTMLDivElement | null>(null)
  const [cards, setCards] = useState(initialCards)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [lastSelected, setLastSelected] = useState<BoardCard | null>(null)

  const selected = cards.find((card) => card.id === selectedId) ?? lastSelected

  return (
    <div className="h-128 min-w-0 p-4" ref={boardRef}>
      <KanbanView
        columns={toColumns(cards)}
        emptyColumnLabel="No cards in this column."
        getCardLabel={(card) => card.title}
        getKey={(card) => card.id}
        renderCard={(card) => (
          <KanbanCard
            key={card.id}
            selected={card.id === selectedId}
            variant="interactive"
          >
            <KanbanCardHeader>
              <KanbanCardTitle>{card.title}</KanbanCardTitle>
              <KanbanCardDescription>{card.description}</KanbanCardDescription>
            </KanbanCardHeader>
            <KanbanCardOpenTrigger
              aria-label={`Preview ${card.title}`}
              data-record-id={card.id}
              onClick={() => {
                setLastSelected(card)
                setSelectedId(card.id)
              }}
            />
          </KanbanCard>
        )}
      />
      <RecordPreview
        actions={
          <RecordPreviewAction
            disabled={selected?.columnId === 'done'}
            label="Move to Done"
            onClick={() =>
              setCards((current) =>
                current.map((card) =>
                  card.id === selectedId ? { ...card, columnId: 'done' } : card,
                ),
              )
            }
          >
            <ArrowRightIcon aria-hidden="true" />
          </RecordPreviewAction>
        }
        closeLabel="Close preview"
        description={
          boardColumns.find((column) => column.id === selected?.columnId)?.title
        }
        finalFocus={() =>
          Array.from(
            boardRef.current?.querySelectorAll<HTMLElement>(
              `[data-record-id="${selected?.id}"]`,
            ) ?? [],
          ).find((trigger) => trigger.getClientRects().length > 0) ?? null
        }
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
        open={selectedId !== null}
        title={selected?.title ?? 'Card'}
      >
        <p className="text-sm">{selected?.description}</p>
      </RecordPreview>
    </div>
  )
}

const meta = {
  component: PreviewBoard,
  parameters: {
    docs: {
      description: {
        component:
          'record-preview over the collection-views Kanban: the card open trigger sets the selected record and the consumer owns that state.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
  title: 'Patterns/RecordPreview/Usages/Kanban',
} satisfies Meta<typeof PreviewBoard>

export default meta

type Story = StoryObj<typeof meta>

const screen = () => within(document.body)

export const Board: Story = {}

export const BoardInteraction: Story = {
  ...Board,
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const board = within(canvasElement)

    const card = await board.findByRole('button', {
      name: 'Preview Implement onboarding',
    })
    await userEvent.click(card)
    const dialog = await screen().findByRole('dialog', {
      name: 'Implement onboarding',
    })
    await waitFor(() => expect(within(dialog).getByText('To do')).toBeVisible())

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(card).toHaveFocus())

    await userEvent.click(card)
    const reopened = await screen().findByRole('dialog', {
      name: 'Implement onboarding',
    })
    await userEvent.click(
      within(reopened).getByRole('button', { name: 'Move to Done' }),
    )
    await waitFor(() =>
      expect(within(reopened).getByText('Done')).toBeVisible(),
    )

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())
    const moved = await board.findByRole('button', {
      name: 'Preview Implement onboarding',
    })
    expect(moved).not.toBe(card)
    await waitFor(() => expect(moved).toHaveFocus())
  },
}
