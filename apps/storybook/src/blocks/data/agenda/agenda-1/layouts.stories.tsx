import type { Meta, StoryObj } from '@storybook/react-vite'
import { agenda1ControlArgs } from './agenda-1-controls.ts'
import { ComposedAgenda1 } from './agenda-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Agenda/Agenda1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedAgenda1 {...agenda1ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Agenda da equipe</h1>
        <p className="text-muted-foreground text-sm">
          Compromissos, tarefas e prazos do período, num só calendário.
        </p>
      </header>
      <ComposedAgenda1 {...agenda1ControlArgs} />
    </main>
  ),
}
