import type { Meta, StoryObj } from '@storybook/react-vite'
import { crm1ControlArgs } from './crm-1-controls.ts'
import { ComposedCrm1 } from './crm-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/CRM/Crm1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const People: Story = {
  render: () => (
    <div className="p-6">
      <ComposedCrm1 {...crm1ControlArgs} variant="people" />
    </div>
  ),
}

export const Companies: Story = {
  render: () => (
    <div className="p-6">
      <ComposedCrm1 {...crm1ControlArgs} variant="companies" />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Contatos</h1>
        <p className="text-muted-foreground text-sm">
          As pessoas e as empresas com quem o escritório se relaciona.
        </p>
      </header>
      <ComposedCrm1 {...crm1ControlArgs} mode="list" />
    </main>
  ),
}
