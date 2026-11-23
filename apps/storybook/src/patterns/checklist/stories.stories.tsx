import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChecklistCanvas } from './checklist-canvas.tsx'
import {
  type ChecklistControls,
  checklistControlArgs,
  checklistControlArgTypes,
} from './checklist-controls.ts'
import { ComposedChecklist } from './checklist-layouts.tsx'

const meta = {
  args: checklistControlArgs,
  argTypes: checklistControlArgTypes,
  decorators: [ChecklistCanvas],
  parameters: {
    controls: {
      exclude: ['density', 'empty', 'openable', 'readOnly', 'variant'],
    },
  },
  render: (args) => <ComposedChecklist {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Checklist/Stories',
} satisfies Meta<ChecklistControls>

export default meta

type Story = StoryObj<ChecklistControls>

export const Default: Story = {}

export const DensitySm: Story = {
  args: { density: 'sm' },
  name: 'Density sm',
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}

export const Empty: Story = {
  args: { empty: true },
}

export const Card: Story = {
  args: { variant: 'card' },
}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const OnlyTrigger: Story = {
  args: {
    addLabel: 'Adicionar subtarefas',
    empty: true,
    title: 'Subtarefas',
    variant: 'trigger',
  },
  name: 'Only Trigger',
}
