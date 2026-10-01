import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '@tc96/ui/input'
import { expect, within } from 'storybook/test'

const meta = {
  title: 'UI/Input/Sizes',
  component: Input,
  args: {
    'aria-label': 'Project name',
    placeholder: 'TC96 project',
    type: 'text',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

const sizes = ['sm', 'default', 'lg'] as const

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      {sizes.map((size) => (
        <Input
          aria-label={`${size} project name`}
          key={size}
          placeholder={size}
          size={size}
          type="text"
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heights = sizes.map((size) =>
      Number.parseFloat(
        getComputedStyle(
          canvas.getByRole('textbox', { name: `${size} project name` }),
        ).height,
      ),
    )

    await expect(heights).toEqual([...heights].sort((a, b) => a - b))
    await expect(new Set(heights).size).toBe(sizes.length)
  },
}
