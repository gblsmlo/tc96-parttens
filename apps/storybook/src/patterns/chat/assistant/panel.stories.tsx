import type { Meta, StoryObj } from '@storybook/react-vite'
import { AssistantPanel } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const suggestions = [
  { id: 'failed', label: 'Por que o passo falhou?' },
  { id: 'skipped', label: 'Quais passos foram pulados?' },
]

const meta = {
  args: { messages: [], onSend: fn() },
  component: AssistantPanel,
  decorators: [
    (Story) => (
      <div className="relative h-176 w-[56rem] max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Assistant/Panel',
} satisfies Meta<typeof AssistantPanel>

export default meta
type Story = StoryObj<typeof meta>

const panel = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('region', { name: 'Assistente' })

export const DockedRegionByDefault: Story = {
  play: async ({ canvasElement }) => {
    await expect(panel(canvasElement)).toHaveAttribute(
      'data-placement',
      'docked',
    )
    await expect(panel(canvasElement).querySelector('h2')?.textContent).toBe(
      'Assistente',
    )
  },
}

export const FloatingExpandedReachRoot: Story = {
  args: { expanded: true, placement: 'floating' },
  play: async ({ canvasElement }) => {
    const root = panel(canvasElement)
    await expect(root).toHaveAttribute('data-placement', 'floating')
    await expect(root).toHaveAttribute('data-expanded', 'true')
    await expect(root.className).toContain('absolute')
  },
}

export const EmptyShowsGreetingAndSuggestions: Story = {
  args: {
    description: 'Li o fluxo.',
    greeting: 'Oi, Gabriel',
    onSuggestion: fn(),
    suggestions,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Oi, Gabriel')).toBeVisible()
    await expect(canvas.getByText('Li o fluxo.')).toBeVisible()
    await expect(canvas.queryByRole('log')).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: /pulados/ }))
    await expect(args.onSuggestion).toHaveBeenCalledWith(suggestions[1])
  },
}

export const SuggestionsHiddenWithoutItems: Story = {
  args: { greeting: 'Oi' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByText('Experimente perguntar'),
    ).toBeNull()
  },
}

export const MessagesReplaceEmptyState: Story = {
  args: {
    greeting: 'Oi, Gabriel',
    messages: [
      { id: '1', role: 'user', text: 'Por que falhou?' },
      { id: '2', role: 'assistant', text: 'Timeout no passo.' },
    ],
    suggestions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('Oi, Gabriel')).toBeNull()
    await expect(
      canvas.getByRole('log', { name: 'Mensagens do assistente' }),
    ).toBeVisible()
    await expect(canvas.getByText('Timeout no passo.')).toBeVisible()
  },
}

export const TypingStatusIsNamed: Story = {
  args: { typing: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement)
        .getAllByRole('status')
        .some((node) => node.textContent === 'O assistente está digitando'),
    ).toBe(true)
  },
}

export const ErroredMessageRetries: Story = {
  args: {
    messages: [
      {
        error: true,
        id: 'e1',
        role: 'assistant',
        text: 'Falhou ao responder.',
      },
    ],
    onRetry: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Falhou ao responder.',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar de novo' }),
    )
    await expect(args.onRetry).toHaveBeenCalledWith('e1')
  },
}

export const HeaderActionsHiddenWithoutCallbacks: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Nova conversa' }),
    ).toBeNull()
  },
}

export const HeaderActionsCallCallbacks: Story = {
  args: {
    expanded: false,
    onEnd: fn(),
    onExpandedChange: fn(),
    onNewChat: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Nova conversa' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Expandir' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Encerrar' }))
    await expect(args.onNewChat).toHaveBeenCalledTimes(1)
    await expect(args.onExpandedChange).toHaveBeenCalledWith(true)
    await expect(args.onEnd).toHaveBeenCalledTimes(1)
  },
}

export const ExpandedTogglesToMinimize: Story = {
  args: { expanded: true, onExpandedChange: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Minimizar' }),
    )
    await expect(args.onExpandedChange).toHaveBeenCalledWith(false)
  },
}

export const BadgeAndFixedDisclaimer: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Beta')).toBeVisible()
    await expect(
      canvas.getByText(
        'As respostas podem estar erradas. Confira antes de publicar.',
      ),
    ).toBeVisible()
  },
}

export const BadgeHidden: Story = {
  args: { badge: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByText('Beta')).toBeNull()
  },
}

export const LabelsOverrideDefaults: Story = {
  args: { labels: { title: 'Copiloto' } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Copiloto' }),
    ).toBeVisible()
  },
}
