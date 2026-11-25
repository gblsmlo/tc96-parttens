import type { Meta, StoryObj } from '@storybook/react-vite'
import { legal5ControlArgs } from './legal-5-controls.ts'
import { ComposedLegal5 } from './legal-5-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal5/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedLegal5 {...legal5ControlArgs} />
    </div>
  ),
}

export const GroupedByPhase: Story = {
  render: () => (
    <div className="p-6">
      <ComposedLegal5 {...legal5ControlArgs} groupBy="phase" />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Casos e processos</h1>
        <p className="text-muted-foreground text-sm">
          Os casos consultivos e os processos judiciais do escritório.
        </p>
      </header>
      <ComposedLegal5 {...legal5ControlArgs} />
    </main>
  ),
}
