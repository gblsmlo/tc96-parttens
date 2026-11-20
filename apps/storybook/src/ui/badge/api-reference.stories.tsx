import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@tc96/ui/badge'
import { expect, within } from 'storybook/test'
import { IconSlot, Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Badge/API Reference',
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Badge {...args} size="large" variant="outline">
      <IconSlot />
      <Slot name="children" />
    </Badge>
  ),
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector('[data-slot="badge"]')
    if (!(badge instanceof HTMLElement))
      throw new Error('The badge did not render.')
    await expect(badge.querySelector('[data-anatomy="leading"]')).not.toBeNull()
    await expect(within(badge).getByText('children')).toBeVisible()
  },
}
