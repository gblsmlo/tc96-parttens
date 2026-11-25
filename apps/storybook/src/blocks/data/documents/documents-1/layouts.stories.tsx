import type { Meta, StoryObj } from '@storybook/react-vite'
import { documents1ControlArgs } from './documents-1-controls.ts'
import { ComposedDocuments1 } from './documents-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Documents/Documents1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ComposedDocuments1 {...documents1ControlArgs} />
    </div>
  ),
}

export const InWorkspacePage: Story = {
  render: () => (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="font-semibold text-2xl">Documentos</h1>
        <p className="text-muted-foreground text-sm">
          Notas, arquivos, weblinks e páginas que você escreveu ou pode ler.
        </p>
      </header>
      <ComposedDocuments1 {...documents1ControlArgs} />
    </main>
  ),
}
