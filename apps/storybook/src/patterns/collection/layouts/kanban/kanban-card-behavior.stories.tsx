import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  KanbanCard,
  KanbanCardAction,
  KanbanCardOpenTrigger,
  KanbanCardSkeleton,
} from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const onOpen = fn()
const onAction = fn()

function CardWithActions() {
  return (
    <div className="w-80 p-4">
      <KanbanCard variant="interactive">
        <KanbanCardOpenTrigger
          aria-label="Abrir detalhes do item"
          onClick={onOpen}
        />
        <KanbanCardAction>
          <button onClick={onAction} type="button">
            Mudar prioridade
          </button>
        </KanbanCardAction>
      </KanbanCard>
    </div>
  )
}

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Kanban/Card Behavior',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const FullColumnWidth: Story = {
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('article')
    const column = card.parentElement as HTMLElement
    await expect(card.getBoundingClientRect().width).toBeCloseTo(
      column.getBoundingClientRect().width,
      0,
    )
  },
  render: () => (
    <div className="p-4">
      <div className="w-72">
        <KanbanCard>Cartão</KanbanCard>
      </div>
    </div>
  ),
}

export const DimmedCardHasDashedBorder: Story = {
  play: async ({ canvasElement }) => {
    const [rest, dimmed] = within(canvasElement).getAllByRole('article')
    await expect(getComputedStyle(rest as HTMLElement).borderTopStyle).not.toBe(
      'dashed',
    )
    await expect(getComputedStyle(dimmed as HTMLElement).borderTopStyle).toBe(
      'dashed',
    )
  },
  render: () => (
    <div className="flex w-72 flex-col gap-3 p-4">
      <KanbanCard>Cartão comum</KanbanCard>
      <KanbanCard dimmed selected>
        Cartão suspenso
      </KanbanCard>
    </div>
  ),
}

export const SelectedCardShowsRing: Story = {
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('article')
    await expect(getComputedStyle(card).boxShadow).toContain('0px 0px 0px 2px')
  },
  render: () => (
    <div className="w-72 p-4">
      <KanbanCard selected>Cartão selecionado</KanbanCard>
    </div>
  ),
}

export const SkeletonAnnouncesLoading: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('status', { name: 'Carregando tarefa' }),
    ).toHaveAttribute('aria-busy', 'true')
  },
  render: () => (
    <div className="w-72 p-4">
      <KanbanCardSkeleton label="Carregando tarefa" />
    </div>
  ),
}

export const RendersAsRegionKeepingCard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Cartão de tarefa' }),
    ).toBeVisible()
    await expect(canvas.getByText('Abrir tarefa')).toBeVisible()
  },
  render: () => (
    <div className="w-72 p-4">
      <KanbanCard
        render={<section aria-label="Cartão de tarefa" />}
        selected
        variant="interactive"
      >
        Abrir tarefa
      </KanbanCard>
    </div>
  ),
}

export const CardIsArticleWithSiblingControls: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('article')).toBeVisible()
    await expect(canvasElement.querySelector('button button')).toBeNull()
  },
  render: () => <CardWithActions />,
}

export const OpenTriggerAndActionAreSeparate: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    onOpen.mockClear()
    onAction.mockClear()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Abrir detalhes do item' }),
    )
    await expect(onOpen).toHaveBeenCalledTimes(1)
    await expect(onAction).not.toHaveBeenCalled()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Mudar prioridade' }),
    )
    await expect(onAction).toHaveBeenCalledTimes(1)
    await expect(onOpen).toHaveBeenCalledTimes(1)
  },
  render: () => <CardWithActions />,
}

export const ActionReceivesPointerAboveOpenTrigger: Story = {
  play: async ({ canvasElement }) => {
    const action = within(canvasElement).getByRole('button', {
      name: 'Mudar prioridade',
    })
    const box = action.getBoundingClientRect()
    const hit = document.elementFromPoint(
      box.left + box.width / 2,
      box.top + box.height / 2,
    )
    await expect(hit?.closest('button')).toBe(action)
  },
  render: () => <CardWithActions />,
}
