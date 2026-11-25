import type { Meta, StoryObj } from '@storybook/react-vite'
import { legal2ControlArgs } from './legal-2-controls.ts'
import { ComposedLegal2 } from './legal-2-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal2/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedLegal2 {...legal2ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Consultivo</h1>
        <p className="text-muted-foreground text-sm">
          Contratos ativos e em negociação dos clientes do escritório.
        </p>
      </header>
      <ComposedLegal2 {...legal2ControlArgs} />
    </main>
  ),
}
