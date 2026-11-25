import type { Meta, StoryObj } from '@storybook/react-vite'
import { AiChat1 } from '@tc96/ui/blocks/ai-agents/ai-chat/ai-chat-1'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  churnQuery,
  copilotAttachActions,
  copilotChips,
  copilotMessages,
  copilotModels,
  copilotStarters,
  copilotThreads,
} from '../fixtures/ai-chat-1.tsx'
import { aiChat1Handlers, CopilotRoom } from './ai-chat-1-layouts.tsx'

const meta = {
  args: {
    attachActions: copilotAttachActions,
    chips: copilotChips,
    messages: copilotMessages,
    model: 'atlas-pro',
    models: copilotModels,
    onAttach: fn(),
    onChipRemove: fn(),
    onCopy: fn(),
    onFeedback: fn(),
    onModelChange: fn(),
    onRegenerate: fn(),
    onSend: fn(),
    onThreadChange: fn(),
    starters: copilotStarters,
    threadId: 'churn-query',
    threads: copilotThreads,
  },
  beforeEach: () => {
    for (const handler of Object.values(aiChat1Handlers)) handler.mockClear()
  },
  component: AiChat1,
  decorators: [
    (Story) => (
      <div className="flex h-svh flex-col">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/AI & Agents/AI Chat/AiChat1/Behavior',
} satisfies Meta<typeof AiChat1>

export default meta

type Story = StoryObj<typeof meta>

const promptOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('textbox', {
    name: 'Mensagem para o assistente',
  })

export const SendingClearsTheDraftAndAddsTheTurn: Story = {
  render: () => <CopilotRoom />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(promptOf(canvasElement), 'Resuma a reunião')
    await userEvent.click(canvas.getByRole('button', { name: 'Enviar' }))
    await expect(aiChat1Handlers.onSend).toHaveBeenCalledWith(
      'Resuma a reunião',
    )
    await expect(promptOf(canvasElement)).toHaveValue('')
    const log = canvas.getByRole('log', { name: 'Conversa com o assistente' })
    await expect(await within(log).findByText('Resuma a reunião')).toBeVisible()
    await expect(
      await within(log).findByText(/Entendi: "Resuma a reunião"/),
    ).toBeVisible()
    await expect(
      within(log).getAllByRole('list', { name: 'Contexto anexado' }).at(-1),
    ).toHaveTextContent('clientes.csvPainel de receita')
    await expect(
      canvasElement.querySelector('[data-slot="ai-chat-chips"]'),
    ).toBeNull()
  },
}

export const EmptyDraftCannotBeSent: Story = {
  play: async ({ args, canvasElement }) => {
    const send = within(canvasElement).getByRole('button', { name: 'Enviar' })
    await expect(send).toBeDisabled()
    await userEvent.type(promptOf(canvasElement), '   ')
    await expect(send).toBeDisabled()
    await expect(args.onSend).not.toHaveBeenCalled()
  },
}

export const StarterPromptSendsIt: Story = {
  args: { messages: [], threadId: undefined },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Código' }))
    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Escreva uma consulta SQL de churn por plano',
      }),
    )
    await expect(args.onSend).toHaveBeenCalledWith(
      'Escreva uma consulta SQL de churn por plano',
    )
  },
}

export const AnswerActionsReportTheMessage: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const [first, second] = canvas.getAllByRole('group', {
      name: 'Ações da resposta de Atlas Pro',
    })
    if (!first || !second) throw new Error('expected two answers')
    await userEvent.click(
      within(first).getByRole('button', { name: 'Copiar resposta' }),
    )
    await expect(args.onCopy).toHaveBeenCalledWith(
      copilotMessages[1]?.text,
      'm2',
    )
    await userEvent.click(
      within(first).getByRole('button', { name: 'Gerar de novo' }),
    )
    await expect(args.onRegenerate).toHaveBeenCalledWith('m2')
    await userEvent.click(
      within(first).getByRole('button', { name: 'Boa resposta' }),
    )
    await expect(args.onFeedback).toHaveBeenCalledWith('m2', 'up')
    const liked = within(second).getByRole('button', { name: 'Boa resposta' })
    await expect(liked).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(liked)
    await expect(args.onFeedback).toHaveBeenLastCalledWith('m4', null)
  },
}

export const CodeCopyPassesOnlyTheCode: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Copiar código' }),
    )
    await expect(args.onCopy).toHaveBeenCalledWith(churnQuery, 'm2')
  },
}

export const ReasoningOpensOnDemand: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Pensou por 6 s' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(
      await canvas.findByText(/O arquivo tem as colunas plano/),
    ).toBeVisible()
  },
}

export const SourcesOpenInANewTab: Story = {
  play: async ({ canvasElement }) => {
    const sources = within(canvasElement).getByRole('list', { name: 'Fontes' })
    const link = within(sources).getByRole('link', {
      name: /Guia de métricas: churn/,
    })
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noreferrer')
  },
}

export const ThreadSwitcherCallsOnThreadChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Consulta de churn por plano',
      }),
    )
    await expect(await screen.findByText('Fixadas')).toBeVisible()
    await userEvent.click(
      screen.getByRole('menuitemradio', { name: 'Política de reembolso' }),
    )
    await expect(args.onThreadChange).toHaveBeenCalledWith('refund-policy')
  },
}

export const ModelMenuCallsOnModelChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: /Atlas Pro/ }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: /Atlas Mini/ }),
    )
    await expect(args.onModelChange).toHaveBeenCalledWith('atlas-mini')
  },
}

export const ChipsAreAddedAndRemoved: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remover clientes.csv' }),
    )
    await expect(args.onChipRemove).toHaveBeenCalledWith('chip-clients')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Anexar contexto' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Página atual' }),
    )
    await expect(args.onAttach).toHaveBeenCalledWith('page')
  },
}

export const ControlsRenderOnlyWithTheirCallbacks: Story = {
  args: {
    attachActions: undefined,
    chips: undefined,
    models: undefined,
    onAttach: undefined,
    onChipRemove: undefined,
    onCopy: undefined,
    onFeedback: undefined,
    onModelChange: undefined,
    onRegenerate: undefined,
    onThreadChange: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of [
      'Copiar resposta',
      'Gerar de novo',
      'Boa resposta',
      'Anexar contexto',
      'Nova conversa',
      'Exportar conversa',
      'Pesquisa na web',
      'Ditado por voz',
    ])
      await expect(canvas.queryByRole('button', { name })).toBeNull()
    await expect(canvas.getByRole('button', { name: 'Enviar' })).toBeVisible()
  },
}

export const StopEndsTheStreamedReply: Story = {
  render: () => <CopilotRoom replyDelay={60} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(promptOf(canvasElement), 'Liste os riscos')
    await userEvent.click(canvas.getByRole('button', { name: 'Enviar' }))
    const stop = await canvas.findByRole('button', { name: 'Parar resposta' })
    await userEvent.click(stop)
    await expect(aiChat1Handlers.onStop).toHaveBeenCalledOnce()
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Enviar' })).toBeVisible(),
    )
  },
}
