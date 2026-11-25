import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { initialDeals } from '../collection/fixtures/deals'
import { KanbanCardCanvas } from './kanban-card-canvas.tsx'
import { kanbanCardControlArgs } from './kanban-card-controls.ts'
import { ComposedKanbanCard, DealCardExample } from './kanban-card-layouts.tsx'

interface KanbanCardBehaviorArgs {
  onOpen: () => void
}

const meta = {
  args: { onOpen: fn() },
  decorators: [KanbanCardCanvas],
  render: ({ onOpen }) => <DealCardExample onOpen={onOpen} />,
  tags: ['!autodocs'],
  title: 'Patterns/KanbanCard/Behavior',
} satisfies Meta<KanbanCardBehaviorArgs>

export default meta

type Story = StoryObj<KanbanCardBehaviorArgs>

const [deal] = initialDeals

export const CardIsAnArticle: Story = {
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('article')

    await expect(card).toHaveAttribute('data-slot', 'card')
    await expect(card).toHaveAttribute('data-interactive')
    await expect(canvasElement.querySelector('button button')).toBeNull()
  },
}

export const OpenTriggerOpensTheCard: Story = {
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: `Abrir negócio ${deal?.company}`,
    })

    await userEvent.click(trigger)
    await expect(args.onOpen).toHaveBeenCalledOnce()

    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onOpen).toHaveBeenCalledTimes(2)
  },
}

export const InteractiveFieldKeepsItsClick: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('combobox', { name: /^Etapa/ }))
    await userEvent.click(await body.findByRole('option', { name: 'Ganho' }))

    await expect(
      canvas.getByRole('combobox', { name: /^Etapa/ }),
    ).toHaveTextContent('Ganho')
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull())
    await expect(args.onOpen).not.toHaveBeenCalled()
  },
}

export const ControlsKeepTheirClick: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Mais ações do negócio' }),
    )
    await expect(
      await body.findByRole('menuitem', { name: 'Editar negócio' }),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    await userEvent.click(canvas.getByRole('button', { name: 'Notas: 1' }))
    await expect(
      await body.findByRole('menuitem', { name: 'Criar nota' }),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    await expect(args.onOpen).not.toHaveBeenCalled()
  },
}

export const MinimalHidesDescriptionBodyAndFooter: Story = {
  render: () => (
    <ComposedKanbanCard {...kanbanCardControlArgs} display="minimal" />
  ),
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('article')

    await expect(card).toHaveAttribute('data-display', 'minimal')
    await expect(within(card).getByText('Primeiro card')).toBeVisible()
    await expect(
      within(card).getByText('Descrição curta do card.'),
    ).not.toBeVisible()
    await expect(within(card).getByText('Valor')).not.toBeVisible()
    await expect(
      within(card).queryByRole('button', { name: /^Notas de/ }),
    ).toBeNull()
  },
}
