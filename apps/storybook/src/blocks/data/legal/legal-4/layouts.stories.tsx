import type { Meta, StoryObj } from '@storybook/react-vite'
import { legal4ControlArgs } from './legal-4-controls.ts'
import { ComposedLegal4 } from './legal-4-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal4/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedLegal4 {...legal4ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Carteira de clientes</h1>
        <p className="text-muted-foreground text-sm">
          Pessoas e empresas atendidas pelo escritório.
        </p>
      </header>
      <ComposedLegal4 {...legal4ControlArgs} />
    </main>
  ),
}
