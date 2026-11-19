import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: {
    align: 'center',
    alignOffset: 0,
    side: 'bottom',
    sideOffset: 4,
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    side: {
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
  decorators: [OpenMenuCanvas],
  component: MenuPopup,
  parameters: { layout: 'centered' },
  render: (args) => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger render={<Button variant="outline" />}>Open menu</MenuTrigger>
      <MenuPopup {...args}>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
      </MenuPopup>
    </Menu>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuPopup',
} satisfies Meta<typeof MenuPopup>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuPopup' }
