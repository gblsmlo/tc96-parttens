import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuGroup, MenuGroupLabel, MenuItem } from '@tc96/ui/menu'
import { UserIcon } from 'lucide-react'
import { MenuFrame, OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: { children: 'Account', inset: false },
  decorators: [OpenMenuCanvas],
  component: MenuGroupLabel,
  parameters: { layout: 'centered' },
  render: (args) => (
    <MenuFrame>
      <MenuGroup>
        <MenuGroupLabel {...args} />
        <MenuItem>
          <UserIcon />
          Profile
        </MenuItem>
      </MenuGroup>
    </MenuFrame>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuGroupLabel',
} satisfies Meta<typeof MenuGroupLabel>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuGroupLabel' }
