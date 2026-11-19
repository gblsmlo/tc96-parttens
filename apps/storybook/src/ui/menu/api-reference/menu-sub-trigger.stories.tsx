import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuItem, MenuSub, MenuSubPopup, MenuSubTrigger } from '@tc96/ui/menu'
import { ListMusicIcon } from 'lucide-react'
import { MenuFrame, OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: {
    children: 'Add to playlist',
    disabled: false,
    inset: false,
    openOnHover: true,
  },
  decorators: [OpenMenuCanvas],
  component: MenuSubTrigger,
  parameters: { layout: 'centered' },
  render: (args) => (
    <MenuFrame>
      <MenuItem>
        <ListMusicIcon />
        Queue
      </MenuItem>
      <MenuSub>
        <MenuSubTrigger {...args} />
        <MenuSubPopup>
          <MenuItem>Jazz</MenuItem>
          <MenuItem>Rock</MenuItem>
        </MenuSubPopup>
      </MenuSub>
    </MenuFrame>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuSubTrigger',
} satisfies Meta<typeof MenuSubTrigger>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuSubTrigger' }
