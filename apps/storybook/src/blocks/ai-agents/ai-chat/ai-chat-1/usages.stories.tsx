import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { aiChat1Handlers, CopilotRoom } from './ai-chat-1-layouts.tsx'

const meta = {
  beforeEach: () => {
    for (const handler of Object.values(aiChat1Handlers)) handler.mockClear()
  },
  component: CopilotRoom,
  decorators: [
    (Story) => (
      <div className="flex h-svh flex-col">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/AI & Agents/AI Chat/AiChat1/Usages',
} satisfies Meta<typeof CopilotRoom>

export default meta

type Story = StoryObj<typeof meta>

export const AnalyticsCopilot: Story = {
  args: { replyDelay: 40 },
}

export const NewThreadFromAStarter: Story = {
  args: { conversation: false, replyDelay: 0, withChips: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Aprender' }))
    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Como calcular o LTV de um cliente?',
      }),
    )
    await expect(
      await canvas.findByText(/Entendi: "Como calcular o LTV/),
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Nova conversa' }))
    await expect(
      await canvas.findByText('Como posso ajudar hoje?'),
    ).toBeVisible()
  },
}
