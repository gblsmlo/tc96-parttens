import type { Meta, StoryObj } from '@storybook/react-vite'
import { type AssistantMessage, AssistantPanel } from '@tc96/parttens'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { suggestions } from '../fixtures/assistant'

const answers: Record<string, string> = {
  'why-failed':
    'A chamada ao provedor de dados excedeu o tempo limite de 30 s. O passo tentou duas vezes e foi marcado como falho.',
  skipped:
    'Foram pulados Atualizar CRM e Notificar o time, que dependem do passo que falhou.',
  summary:
    'A execução começou às 14:00, concluiu 3 de 6 passos, falhou em Enriquecer empresa e pulou os 2 seguintes.',
}

function WorkflowAssistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [typing, setTyping] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [open, setOpen] = useState(true)

  const ask = (text: string, answer: string) => {
    setMessages((current) => [
      ...current,
      { id: `u${current.length}`, role: 'user', text },
    ])
    setTyping(true)
    setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: `a${current.length}`, role: 'assistant', text: answer },
      ])
      setTyping(false)
    }, 300)
  }

  if (!open) return null

  return (
    <AssistantPanel
      description="Li o fluxo Roteamento de leads, a última execução e o que você anexar."
      expanded={expanded}
      greeting="Oi, Gabriel"
      messages={messages}
      onAttach={() => {}}
      onEnd={() => setOpen(false)}
      onExpandedChange={setExpanded}
      onNewChat={() => setMessages([])}
      onSend={(text) =>
        ask(text, 'Ainda não sei responder isso, mas posso ler o log do passo.')
      }
      onSuggestion={(suggestion) =>
        ask(suggestion.label, answers[suggestion.id] ?? '')
      }
      placement="floating"
      suggestions={suggestions}
      typing={typing}
    />
  )
}

const meta = {
  component: WorkflowAssistant,
  decorators: [
    (Story) => (
      <div className="relative h-176 w-[56rem] max-w-full rounded-xl border border-dashed">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Assistant/Usages/Workflow',
} satisfies Meta<typeof WorkflowAssistant>

export default meta

type Story = StoryObj<typeof meta>

export const Workflow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Quais passos foram pulados?' }),
    )
    await waitFor(() =>
      expect(canvas.getByText(/Foram pulados Atualizar CRM/)).toBeVisible(),
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Nova conversa' }))
    await expect(canvas.getByText('Oi, Gabriel')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Encerrar' }))
    await expect(canvas.queryByRole('region')).toBeNull()
  },
}
