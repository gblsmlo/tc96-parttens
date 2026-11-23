import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checklist } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { ChecklistCanvas } from './checklist-canvas.tsx'
import { behaviorItems } from './checklist-data.ts'

const ignore = () => undefined

const meta = {
  args: {
    ariaLabel: 'Checklist',
    feedback: <p className="text-muted-foreground text-sm">feedback</p>,
    items: [
      { ...behaviorItems[0], authorId: null, dueDate: null },
      behaviorItems[1],
    ],
    newItemTitle: '',
    onCreate: ignore,
    onItemCompletionChange: ignore,
    onItemDelete: ignore,
    onItemMove: ignore,
    onItemRename: ignore,
    onNewItemTitleChange: ignore,
    title: 'title',
  },
  component: Checklist,
  decorators: [ChecklistCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Checklist/API Reference',
} satisfies Meta<typeof Checklist>

export default meta

type Story = StoryObj<typeof meta>

const anatomySlots = [
  'checklist',
  'checklist-header',
  'checklist-count',
  'checklist-count-ring',
  'card',
  'checklist-items',
  'checklist-item',
  'checklist-drag-handle',
  'checklist-row',
  'checklist-title',
  'checklist-actions',
  'checklist-delete',
  'checklist-draft-item',
]

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    for (const slot of anatomySlots) {
      await expect(
        canvasElement.querySelector(`[data-slot="${slot}"]`),
      ).not.toBeNull()
    }
    await expect(within(canvasElement).getByText('feedback')).toBeVisible()
  },
}
