import type { Meta, StoryObj } from '@storybook/react-vite'
import { inbox1ControlArgs } from './inbox-1-controls.ts'
import { ComposedInbox1 } from './inbox-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Inbox/Inbox1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedInbox1 {...inbox1ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Inbox</h1>
        <p className="text-muted-foreground text-sm">
          Entradas sobre tarefas, prazos e movimentações endereçadas a você.
        </p>
      </header>
      <ComposedInbox1 {...inbox1ControlArgs} member />
    </main>
  ),
}
