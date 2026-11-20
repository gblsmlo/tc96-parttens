import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: {
    children: 'Open menu',
    closeDelay: 0,
    delay: 100,
    disabled: false,
    openOnHover: false,
  },
  decorators: [OpenMenuCanvas],
  component: MenuTrigger,
  parameters: { layout: 'centered' },
  render: (args) => (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />} {...args} />
      <MenuPopup>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
      </MenuPopup>
    </Menu>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuTrigger',
} satisfies Meta<typeof MenuTrigger>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuTrigger' }
