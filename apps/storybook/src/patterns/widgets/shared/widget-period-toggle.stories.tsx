import type { Meta, StoryObj } from '@storybook/react-vite'
import { WidgetPeriodToggle } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const meta = {
  args: {
    'aria-label': 'Período do gráfico',
    onValueChange: fn(),
    options: [
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
    ],
    value: 'month',
  },
  component: WidgetPeriodToggle,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Shared/Widget Period Toggle',
} satisfies Meta<typeof WidgetPeriodToggle>

export default meta
type Story = StoryObj<typeof meta>

export const KeepsOnePeriodActive: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Período do gráfico' }),
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Month' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Week' }))
    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await expect(args.onValueChange).toHaveBeenCalledWith('week')
  },
}
