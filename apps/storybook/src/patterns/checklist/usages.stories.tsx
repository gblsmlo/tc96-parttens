import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ChecklistCanvas } from './checklist-canvas.tsx'
import { authorOptions, dealTasks } from './checklist-data.ts'
import { StatefulChecklist } from './checklist-layouts.tsx'

const meta = {
  decorators: [ChecklistCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Checklist/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const openTask = () => undefined

export const DealTasks: Story = {
  render: () => (
    <StatefulChecklist
      ariaLabel="Tasks"
      authorOptions={authorOptions}
      initialItems={dealTasks()}
      onItemClick={openTask}
      title="Tasks"
    />
  ),
  play: async ({ canvasElement }) => {
    const tasks = within(
      within(canvasElement).getByRole('region', { name: 'Tasks' }),
    )
    await expect(
      tasks.getByRole('button', { name: 'Abrir Ligar amanhã' }),
    ).toBeVisible()
    await expect(tasks.getByText('0 de 3 concluídos')).toBeVisible()
  },
}

export const CompactWithProgress: Story = {
  render: () => (
    <StatefulChecklist
      ariaLabel="Tasks"
      authorOptions={authorOptions}
      density="sm"
      initialItems={dealTasks()}
      onItemClick={openTask}
      progress
      title="Tasks"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('progressbar', { name: '0 de 3 concluídos' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', {
        name: 'Abrir @Deal test Ligue para a monique amanhã',
      }),
    ).toBeVisible()
  },
}

export const ReadOnlyTasks: Story = {
  render: () => (
    <StatefulChecklist
      ariaLabel="Tasks"
      authorOptions={authorOptions}
      initialItems={dealTasks()}
      onItemClick={openTask}
      readOnly
      title="Tasks"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('checkbox')).toHaveLength(3)
    await expect(canvas.getAllByText('Today')).toHaveLength(2)
  },
}
