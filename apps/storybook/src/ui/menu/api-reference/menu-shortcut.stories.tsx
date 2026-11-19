import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuItem, MenuShortcut } from '@tc96/ui/menu'
import { shortcutContrastException } from '../menu-api.ts'
import { MenuFrame, OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: { children: '⌘K' },
  decorators: [OpenMenuCanvas],
  component: MenuShortcut,
  parameters: {
    a11y: shortcutContrastException,
    layout: 'centered',
  },
  render: (args) => (
    <MenuFrame>
      <MenuItem>
        Search
        <MenuShortcut {...args} />
      </MenuItem>
    </MenuFrame>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuShortcut',
} satisfies Meta<typeof MenuShortcut>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuShortcut' }
