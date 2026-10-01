import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { expect, within } from 'storybook/test'

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

const sizes = ['xs', 'sm', 'default', 'lg', 'xl'] as const

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {sizes.map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heights = sizes.map((size) =>
      Number.parseFloat(
        getComputedStyle(canvas.getByRole('button', { name: size })).height,
      ),
    )

    await expect(heights).toEqual([...heights].sort((a, b) => a - b))
    await expect(new Set(heights).size).toBe(sizes.length)
  },
}
