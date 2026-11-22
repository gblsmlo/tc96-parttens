import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  KanbanCard,
  KanbanCardAction,
  KanbanCardBody,
  KanbanCardControl,
  KanbanCardDescription,
  KanbanCardField,
  KanbanCardFieldLabel,
  KanbanCardFieldValue,
  KanbanCardFooter,
  KanbanCardHeader,
  KanbanCardOpenTrigger,
  KanbanCardSkeleton,
  KanbanCardTitle,
  type KanbanColumnData,
  KanbanView,
} from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { Slot } from '../../../../test-utils/anatomy-slot'
import { KanbanCanvas } from './kanban-canvas.tsx'

interface AnatomyCard {
  id: string
}

const anatomyColumns: KanbanColumnData<AnatomyCard>[] = [
  {
    cards: [{ id: 'card-1' }, { id: 'card-2' }],
    count: 2,
    id: 'first',
    title: 'Column',
  },
  {
    cards: [{ id: 'card-3' }],
    color: '#3b82f6',
    count: 1,
    id: 'second',
    title: 'Column with color',
  },
  { cards: [], count: 0, id: 'third', title: 'Empty column' },
]

const ignore = () => undefined

const meta = {
  args: {
    columns: anatomyColumns,
    emptyColumnLabel: 'emptyColumnLabel',
    getColumnActions: () => ({ onAddCard: ignore, onOpenSettings: ignore }),
    getKey: (card) => card.id,
    renderCard: () => (
      <KanbanCard>
        <div className="flex justify-center p-4">
          <KanbanCardTitle>
            <Slot name="renderCard" />
          </KanbanCardTitle>
        </div>
      </KanbanCard>
    ),
  },
  component: KanbanView<AnatomyCard>,
  decorators: [KanbanCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Collection/Layouts/Kanban/API Reference',
} satisfies Meta<typeof KanbanView<AnatomyCard>>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('region')).toHaveLength(3)
    await expect(canvas.getAllByText('renderCard')).not.toHaveLength(0)
    await expect(
      canvas.getByRole('button', { name: 'Adicionar item à seção Column' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Configurar seção Column' }),
    ).toBeVisible()
  },
}

export const CardAnatomy: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <KanbanCard variant="interactive">
        <KanbanCardOpenTrigger aria-label="OpenTrigger" />
        <KanbanCardHeader>
          <KanbanCardTitle>
            <Slot name="Title" />
          </KanbanCardTitle>
          <KanbanCardDescription>
            <Slot name="Description" />
          </KanbanCardDescription>
          <KanbanCardAction>
            <Slot name="Action" />
          </KanbanCardAction>
        </KanbanCardHeader>
        <KanbanCardBody>
          <KanbanCardField>
            <KanbanCardFieldLabel>
              <Slot name="FieldLabel" />
            </KanbanCardFieldLabel>
            <KanbanCardFieldValue>
              <Slot name="FieldValue" />
            </KanbanCardFieldValue>
          </KanbanCardField>
        </KanbanCardBody>
        <KanbanCardFooter>
          <KanbanCardControl>
            <Slot name="Control" />
          </KanbanCardControl>
        </KanbanCardFooter>
      </KanbanCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      [...canvasElement.querySelectorAll('[data-slot^="kanban-card-"]')].map(
        (node) => node.getAttribute('data-slot'),
      ),
    ).toEqual([
      'kanban-card-open-trigger',
      'kanban-card-field',
      'kanban-card-field-label',
      'kanban-card-field-value',
      'kanban-card-control',
    ])
  },
}

export const SkeletonAnatomy: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <KanbanCardSkeleton counts={2} descriptionLines={2} fields={2} menu />
    </div>
  ),
}
