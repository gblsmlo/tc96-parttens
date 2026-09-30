import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Input } from 'tc96/ui'

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

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Input aria-label="Small project name" placeholder="Small" size="sm" type="text" />
      <Input aria-label="Medium project name" placeholder="Medium" type="text" />
      <Input aria-label="Large project name" placeholder="Large" size="lg" type="text" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const small = canvas.getByRole('textbox', { name: 'Small project name' })
    const medium = canvas.getByRole('textbox', { name: 'Medium project name' })
    const large = canvas.getByRole('textbox', { name: 'Large project name' })

    await expect(getComputedStyle(small).height).toBe('32px')
    await expect(getComputedStyle(medium).height).toBe('36px')
    await expect(getComputedStyle(large).height).toBe('40px')
  },
}
