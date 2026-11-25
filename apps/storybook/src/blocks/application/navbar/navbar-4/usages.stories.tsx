import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar4 } from '@tc96/ui/blocks/application/navbar/navbar-4'
import { useState } from 'react'

const AutomationEditor = () => {
  const [active, setActive] = useState(false)
  const [pending, setPending] = useState(false)
  const [savedText, setSavedText] = useState('Alterações não salvas')
  const [closed, setClosed] = useState(false)

  const save = () => {
    setPending(true)
    window.setTimeout(() => {
      setPending(false)
      setSavedText('Salvo agora')
    }, 300)
  }

  if (closed) return <p className="p-6 text-sm">Editor fechado.</p>

  return (
    <div className="min-h-64">
      <Navbar4
        active={active}
        onActiveChange={setActive}
        onClose={() => setClosed(true)}
        onHistory={() => undefined}
        onSubmit={save}
        onTest={() => undefined}
        pending={pending}
        savedText={savedText}
        title="Cobrança automática de boletos"
      />
      <main className="p-6 text-muted-foreground text-sm">
        {active
          ? 'A automação está ativa e cobra os boletos vencidos.'
          : 'A automação está pausada.'}
      </main>
    </div>
  )
}

const meta = {
  component: AutomationEditor,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar4/Usages',
} satisfies Meta<typeof AutomationEditor>

export default meta

type Story = StoryObj<typeof meta>

export const AutomationEditing: Story = {}

export const Closing: Story = {}
