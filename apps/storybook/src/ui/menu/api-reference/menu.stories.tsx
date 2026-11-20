import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { fn } from 'storybook/test'
import { OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: {
    disabled: false,
    loopFocus: true,
    modal: true,
    onOpenChange: fn(),
    orientation: 'vertical',
  },
  decorators: [OpenMenuCanvas],
  component: Menu,
  parameters: { layout: 'centered' },
  render: (args) => (
    <Menu {...args}>
      <MenuTrigger render={<Button variant="outline" />}>Open menu</MenuTrigger>
      <MenuPopup>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
      </MenuPopup>
    </Menu>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/Menu',
} satisfies Meta<typeof Menu>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'Menu' }
