import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Button } from 'tc96/ui'

const meta = {
  title: 'UI/Button/Sizes',
  component: Button,
  args: {
    children: 'Button',
    type: 'button',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const small = canvas.getByRole('button', { name: 'Small' })
    const medium = canvas.getByRole('button', { name: 'Medium' })
    const large = canvas.getByRole('button', { name: 'Large' })

    await expect(getComputedStyle(small).height).toBe('32px')
    await expect(getComputedStyle(medium).height).toBe('36px')
    await expect(getComputedStyle(large).height).toBe('40px')
  },
}
