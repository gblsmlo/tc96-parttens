import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  KanbanCard,
  KanbanCardSkeleton,
  KanbanCardTitle,
  type KanbanColumnData,
  KanbanView,
} from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
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
    color: 'var(--color-blue-500)',
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
    emptyGroupLabel: 'emptyGroupLabel',
    getGroupActions: () => ({ onRecordAdd: ignore, onSettingsOpen: ignore }),
    getKey: (card) => card.id,
    renderRecord: () => (
      <KanbanCard>
        <div className="flex justify-center p-4">
          <KanbanCardTitle>
            <Slot name="renderRecord" />
          </KanbanCardTitle>
        </div>
      </KanbanCard>
    ),
  },
  component: KanbanView<AnatomyCard>,
  decorators: [KanbanCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Kanban/API Reference',
} satisfies Meta<typeof KanbanView<AnatomyCard>>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('region')).toHaveLength(3)
    await expect(canvas.getAllByText('renderRecord')).not.toHaveLength(0)
    await expect(
      canvas.getByRole('button', { name: 'Adicionar item à seção Column' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Configurar seção Column' }),
    ).toBeVisible()
  },
}

export const SkeletonAnatomy: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <KanbanCardSkeleton counts={2} descriptionLines={2} fields={2} menu />
    </div>
  ),
}
