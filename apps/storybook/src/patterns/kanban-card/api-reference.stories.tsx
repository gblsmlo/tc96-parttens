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
  KanbanCardTitle,
} from '@tc96/ui/patterns'
import { expect } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { KanbanCardCanvas } from './kanban-card-canvas.tsx'

const meta = {
  component: KanbanCard,
  decorators: [KanbanCardCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/KanbanCard/API Reference',
} satisfies Meta<typeof KanbanCard>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <KanbanCard interactive>
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
