import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle } from '@tc96/ui/toggle'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  args: { variant: 'outline' },
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Toggle/API Reference',
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Toggle {...args}>
      <svg aria-hidden="true" data-anatomy="icon" viewBox="0 0 16 16">
        <rect
          fill="none"
          height="15"
          rx="3"
          stroke="currentColor"
          strokeDasharray="2 2"
          width="15"
          x="0.5"
          y="0.5"
        />
      </svg>
      <Slot name="children" />
    </Toggle>
  ),
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', {
      name: 'children',
    })
    await expect(toggle).toHaveAttribute('data-slot', 'toggle')
    await expect(toggle.querySelector('[data-anatomy="icon"]')).not.toBeNull()
  },
}
