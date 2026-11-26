import type { Meta, StoryObj } from '@storybook/react-vite'
import { finance4ControlArgs } from './finance-4-controls.ts'
import { ComposedFinance4 } from './finance-4-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Finance/Finance4/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="h-svh p-6">
      <ComposedFinance4 {...finance4ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid h-svh w-full max-w-7xl grid-rows-[auto_minmax(0,1fr)] gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Financeiro</h1>
        <p className="text-muted-foreground text-sm">
          Honorários, despesas e valores de clientes de todos os processos do
          escritório.
        </p>
      </header>
      <ComposedFinance4 {...finance4ControlArgs} />
    </main>
  ),
}
