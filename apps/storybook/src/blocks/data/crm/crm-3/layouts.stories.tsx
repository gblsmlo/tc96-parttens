import type { Meta, StoryObj } from '@storybook/react-vite'
import { crm3ControlArgs } from './crm-3-controls.ts'
import { ComposedCrm3 } from './crm-3-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/CRM/Crm3/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Board: Story = {
  render: () => (
    <div className="h-svh p-6">
      <ComposedCrm3 {...crm3ControlArgs} />
    </div>
  ),
}

export const Table: Story = {
  render: () => (
    <div className="h-svh p-6">
      <ComposedCrm3 {...crm3ControlArgs} mode="table" />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid h-svh w-full max-w-7xl grid-rows-[auto_minmax(0,1fr)] gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Funil de vendas</h1>
        <p className="text-muted-foreground text-sm">
          Os leads abertos da equipe comercial, por etapa do funil.
        </p>
      </header>
      <ComposedCrm3 {...crm3ControlArgs} />
    </main>
  ),
}
