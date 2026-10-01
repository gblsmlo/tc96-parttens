import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '@tc96/ui/text'
import { CircleAlertIcon } from 'lucide-react'

function KanbanErrorSurface() {
  return (
    <div className="flex h-144 min-w-0 items-center justify-center p-4">
      <div
        className="flex w-full max-w-sm flex-col items-center gap-2 rounded-2xl border border-border/70 bg-card px-6 py-8 text-center text-card-foreground"
        role="alert"
      >
        <CircleAlertIcon aria-hidden className="size-5 text-muted-foreground" />
        <h2 className="text-sm font-medium">
          Não foi possível carregar o Kanban
        </h2>
        <Text foreground="muted" render={<p />} size="sm">
          Atualize a página para tentar novamente.
        </Text>
      </div>
    </div>
  )
}

const meta = {
  component: KanbanErrorSurface,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/CollectionViews/Views/Kanban/Surfaces Error',
} satisfies Meta<typeof KanbanErrorSurface>

export default meta
type Story = StoryObj<typeof meta>

export const Board: Story = {}
