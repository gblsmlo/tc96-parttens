import type { Meta, StoryObj } from '@storybook/react-vite'
import { legal7ControlArgs } from './legal-7-controls.ts'
import { ComposedLegal7 } from './legal-7-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal7/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedLegal7 {...legal7ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Jurídico</h1>
        <p className="text-muted-foreground text-sm">
          Publicações dos diários capturadas para o escritório decidir.
        </p>
      </header>
      <ComposedLegal7 {...legal7ControlArgs} />
    </main>
  ),
}
