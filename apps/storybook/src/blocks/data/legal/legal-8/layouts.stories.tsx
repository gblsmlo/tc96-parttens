import type { Meta, StoryObj } from '@storybook/react-vite'
import { legal8ControlArgs } from './legal-8-controls.ts'
import { ComposedLegal8 } from './legal-8-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal8/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedLegal8 {...legal8ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Monitoramento</h1>
        <p className="text-muted-foreground text-sm">
          Captura de publicações e andamentos nos tribunais.
        </p>
      </header>
      <ComposedLegal8 {...legal8ControlArgs} stopped view="failures" />
    </main>
  ),
}
