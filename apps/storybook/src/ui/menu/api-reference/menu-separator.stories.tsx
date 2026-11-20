import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuItem, MenuSeparator } from '@tc96/ui/menu'
import { MenuFrame, OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  decorators: [OpenMenuCanvas],
  component: MenuSeparator,
  parameters: { layout: 'centered' },
  render: (args) => (
    <MenuFrame>
      <MenuItem>Profile</MenuItem>
      <MenuSeparator {...args} />
      <MenuItem>Log out</MenuItem>
    </MenuFrame>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuSeparator',
} satisfies Meta<typeof MenuSeparator>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuSeparator' }
