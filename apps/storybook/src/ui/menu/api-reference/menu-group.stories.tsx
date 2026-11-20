import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuGroup, MenuGroupLabel, MenuItem } from '@tc96/ui/menu'
import { MenuFrame, OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  decorators: [OpenMenuCanvas],
  component: MenuGroup,
  parameters: { layout: 'centered' },
  render: (args) => (
    <MenuFrame>
      <MenuGroup {...args}>
        <MenuGroupLabel>Account</MenuGroupLabel>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Billing</MenuItem>
      </MenuGroup>
    </MenuFrame>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuGroup',
} satisfies Meta<typeof MenuGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuGroup' }
