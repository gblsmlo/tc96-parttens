import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ContextMenuControls,
  contextMenuControlArgs,
  contextMenuControlArgTypes,
} from './context-menu-controls.ts'
import { ComposedContextMenu } from './context-menu-layouts.tsx'

const meta = {
  args: contextMenuControlArgs,
  argTypes: contextMenuControlArgTypes,
  parameters: {
    controls: { exclude: ['destructiveItem', 'disabledItem'] },
    layout: 'centered',
  },
  render: (args) => <ComposedContextMenu {...args} />,
  tags: ['!autodocs'],
  title: 'UI/ContextMenu/Stories',
} satisfies Meta<ContextMenuControls>

export default meta

type Story = StoryObj<ContextMenuControls>

export const Default: Story = {}

export const DestructiveItem: Story = {
  args: { destructiveItem: true },
}

export const DisabledItem: Story = {
  args: { disabledItem: true },
}
