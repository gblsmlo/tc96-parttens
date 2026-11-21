import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type DrawerControls,
  drawerControlArgs,
  drawerControlArgTypes,
} from './drawer-controls.ts'
import { ComposedDrawer } from './drawer-layouts.tsx'

const meta = {
  args: drawerControlArgs,
  argTypes: drawerControlArgTypes,
  render: (args) => <ComposedDrawer {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Drawer/Playground',
} satisfies Meta<DrawerControls>

export default meta

type Story = StoryObj<DrawerControls>

export const Playground: Story = {}
