import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuRadioGroup, MenuRadioItem } from '@tc96/ui/menu'
import { MenuFrame, OpenMenuCanvas } from './menu-frame.tsx'

const meta = {
  args: { children: 'Dark', disabled: false, value: 'dark' },
  decorators: [OpenMenuCanvas],
  component: MenuRadioItem,
  parameters: { layout: 'centered' },
  render: (args) => (
    <MenuFrame>
      <MenuRadioGroup defaultValue="dark">
        <MenuRadioItem value="light">Light</MenuRadioItem>
        <MenuRadioItem {...args} />
      </MenuRadioGroup>
    </MenuFrame>
  ),
  tags: ['!autodocs'],
  title: 'UI/Menu/API Reference/MenuRadioItem',
} satisfies Meta<typeof MenuRadioItem>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'MenuRadioItem' }
