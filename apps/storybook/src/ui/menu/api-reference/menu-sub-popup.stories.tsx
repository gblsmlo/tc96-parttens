import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuItem, MenuSub, MenuSubPopup, MenuSubTrigger } from '@tc96/ui/menu'
import { MenuFrame, OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: { align: 'start', sideOffset: 0 },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  decorators: [OpenMenuCanvas],
  component: MenuSubPopup,
  parameters: { layout: 'centered' },
  render: (args) => (
    <MenuFrame>
      <MenuItem>Profile</MenuItem>
      <MenuSub defaultOpen>
        <MenuSubTrigger>Add to playlist</MenuSubTrigger>
        <MenuSubPopup {...args}>
          <MenuItem>Jazz</MenuItem>
          <MenuItem>Rock</MenuItem>
        </MenuSubPopup>
      </MenuSub>
    </MenuFrame>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuSubPopup',
} satisfies Meta<typeof MenuSubPopup>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuSubPopup' }
