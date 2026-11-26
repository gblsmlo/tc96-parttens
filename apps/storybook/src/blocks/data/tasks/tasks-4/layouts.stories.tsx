import type { Meta, StoryObj } from '@storybook/react-vite'
import { tasks4ControlArgs } from './tasks-4-controls.ts'
import { ComposedTasks4 } from './tasks-4-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks4/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="h-svh p-6">
      <ComposedTasks4 {...tasks4ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid h-svh w-full max-w-7xl grid-rows-[auto_minmax(0,1fr)] gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Tarefas</h1>
        <p className="text-muted-foreground text-sm">
          As tarefas de todos os projetos, das mais urgentes às que podem
          esperar.
        </p>
      </header>
      <ComposedTasks4 {...tasks4ControlArgs} />
    </main>
  ),
}
