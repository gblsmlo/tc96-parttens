import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AssistantComposer,
  type AssistantMessage,
  AssistantPanel,
  type AssistantSuggestion,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { assistantControlArgs } from './assistant-controls.ts'
import { AssistantCanvas, ComposerCanvas } from './assistant-frame.tsx'
import { ComposedAssistant } from './assistant-layouts.tsx'
import { messages, suggestions } from './fixtures/assistant'

interface BehaviorArgs {
  onAttach: () => void
  onEnd: () => void
  onExpandedChange: (expanded: boolean) => void
  onHistory: () => void
  onNewChat: () => void
  onRetry: (messageId: string) => void
  onSend: (text: string) => void
  onSuggestion: (suggestion: AssistantSuggestion) => void
}

const meta = {
  args: {
    onAttach: fn(),
    onEnd: fn(),
    onExpandedChange: fn(),
    onHistory: fn(),
    onNewChat: fn(),
    onRetry: fn(),
    onSend: fn(),
    onSuggestion: fn(),
  },
  argTypes: {
    onAttach: { control: false },
    onEnd: { control: false },
    onExpandedChange: { control: false },
    onHistory: { control: false },
    onNewChat: { control: false },
    onRetry: { control: false },
    onSend: { control: false },
    onSuggestion: { control: false },
  },
  decorators: [AssistantCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Assistant/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const timeout = 5000

const panel = (canvasElement: HTMLElement, name = 'Assistente') =>
  within(canvasElement).getByRole('region', { name })

const composerInput = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('textbox', {
    name: 'Mensagem para o assistente',
  })

const pointAt = async (element: HTMLElement) => {
  const { height, left, top, width } = element.getBoundingClientRect()
  await userEvent.pointer({
    coords: { clientX: left + width / 2, clientY: top + height / 2 },
    target: element,
  })
}

const pointAway = () =>
  userEvent.pointer({
    coords: { clientX: innerWidth - 8, clientY: innerHeight - 8 },
    target: document.body,
  })

const closeTooltips = async (trigger = document.activeElement) => {
  if (trigger instanceof HTMLElement && trigger.isConnected) {
    await userEvent.unhover(trigger)
  }
  await pointAway()
  await waitFor(
    () =>
      expect(document.querySelector('[data-slot="tooltip-popup"]')).toBeNull(),
    { timeout },
  )
}

const headerActionNames = [
  'Nova conversa',
  'Histórico',
  'Expandir',
  'Minimizar',
  'Encerrar',
]

export const DockedByDefault: Story = {
  render: ({ onSend }) => <AssistantPanel messages={[]} onSend={onSend} />,
  play: async ({ canvasElement }) => {
    const root = panel(canvasElement)
    await expect(root.tagName).toBe('SECTION')
    await expect(root).toHaveAttribute('data-slot', 'assistant-panel')
    await expect(root).toHaveAttribute('data-placement', 'docked')
    await expect(root).toHaveAttribute('data-expanded', 'false')
    await expect(
      within(root).getByRole('heading', { level: 2, name: 'Assistente' }),
    ).toBeVisible()
  },
}

export const FloatingOverItsContainer: Story = {
  render: () => <ComposedAssistant {...assistantControlArgs} expanded />,
  play: async ({ canvasElement }) => {
    const root = panel(canvasElement)
    await expect(root).toHaveAttribute('data-placement', 'floating')
    await expect(root).toHaveAttribute('data-expanded', 'true')
    await expect(getComputedStyle(root).position).toBe('absolute')
    const frame = (root.parentElement as HTMLElement).getBoundingClientRect()
    const box = root.getBoundingClientRect()
    await expect(frame.right - box.right).toBe(16)
    await expect(frame.bottom - box.bottom).toBe(16)
  },
}

export const EmptyStateGreets: Story = {
  render: () => <ComposedAssistant {...assistantControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(panel(canvasElement))
    await expect(canvas.getByText('Oi, Gabriel')).toBeVisible()
    await expect(
      canvas.getByText('Li o fluxo, a última execução e o que você anexar.'),
    ).toBeVisible()
    const list = canvas.getByRole('region', { name: 'Experimente perguntar' })
    await expect(within(list).getAllByRole('button')).toHaveLength(
      suggestions.length,
    )
    await expect(canvas.queryByRole('log')).toBeNull()
  },
}

export const SuggestionCallsOnSuggestion: Story = {
  render: ({ onSuggestion }) => (
    <ComposedAssistant {...assistantControlArgs} onSuggestion={onSuggestion} />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(panel(canvasElement)).getByRole('button', {
        name: 'Quais passos foram pulados?',
      }),
    )
    await expect(args.onSuggestion).toHaveBeenCalledOnce()
    await expect(args.onSuggestion).toHaveBeenLastCalledWith(suggestions[1])
  },
}

export const SuggestionsHiddenWithoutItems: Story = {
  render: () => (
    <ComposedAssistant {...assistantControlArgs} suggestions={false} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(panel(canvasElement))
    await expect(canvas.getByText('Oi, Gabriel')).toBeVisible()
    await expect(canvas.queryByText('Experimente perguntar')).toBeNull()
  },
}

export const MessagesReplaceEmptyState: Story = {
  render: () => (
    <ComposedAssistant {...assistantControlArgs} messages="conversation" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(panel(canvasElement))
    await expect(canvas.queryByText('Oi, Gabriel')).toBeNull()
    await expect(canvas.queryByText('Experimente perguntar')).toBeNull()
    const log = canvas.getByRole('log', { name: 'Mensagens do assistente' })
    await expect(log).toBeVisible()
    await expect(
      within(log).getByText('Dá para aumentar o limite?'),
    ).toBeVisible()
  },
}

export const TypingAfterLastMessage: Story = {
  render: () => (
    <ComposedAssistant
      {...assistantControlArgs}
      messages="conversation"
      typing
    />
  ),
  play: async ({ canvasElement }) => {
    const log = within(panel(canvasElement)).getByRole('log', {
      name: 'Mensagens do assistente',
    })
    const status = await within(log).findByRole('status')
    await expect(status).toHaveTextContent('O assistente está digitando')
    await waitFor(() => expect(status).toBeVisible(), { timeout })
    const lastMessage = within(log).getByText(/Abra o passo, vá em Build/)
    await expect(
      lastMessage.compareDocumentPosition(status) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  },
}

export const FailedAnswerRetries: Story = {
  render: ({ onRetry }) => (
    <ComposedAssistant
      {...assistantControlArgs}
      messages="failed"
      onRetry={onRetry}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(panel(canvasElement))
    const alert = canvas.getByRole('alert')
    await expect(alert).toHaveTextContent('Não consegui responder agora.')
    await expect(alert.closest('[data-slot="chat-message"]')).toHaveAttribute(
      'data-error',
      'true',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar de novo' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
    await expect(args.onRetry).toHaveBeenLastCalledWith('m-error')
  },
}

export const RetryNeedsCallback: Story = {
  render: () => (
    <ComposedAssistant
      {...assistantControlArgs}
      messages="failed"
      retry={false}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(panel(canvasElement))
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Não consegui responder agora.',
    )
    await expect(
      canvas.queryByRole('button', { name: 'Tentar de novo' }),
    ).toBeNull()
  },
}

export const HeaderActionsNeedCallbacks: Story = {
  render: ({ onSend }) => <AssistantPanel messages={[]} onSend={onSend} />,
  play: async ({ canvasElement }) => {
    const canvas = within(panel(canvasElement))
    for (const name of headerActionNames) {
      await expect(canvas.queryByRole('button', { name })).toBeNull()
    }
  },
}

export const HeaderActionsCallCallbacks: Story = {
  render: ({ onEnd, onExpandedChange, onHistory, onNewChat }) => (
    <ComposedAssistant
      {...assistantControlArgs}
      onEnd={onEnd}
      onExpandedChange={onExpandedChange}
      onHistory={onHistory}
      onNewChat={onNewChat}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(panel(canvasElement))
    await userEvent.click(canvas.getByRole('button', { name: 'Nova conversa' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Histórico' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Expandir' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Encerrar' }))
    await closeTooltips()
    await expect(args.onNewChat).toHaveBeenCalledOnce()
    await expect(args.onHistory).toHaveBeenCalledOnce()
    await expect(args.onExpandedChange).toHaveBeenCalledOnce()
    await expect(args.onExpandedChange).toHaveBeenLastCalledWith(true)
    await expect(args.onEnd).toHaveBeenCalledOnce()
  },
}

export const HeaderActionTooltip: Story = {
  render: () => <ComposedAssistant {...assistantControlArgs} />,
  play: async ({ canvasElement }) => {
    const button = within(panel(canvasElement)).getByRole('button', {
      name: 'Histórico',
    })
    await pointAt(button)
    await waitFor(
      () =>
        expect(
          document.querySelector('[data-slot="tooltip-popup"]'),
        ).toHaveTextContent('Histórico'),
      { timeout },
    )
    await closeTooltips(button)
  },
}

export const CompactTogglesToExpand: Story = {
  render: ({ onExpandedChange }) => (
    <ComposedAssistant
      {...assistantControlArgs}
      messages="conversation"
      onExpandedChange={onExpandedChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const root = panel(canvasElement)
    await expect(root).toHaveAttribute('data-expanded', 'false')
    await expect(
      within(root).queryByRole('button', { name: 'Minimizar' }),
    ).toBeNull()
    await userEvent.click(
      within(root).getByRole('button', { name: 'Expandir' }),
    )
    await closeTooltips()
    await expect(args.onExpandedChange).toHaveBeenCalledOnce()
    await expect(args.onExpandedChange).toHaveBeenLastCalledWith(true)
  },
}

export const ExpandedTogglesToMinimize: Story = {
  render: ({ onExpandedChange }) => (
    <ComposedAssistant
      {...assistantControlArgs}
      expanded
      messages="conversation"
      onExpandedChange={onExpandedChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const root = panel(canvasElement)
    await expect(root).toHaveAttribute('data-expanded', 'true')
    await expect(
      within(root).queryByRole('button', { name: 'Expandir' }),
    ).toBeNull()
    await userEvent.click(
      within(root).getByRole('button', { name: 'Minimizar' }),
    )
    await closeTooltips()
    await expect(args.onExpandedChange).toHaveBeenCalledOnce()
    await expect(args.onExpandedChange).toHaveBeenLastCalledWith(false)
  },
}

export const DefaultCopy: Story = {
  render: ({ onSend }) => <AssistantPanel messages={[]} onSend={onSend} />,
  play: async ({ canvasElement }) => {
    const canvas = within(panel(canvasElement))
    await expect(canvas.getByText('Beta')).toBeVisible()
    await expect(
      canvas.getByText(
        'As respostas podem estar erradas. Confira antes de publicar.',
      ),
    ).toBeVisible()
    await expect(composerInput(canvasElement)).toHaveAttribute(
      'placeholder',
      'Pergunte sobre este fluxo…',
    )
  },
}

export const BadgeHidden: Story = {
  render: () => <ComposedAssistant {...assistantControlArgs} badge={false} />,
  play: async ({ canvasElement }) => {
    await expect(within(panel(canvasElement)).queryByText('Beta')).toBeNull()
  },
}

export const LabelsOverrideDefaults: Story = {
  render: ({ onSend }) => (
    <AssistantPanel
      labels={{ send: 'Mandar', title: 'Copiloto' }}
      messages={[]}
      onSend={onSend}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = panel(canvasElement, 'Copiloto')
    await expect(root).toBeVisible()
    await expect(
      within(root).getByRole('button', { name: 'Mandar' }),
    ).toBeVisible()
    await expect(
      within(root).getByRole('textbox', { name: 'Mensagem para o assistente' }),
    ).toBeVisible()
  },
}

export const EnterSendsAndClears: Story = {
  render: ({ onSend }) => (
    <ComposedAssistant
      {...assistantControlArgs}
      messages="conversation"
      onSend={onSend}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const input = composerInput(canvasElement)
    await userEvent.type(input, 'Rascunhe um resumo{Enter}')
    await expect(args.onSend).toHaveBeenCalledOnce()
    await expect(args.onSend).toHaveBeenLastCalledWith('Rascunhe um resumo')
    await expect(input).toHaveValue('')
  },
}

export const ShiftEnterBreaksLine: Story = {
  decorators: [ComposerCanvas],
  render: ({ onSend }) => <AssistantComposer onSend={onSend} />,
  play: async ({ args, canvasElement }) => {
    const input = composerInput(canvasElement)
    await userEvent.type(input, 'Primeira{Shift>}{Enter}{/Shift}Segunda')
    await expect(input).toHaveValue('Primeira\nSegunda')
    await expect(args.onSend).not.toHaveBeenCalled()
  },
}

export const SendTrimsAndClears: Story = {
  decorators: [ComposerCanvas],
  render: ({ onSend }) => <AssistantComposer onSend={onSend} />,
  play: async ({ args, canvasElement }) => {
    const input = composerInput(canvasElement)
    await userEvent.type(input, '  Por que falhou?  ')
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Enviar' }),
    )
    await expect(args.onSend).toHaveBeenCalledOnce()
    await expect(args.onSend).toHaveBeenLastCalledWith('Por que falhou?')
    await expect(input).toHaveValue('')
  },
}

export const SendDisabledWhileEmpty: Story = {
  decorators: [ComposerCanvas],
  render: ({ onSend }) => <AssistantComposer onSend={onSend} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Enviar' }),
    ).toBeDisabled()
  },
}

export const BlankDraftSendsNothing: Story = {
  decorators: [ComposerCanvas],
  render: ({ onSend }) => <AssistantComposer onSend={onSend} />,
  play: async ({ args, canvasElement }) => {
    await userEvent.type(composerInput(canvasElement), '   {Enter}')
    await expect(args.onSend).not.toHaveBeenCalled()
  },
}

export const AttachHiddenWithoutCallback: Story = {
  decorators: [ComposerCanvas],
  render: ({ onSend }) => <AssistantComposer onSend={onSend} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Anexar contexto' }),
    ).toBeNull()
  },
}

export const AttachCallsOnAttach: Story = {
  decorators: [ComposerCanvas],
  render: ({ onAttach, onSend }) => (
    <AssistantComposer onAttach={onAttach} onSend={onSend} />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Anexar contexto' }),
    )
    await closeTooltips()
    await expect(args.onAttach).toHaveBeenCalledOnce()
  },
}

export const PlaceholderFromProp: Story = {
  decorators: [ComposerCanvas],
  render: ({ onSend }) => (
    <AssistantComposer onSend={onSend} placeholder="Pergunte algo" />
  ),
  play: async ({ canvasElement }) => {
    await expect(composerInput(canvasElement)).toHaveAttribute(
      'placeholder',
      'Pergunte algo',
    )
  },
}

export const EmptyStateReturnsWhenCleared: Story = {
  render: function ClearedConversation({ onNewChat, onSend }) {
    const [current, setCurrent] =
      useState<readonly AssistantMessage[]>(messages)
    return (
      <AssistantPanel
        greeting="Oi, Gabriel"
        messages={current}
        onNewChat={() => {
          onNewChat()
          setCurrent([])
        }}
        onSend={onSend}
        placement="floating"
        suggestions={suggestions}
      />
    )
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(panel(canvasElement))
    await expect(
      canvas.getByRole('log', { name: 'Mensagens do assistente' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Oi, Gabriel')).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Nova conversa' }))
    await closeTooltips()
    await expect(args.onNewChat).toHaveBeenCalledOnce()
    await expect(canvas.getByText('Oi, Gabriel')).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Experimente perguntar' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('log')).toBeNull()
  },
}
