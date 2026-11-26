import type { Meta, StoryObj } from '@storybook/react-vite'
import { documents2ControlArgs } from './documents-2-controls.ts'
import { ComposedDocuments2 } from './documents-2-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Documents/Documents2/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="h-svh p-6">
      <ComposedDocuments2 {...documents2ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid h-svh w-full max-w-7xl grid-rows-[auto_minmax(0,1fr)] gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Documentos</h1>
        <p className="text-muted-foreground text-sm">
          Arquivos, notas e links do escritório, com os fixados sempre à mão.
        </p>
      </header>
      <ComposedDocuments2 {...documents2ControlArgs} />
    </main>
  ),
}
