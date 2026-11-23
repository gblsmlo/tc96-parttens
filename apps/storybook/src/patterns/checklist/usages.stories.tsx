import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ChecklistCanvas } from './checklist-canvas.tsx'
import { authorOptions, dealTasks, subtaskItems } from './checklist-data.ts'
import { StatefulChecklist, useStatusFilter } from './checklist-layouts.tsx'

const meta = {
  decorators: [ChecklistCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Checklist/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const openTask = () => undefined

const DealTasksChecklist = ({ readOnly = false }: { readOnly?: boolean }) => {
  const status = useStatusFilter('Filtrar tasks')

  return (
    <StatefulChecklist
      addLabel="Adicionar task"
      ariaLabel="Tasks"
      authorOptions={authorOptions}
      density={readOnly ? 'md' : 'sm'}
      filter={status.filter}
      initialItems={dealTasks()}
      onItemClick={openTask}
      readOnly={readOnly}
      title="Tasks"
      variant="complete"
      visibleItems={status.visibleItems}
    />
  )
}

export const DealTasks: Story = {
  render: () => <DealTasksChecklist />,
  play: async ({ canvasElement }) => {
    const tasks = within(
      within(canvasElement).getByRole('region', { name: /^Tasks/ }),
    )
    await expect(
      tasks.getByRole('button', { name: 'Abrir Ligar amanhã' }),
    ).toBeVisible()
    await expect(tasks.getByText('0/3')).toBeVisible()
    await expect(
      tasks.getByRole('button', { name: 'Filtrar tasks' }),
    ).toBeVisible()
    await expect(
      tasks.getByRole('button', { name: 'Adicionar task' }),
    ).toBeEnabled()
  },
}

export const ReadOnlyTasks: Story = {
  render: () => <DealTasksChecklist readOnly />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('checkbox')).toHaveLength(3)
    await expect(canvas.getAllByText('Today')).toHaveLength(2)
    await expect(
      canvas.getByRole('button', { name: 'Filtrar tasks' }),
    ).toBeEnabled()
    await expect(
      canvas.getByRole('button', { name: 'Adicionar task' }),
    ).toBeDisabled()
  },
}

const SubtasksChecklist = () => {
  const status = useStatusFilter('Filtrar subtarefas')

  return (
    <StatefulChecklist
      addLabel="Adicionar subtarefas"
      ariaLabel="Subtarefas"
      authorOptions={authorOptions}
      filter={status.filter}
      initialItems={subtaskItems}
      title="Subtarefas"
      variant="complete"
      visibleItems={status.visibleItems}
    />
  )
}

export const Subtasks: Story = {
  render: () => <SubtasksChecklist />,
  play: async ({ canvasElement }) => {
    const group = within(
      within(canvasElement).getByRole('region', { name: /^Subtarefas/ }),
    )
    await expect(group.getByText('2/6')).toBeVisible()
    await expect(
      group.getByRole('checkbox', { name: 'Criar o endpoint de validação' }),
    ).toBeChecked()
    await expect(
      group.getByRole('button', { name: 'Filtrar subtarefas' }),
    ).toBeVisible()
    await expect(
      group.getByRole('button', { name: 'Adicionar subtarefas' }),
    ).toBeVisible()
  },
}
