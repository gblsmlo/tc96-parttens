import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuRadioGroup, MenuRadioItem } from '@tc96/ui/menu'
import { fn } from 'storybook/test'
import { MenuFrame, OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: { defaultValue: 'system', disabled: false, onValueChange: fn() },
  decorators: [OpenMenuCanvas],
  component: MenuRadioGroup,
  parameters: { layout: 'centered' },
  render: (args) => (
    <MenuFrame>
      <MenuRadioGroup {...args}>
        <MenuRadioItem value="light">Light</MenuRadioItem>
        <MenuRadioItem value="dark">Dark</MenuRadioItem>
        <MenuRadioItem value="system">System</MenuRadioItem>
      </MenuRadioGroup>
    </MenuFrame>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuRadioGroup',
} satisfies Meta<typeof MenuRadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuRadioGroup' }
