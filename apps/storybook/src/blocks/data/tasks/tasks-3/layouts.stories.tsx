import type { Meta, StoryObj } from '@storybook/react-vite'
import { tasks3ControlArgs } from './tasks-3-controls.ts'
import { ComposedTasks3 } from './tasks-3-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks3/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedTasks3 {...tasks3ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Minha área</h1>
        <p className="text-muted-foreground text-sm">
          As tarefas de todos os projetos, das mais urgentes às que podem
          esperar.
        </p>
      </header>
      <ComposedTasks3 {...tasks3ControlArgs} />
    </main>
  ),
}
