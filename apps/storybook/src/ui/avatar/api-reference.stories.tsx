import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@tc96/ui/avatar'
import { expect, waitFor } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'

const imagePlaceholder = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><circle cx="64" cy="64" r="62" fill="none" stroke="#a1a1aa" stroke-dasharray="4 4" stroke-width="2"/><text x="64" y="68" fill="#71717a" font-family="sans-serif" font-size="12" text-anchor="middle">AvatarImage</text></svg>',
)}`

const meta = {
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Avatar/API Reference',
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <AvatarGroup className="[--avatar-nudge:--spacing(3.5)] [--avatar-overlap:--spacing(4)] [--avatar-size:--spacing(40)]">
      <Avatar {...args}>
        <AvatarImage alt="" src={imagePlaceholder} />
        <AvatarFallback />
      </Avatar>
      <Avatar>
        <AvatarFallback>
          <Slot name="AvatarFallback" />
        </AvatarFallback>
      </Avatar>
      <AvatarGroupCount>
        <Slot name="AvatarGroupCount" />
      </AvatarGroupCount>
    </AvatarGroup>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="avatar-group"]')
    if (!(group instanceof HTMLElement))
      throw new Error('The avatar group did not render.')
    await waitFor(() =>
      expect(group.querySelector('[data-slot="avatar-image"]')).not.toBeNull(),
    )
    await expect(
      group.querySelectorAll('[data-slot="avatar-fallback"]'),
    ).toHaveLength(2)
    await expect(
      group.querySelector('[data-slot="avatar-group-count"]'),
    ).not.toBeNull()
  },
}
