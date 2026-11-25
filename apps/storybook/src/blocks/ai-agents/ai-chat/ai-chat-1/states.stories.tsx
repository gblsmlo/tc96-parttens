import type { Meta, StoryObj } from '@storybook/react-vite'
import { AiChat1 } from '@tc96/ui/blocks/ai-agents/ai-chat/ai-chat-1'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  copilotMessages,
  copilotModels,
  copilotStarters,
  copilotThreads,
} from '../fixtures/ai-chat-1.tsx'

const meta = {
  args: {
    messages: copilotMessages,
    models: copilotModels,
    onRetry: fn(),
    onSend: fn(),
    onStop: fn(),
    starters: copilotStarters,
    threadId: 'churn-query',
    threads: copilotThreads,
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
  title: 'Blocks/AI & Agents/AI Chat/AiChat1/States',
} satisfies Meta<typeof AiChat1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('log', {
        name: 'Conversa com o assistente',
      }),
    ).toBeVisible()
  },
}

export const Starter: Story = {
  args: { messages: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Como posso ajudar hoje?'),
    ).toBeVisible()
  },
}

export const Responding: Story = {
  args: {
    messages: copilotMessages.slice(0, 3),
    responding: true,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('O assistente está respondendo'),
    ).toBeInTheDocument()
    await expect(
      canvas.queryByRole('button', { name: 'Enviar' }),
    ).not.toBeInTheDocument()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Parar resposta' }),
    )
    await expect(args.onStop).toHaveBeenCalledOnce()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando conversa')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.getByRole('button', { name: 'Enviar' })).toBeDisabled()
  },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar a conversa'),
    ).toBeVisible()
    await expect(
      canvas.queryByRole('textbox', { name: 'Mensagem para o assistente' }),
    ).not.toBeInTheDocument()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
