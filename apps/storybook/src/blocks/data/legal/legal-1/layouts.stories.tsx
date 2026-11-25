import type { Meta, StoryObj } from '@storybook/react-vite'
import { legal1ControlArgs } from './legal-1-controls.ts'
import { ComposedLegal1 } from './legal-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedLegal1 {...legal1ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Contencioso</h1>
        <p className="text-muted-foreground text-sm">
          Carteira de processos do núcleo cível e trabalhista.
        </p>
      </header>
      <ComposedLegal1 {...legal1ControlArgs} />
    </main>
  ),
}
