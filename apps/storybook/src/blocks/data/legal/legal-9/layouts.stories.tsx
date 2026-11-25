import type { Meta, StoryObj } from '@storybook/react-vite'
import { legal9ControlArgs } from './legal-9-controls.ts'
import { ComposedLegal9 } from './legal-9-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal9/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedLegal9 {...legal9ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Contratos de honorários</h1>
        <p className="text-muted-foreground text-sm">
          Os contratos que o escritório firmou com pessoas e empresas.
        </p>
      </header>
      <ComposedLegal9 {...legal9ControlArgs} />
    </main>
  ),
}
