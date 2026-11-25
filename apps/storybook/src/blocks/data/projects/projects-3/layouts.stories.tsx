import type { Meta, StoryObj } from '@storybook/react-vite'
import { projects3ControlArgs } from './projects-3-controls.ts'
import { ComposedProjects3 } from './projects-3-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Projects/Projects3/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedProjects3 {...projects3ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Tarefas da equipe</h1>
        <p className="text-muted-foreground text-sm">
          O que cada pessoa tem para fazer, com as subtarefas de cada entrega.
        </p>
      </header>
      <ComposedProjects3 {...projects3ControlArgs} />
    </main>
  ),
}
