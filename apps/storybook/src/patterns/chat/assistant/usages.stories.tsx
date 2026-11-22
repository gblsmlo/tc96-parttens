import type { Meta, StoryObj } from '@storybook/react-vite'
import { type AssistantMessage, AssistantPanel } from '@tc96/parttens'
import { useEffect, useRef, useState } from 'react'
import { expect, within } from 'storybook/test'
import { AssistantCanvas, WorkflowCanvas } from './assistant-frame.tsx'
import { failedMessages, messages, suggestions } from './fixtures/assistant'

const meta = {
  decorators: [AssistantCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Assistant/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const noop = () => {}

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
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const ask = (text: string, answer: string) => {
    setMessages((current) => [
      ...current,
      { id: `u${current.length}`, role: 'user', text },
    ])
    setTyping(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
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
      onAttach={noop}
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

export const Workflow: Story = {
  decorators: [WorkflowCanvas],
  render: () => <WorkflowAssistant />,
  play: async ({ canvasElement }) => {
    const panel = within(canvasElement).getByRole('region', {
      name: 'Assistente',
    })
    await expect(within(panel).getByText('Oi, Gabriel')).toBeVisible()
    for (const suggestion of suggestions) {
      await expect(
        within(panel).getByRole('button', { name: suggestion.label }),
      ).toBeVisible()
    }
  },
}

export const RunInvestigation: Story = {
  render: () => (
    <AssistantPanel
      expanded
      messages={messages}
      onAttach={noop}
      onEnd={noop}
      onExpandedChange={noop}
      onNewChat={noop}
      onSend={noop}
      placement="floating"
    />
  ),
  play: async ({ canvasElement }) => {
    const log = within(canvasElement).getByRole('log', {
      name: 'Mensagens do assistente',
    })
    await expect(
      within(log).getByText(/excedeu o tempo limite de 30 s/),
    ).toBeVisible()
  },
}

export const AnswerFailed: Story = {
  render: () => (
    <AssistantPanel
      messages={failedMessages}
      onEnd={noop}
      onRetry={noop}
      onSend={noop}
      placement="floating"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'Não consegui responder agora.',
    )
  },
}

export const InspectorSidebar: Story = {
  render: () => (
    <div className="ms-auto h-full w-96 border-s">
      <AssistantPanel
        description="Li o passo Enriquecer empresa e as três últimas execuções."
        greeting="Pergunte sobre este passo"
        messages={[]}
        onHistory={noop}
        onNewChat={noop}
        onSend={noop}
        placeholder="Pergunte sobre este passo…"
        suggestions={[
          { id: 'timeout', label: 'Qual tempo limite este passo usa?' },
          { id: 'inputs', label: 'De onde vêm os dados de entrada?' },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Pergunte sobre este passo'),
    ).toBeVisible()
  },
}
