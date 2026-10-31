import type { Meta, StoryObj } from '@storybook/react-vite'
import { TrendIndicator } from '@tc96/parttens'
import { expect } from 'storybook/test'

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Shared/Trend Indicator',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AnnouncesDirection: Story = {
  play: async ({ canvasElement }) => {
    const indicators = [
      ...canvasElement.querySelectorAll('[data-slot="trend-indicator"]'),
    ]
    await expect(
      indicators.map((node) => node.getAttribute('data-direction')),
    ).toEqual(['up', 'down', 'flat'])
    await expect(indicators.map((node) => node.textContent)).toEqual([
      'Alta de 0.44%',
      'Queda de 0.18%',
      'Sem variação 0.00%',
    ])
    await expect(indicators[0]).toHaveAttribute('data-slot', 'trend-indicator')
    await expect(indicators[1]).toHaveClass('text-destructive-foreground')
  },
  render: () => (
    <div className="flex items-center gap-4">
      <TrendIndicator value={0.0044} />
      <TrendIndicator value={-0.0018} variant="plain" />
      <TrendIndicator value={0} />
    </div>
  ),
}
