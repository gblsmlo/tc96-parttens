import type { Meta, StoryObj } from '@storybook/react-vite'
import { finance3ControlArgs } from './finance-3-controls.ts'
import { ComposedFinance3 } from './finance-3-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Finance/Finance3/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Entries: Story = {
  render: () => (
    <div className="p-6">
      <ComposedFinance3 {...finance3ControlArgs} variant="entries" />
    </div>
  ),
}

export const Receivables: Story = {
  render: () => (
    <div className="p-6">
      <ComposedFinance3 {...finance3ControlArgs} variant="receivables" />
    </div>
  ),
}

export const Statement: Story = {
  render: () => (
    <div className="p-6">
      <ComposedFinance3 {...finance3ControlArgs} variant="statement" />
    </div>
  ),
}

export const ClientMoney: Story = {
  render: () => (
    <div className="p-6">
      <ComposedFinance3 {...finance3ControlArgs} variant="clientMoney" />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Financeiro</h1>
        <p className="text-muted-foreground text-sm">
          Os lançamentos, a fila de cobrança e os extratos do escritório.
        </p>
      </header>
      <ComposedFinance3 {...finance3ControlArgs} />
    </main>
  ),
}
