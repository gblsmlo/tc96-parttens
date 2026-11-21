import type { Meta, StoryObj } from '@storybook/react-vite'
import { popoverControlArgs } from './popover-controls.ts'
import {
  AnchoredPopover,
  ComposedPopover,
  DetachedTriggersPopover,
} from './popover-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Popover/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithCloseButton: Story = {
  render: () => <ComposedPopover {...popoverControlArgs} closeButton />,
}

export const WithoutDescription: Story = {
  render: () => <ComposedPopover {...popoverControlArgs} description="" />,
}

export const WithoutTitle: Story = {
  render: () => <ComposedPopover {...popoverControlArgs} title="" />,
}

export const DetachedTriggers: Story = {
  render: () => <DetachedTriggersPopover />,
}

export const WithAnchor: Story = {
  render: () => <AnchoredPopover />,
}
