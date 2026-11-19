import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuItem, MenuShortcut } from '@tc96/ui/menu'
import { MenuFrame, OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: { children: '⌘K' },
  decorators: [OpenMenuCanvas],
  component: MenuShortcut,
  parameters: { layout: 'centered' },
  render: (args) => (
    <MenuFrame>
      <MenuItem aria-keyshortcuts="Meta+K">
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
