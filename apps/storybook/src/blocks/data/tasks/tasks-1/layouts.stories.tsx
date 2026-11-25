import type { Meta, StoryObj } from '@storybook/react-vite'
import { tasks1ControlArgs } from './tasks-1-controls.ts'
import { ComposedTasks1 } from './tasks-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedTasks1 {...tasks1ControlArgs} />
    </div>
  ),
}

export const GroupedByStatus: Story = {
  render: () => (
    <div className="p-6">
      <ComposedTasks1 {...tasks1ControlArgs} groupBy="status" />
    </div>
  ),
}

export const GroupedByPriority: Story = {
  render: () => (
    <div className="p-6">
      <ComposedTasks1 {...tasks1ControlArgs} groupBy="priority" />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Minhas tarefas</h1>
        <p className="text-muted-foreground text-sm">
          Tudo o que está com você e com a equipe, de todos os projetos.
        </p>
      </header>
      <ComposedTasks1 {...tasks1ControlArgs} />
    </main>
  ),
}
