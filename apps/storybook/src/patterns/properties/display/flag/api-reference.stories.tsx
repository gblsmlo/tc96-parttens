import { RobotIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlagProperty } from '@tc96/ui/patterns'
import { expect } from 'storybook/test'
import { FlagCanvas } from './flag-canvas.tsx'

const meta = {
  args: {
    active: true,
    activeIcon: RobotIcon,
    label: 'label',
    variant: 'plain',
  },
  component: FlagProperty,
  decorators: [FlagCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Flag/API Reference',
} satisfies Meta<typeof FlagProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector(
        '[data-slot="property-surface"] [data-slot="property-icon"]',
      ),
    ).not.toBeNull()
  },
}
