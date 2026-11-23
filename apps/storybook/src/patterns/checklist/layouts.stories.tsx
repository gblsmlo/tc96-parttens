import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChecklistCanvas } from './checklist-canvas.tsx'
import { checklistControlArgs } from './checklist-controls.ts'
import { ComposedChecklist } from './checklist-layouts.tsx'

const meta = {
  decorators: [ChecklistCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Checklist/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutTitle: Story = {
  render: () => (
    <ComposedChecklist {...checklistControlArgs} title="" variant="card" />
  ),
}

export const WithoutMetadata: Story = {
  render: () => (
    <ComposedChecklist
      {...checklistControlArgs}
      author={false}
      dueDate={false}
    />
  ),
}

export const WithFeedback: Story = {
  render: () => (
    <ComposedChecklist
      {...checklistControlArgs}
      feedback="Não foi possível salvar a última alteração."
    />
  ),
}

export const TitlesAsButtons: Story = {
  render: () => <ComposedChecklist {...checklistControlArgs} openable />,
}
