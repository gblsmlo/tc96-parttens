import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  KanbanCard,
  KanbanCardAction,
  KanbanCardActionButton,
  KanbanCardDescription,
  KanbanCardHeader,
  KanbanCardTitle,
  type KanbanColumnData,
  KanbanView,
} from '@tc96/parttens'
import { Trash2Icon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import {
  CardRecordDialog,
  type CardValues,
  DeleteCardDialog,
  delay,
} from './card-record-dialog'

interface BoardCard extends CardValues {
  columnId: string
  id: string
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

function RecordBoard() {
  const [cards, setCards] = useState(initialCards)
  const [creatingIn, setCreatingIn] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<BoardCard | null>(null)
  const [deletingTitle, setDeletingTitle] = useState('card')

  const columns = useMemo<KanbanColumnData<BoardCard>[]>(
    () =>
      boardColumns.map((column) => {
        const columnCards = cards.filter((card) => card.columnId === column.id)
        return { ...column, cards: columnCards, count: columnCards.length }
      }),
    [cards],
  )

  return (
    <div className="h-128 min-w-0 p-4">
      <KanbanView
        columns={columns}
        emptyColumnLabel="No cards in this column."
        getCardLabel={(card) => card.title}
        getColumnActions={(column) => ({
          addLabel: `Add card to ${column.title}`,
          onAddCard: setCreatingIn,
        })}
        getKey={(card) => card.id}
        renderCard={(card) => (
          <KanbanCard key={card.id}>
            <KanbanCardHeader>
              <KanbanCardTitle>{card.title}</KanbanCardTitle>
              <KanbanCardDescription>{card.description}</KanbanCardDescription>
              <KanbanCardAction>
                <KanbanCardActionButton
                  aria-label={`Delete ${card.title}`}
                  onClick={() => {
                    setDeletingTitle(card.title)
                    setDeleting(card)
                  }}
                  size="icon"
                >
                  <Trash2Icon aria-hidden className="size-4" />
                </KanbanCardActionButton>
              </KanbanCardAction>
            </KanbanCardHeader>
          </KanbanCard>
        )}
      />
      <CardRecordDialog
        onOpenChange={(open) => {
          if (!open) setCreatingIn(null)
        }}
        onSave={async (values) => {
          await delay(150)
          setCards((current) => [
            ...current,
            {
              ...values,
              columnId: creatingIn ?? 'todo',
              id: crypto.randomUUID(),
            },
          ])
        }}
        open={creatingIn !== null}
        submitLabel="Create card"
        title="New card"
      />
      <DeleteCardDialog
        onConfirm={async () => {
          await delay(150)
          setCards((current) =>
            current.filter((card) => card.id !== deleting?.id),
          )
          return true
        }}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        open={deleting !== null}
        title={`Delete ${deletingTitle}`}
      />
    </div>
  )
}

const meta = {
  component: RecordBoard,
  parameters: {
    docs: {
      description: {
        component:
          'record-dialog over the collection-views Kanban: the column add button opens a RecordDialog validated with zod, and a card action opens a destructive SurfaceStates.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
  title: 'Patterns/RecordDialog Kanban',
} satisfies Meta<typeof RecordBoard>

export default meta

type Story = StoryObj<typeof meta>

const screen = () => within(document.body)

export const Board: Story = {}

export const BoardInteraction: Story = {
  ...Board,
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const board = within(canvasElement)

    await userEvent.click(
      await board.findByRole('button', { name: 'Add card to To do' }),
    )
    const form = await screen().findByRole('dialog', { name: 'New card' })
    await userEvent.type(
      within(form).getByRole('textbox', { name: 'Title' }),
      'Write the docs',
    )
    await userEvent.click(
      within(form).getByRole('button', { name: 'Create card' }),
    )
    await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())
    expect(
      within(board.getByRole('region', { name: 'To do' })).getByText(
        'Write the docs',
      ),
    ).toBeVisible()

    await userEvent.click(
      board.getByRole('button', { name: 'Delete Write the docs' }),
    )
    const confirm = await screen().findByRole('alertdialog', {
      name: 'Delete Write the docs',
    })
    await userEvent.click(
      within(confirm).getByRole('button', { name: 'Delete' }),
    )
    await waitFor(() => expect(screen().queryByRole('alertdialog')).toBeNull())
    expect(board.queryByText('Write the docs')).toBeNull()
  },
}
