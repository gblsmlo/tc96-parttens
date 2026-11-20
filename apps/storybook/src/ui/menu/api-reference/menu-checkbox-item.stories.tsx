import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuCheckboxItem } from '@tc96/ui/menu'
import { fn } from 'storybook/test'
import { MenuFrame, OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: {
    children: 'Auto save',
    defaultChecked: true,
    disabled: false,
    onCheckedChange: fn(),
    variant: 'default',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'switch'] },
  },
  decorators: [OpenMenuCanvas],
  component: MenuCheckboxItem,
  parameters: { layout: 'centered' },
  render: (args) => (
    <MenuFrame>
      <MenuCheckboxItem {...args} />
    </MenuFrame>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuCheckboxItem',
} satisfies Meta<typeof MenuCheckboxItem>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuCheckboxItem' }
