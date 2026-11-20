import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuItem, MenuSub, MenuSubPopup, MenuSubTrigger } from '@tc96/ui/menu'
import { fn } from 'storybook/test'
import { MenuFrame, OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: { defaultOpen: true, disabled: false, onOpenChange: fn() },
  decorators: [OpenMenuCanvas],
  component: MenuSub,
  parameters: { layout: 'centered' },
  render: (args) => (
    <MenuFrame>
      <MenuItem>Profile</MenuItem>
      <MenuSub {...args}>
        <MenuSubTrigger>Add to playlist</MenuSubTrigger>
        <MenuSubPopup>
          <MenuItem>Jazz</MenuItem>
          <MenuItem>Rock</MenuItem>
        </MenuSubPopup>
      </MenuSub>
    </MenuFrame>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuSub',
} satisfies Meta<typeof MenuSub>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuSub' }
