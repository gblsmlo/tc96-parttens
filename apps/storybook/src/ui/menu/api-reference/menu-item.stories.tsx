import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuItem } from '@tc96/ui/menu'
import { UserIcon } from 'lucide-react'
import { fn } from 'storybook/test'
import { MenuFrame, OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: {
    children: 'Settings',
    closeOnClick: true,
    disabled: false,
    inset: false,
    onClick: fn(),
    variant: 'default',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'destructive'] },
  },
  decorators: [OpenMenuCanvas],
  component: MenuItem,
  parameters: { layout: 'centered' },
  render: (args) => (
    <MenuFrame>
      <MenuItem>
        <UserIcon />
        Profile
      </MenuItem>
      <MenuItem {...args} />
    </MenuFrame>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuItem',
} satisfies Meta<typeof MenuItem>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuItem' }
