import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconLabelProperty } from '@tc96/parttens'
import { TagIcon } from 'lucide-react'
import { expect } from 'storybook/test'
import { IconSlot, Slot } from '../../../../test-utils/anatomy-slot'
import { IconLabelCanvas } from './icon-label-canvas.tsx'

const meta = {
  args: {
    icon: TagIcon,
    label: <Slot name="label" />,
    leading: <IconSlot />,
    trailing: <Slot name="trailing" />,
    variant: 'plain',
  },
  component: IconLabelProperty,
  decorators: [IconLabelCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Icon Label/API Reference',
} satisfies Meta<typeof IconLabelProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const surface = canvasElement.querySelector(
      '[data-slot="property-surface"]',
    )

    await expect(surface).not.toBeNull()
    await expect(
      surface?.querySelector('[data-anatomy="leading"]'),
    ).not.toBeNull()
    await expect(
      surface?.querySelector('[data-slot="property-icon"]'),
    ).not.toBeNull()
  },
}
