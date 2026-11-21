import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type MenuControls,
  menuControlArgs,
  menuControlArgTypes,
} from './menu-controls.ts'
import { ComposedMenu } from './menu-layouts.tsx'

const meta = {
  args: menuControlArgs,
  argTypes: menuControlArgTypes,
  parameters: {
    controls: { exclude: ['destructiveItem', 'disabledItem'] },
    layout: 'centered',
  },
  render: (args) => <ComposedMenu {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Menu/Stories',
} satisfies Meta<MenuControls>

export default meta

type Story = StoryObj<MenuControls>

export const Default: Story = {}

export const DestructiveItem: Story = {
  args: { destructiveItem: true },
}

export const DisabledItem: Story = {
  args: { disabledItem: true },
}
