import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconFrame } from '@tc96/ui/icon-frame'
import { expect } from 'storybook/test'
import { IconSlot } from '../../test-utils/anatomy-slot'

const meta = {
  component: IconFrame,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/IconFrame/API Reference',
} satisfies Meta<typeof IconFrame>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <IconFrame {...args} size="xl" variant="plain">
      <IconSlot />
    </IconFrame>
  ),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector('[data-slot="icon-frame"]')
    if (!(frame instanceof HTMLElement))
      throw new Error('The icon frame did not render.')
    await expect(frame.querySelector('[data-anatomy="leading"]')).not.toBeNull()
  },
}
