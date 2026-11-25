import type { Meta, StoryObj } from '@storybook/react-vite'
import { legal6ControlArgs } from './legal-6-controls.ts'
import { ComposedLegal6 } from './legal-6-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal6/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedLegal6 {...legal6ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Prazos do contencioso</h1>
        <p className="text-muted-foreground text-sm">
          As filas de prazos processuais da equipe.
        </p>
      </header>
      <ComposedLegal6 {...legal6ControlArgs} view="all" />
    </main>
  ),
}
