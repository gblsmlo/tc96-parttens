import type { Meta, StoryObj } from '@storybook/react-vite'
import { crm2ControlArgs } from './crm-2-controls.ts'
import { ComposedCrm2 } from './crm-2-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/CRM/Crm2/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Board: Story = {
  render: () => (
    <div className="p-6">
      <ComposedCrm2 {...crm2ControlArgs} />
    </div>
  ),
}

export const Table: Story = {
  render: () => (
    <div className="p-6">
      <ComposedCrm2 {...crm2ControlArgs} mode="table" />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Funil de vendas</h1>
        <p className="text-muted-foreground text-sm">
          Os leads abertos da equipe comercial, por etapa do funil.
        </p>
      </header>
      <ComposedCrm2 {...crm2ControlArgs} />
    </main>
  ),
}
