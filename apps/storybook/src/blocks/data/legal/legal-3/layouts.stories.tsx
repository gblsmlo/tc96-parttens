import type { Meta, StoryObj } from '@storybook/react-vite'
import { legal3ControlArgs } from './legal-3-controls.ts'
import { ComposedLegal3 } from './legal-3-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal3/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedLegal3 {...legal3ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Agenda do contencioso</h1>
        <p className="text-muted-foreground text-sm">
          Prazos processuais e audiências da equipe.
        </p>
      </header>
      <ComposedLegal3 {...legal3ControlArgs} />
    </main>
  ),
}
