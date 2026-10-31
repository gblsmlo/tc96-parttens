import type { Meta, StoryObj } from '@storybook/react-vite'
import { Amount } from '@tc96/parttens'
import { expect } from 'storybook/test'

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Shared/Amount',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const DimsFractionOnRequest: Story = {
  play: async ({ canvasElement }) => {
    const amount = canvasElement.querySelector('[data-slot="amount"]')
    await expect(amount?.textContent).toBe('09.34%')
    await expect(
      amount?.querySelector('.text-muted-foreground')?.textContent,
    ).toBe('.34%')
  },
  render: () => (
    <Amount
      dimFraction
      format={{ minimumIntegerDigits: 2, style: 'percent' }}
      value={0.0934}
    />
  ),
}
