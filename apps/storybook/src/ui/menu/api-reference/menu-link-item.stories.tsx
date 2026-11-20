import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuLinkItem } from '@tc96/ui/menu'
import { MenuFrame, OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: {
    children: 'Docs',
    closeOnClick: true,
    href: '#docs',
    inset: false,
    variant: 'default',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'destructive'] },
  },
  decorators: [OpenMenuCanvas],
  component: MenuLinkItem,
  parameters: { layout: 'centered' },
  render: (args) => (
    <MenuFrame>
      <MenuLinkItem {...args} />
    </MenuFrame>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuLinkItem',
} satisfies Meta<typeof MenuLinkItem>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuLinkItem' }
