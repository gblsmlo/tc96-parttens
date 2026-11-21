import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type MenuControls,
  menuControlArgs,
  menuControlArgTypes,
} from './menu-controls.ts'
import { ComposedMenu } from './menu-layouts.tsx'

const meta = {
  args: menuControlArgs,
  argTypes: menuControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedMenu {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Menu/Playground',
} satisfies Meta<MenuControls>

export default meta

type Story = StoryObj<MenuControls>

export const Playground: Story = {}
