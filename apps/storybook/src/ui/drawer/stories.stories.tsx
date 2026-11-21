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
  parameters: {
    controls: { exclude: ['footerVariant', 'position', 'variant'] },
  },
  render: (args) => <ComposedDrawer {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Drawer/Stories',
} satisfies Meta<DrawerControls>

export default meta

type Story = StoryObj<DrawerControls>

export const Default: Story = {}

export const PositionRight: Story = {
  args: { position: 'right' },
  name: 'Position right',
}

export const PositionLeft: Story = {
  args: { position: 'left' },
  name: 'Position left',
}

export const PositionTop: Story = {
  args: { position: 'top' },
  name: 'Position top',
}

export const Straight: Story = {
  args: { variant: 'straight' },
}

export const Inset: Story = {
  args: { variant: 'inset' },
}

export const FooterBare: Story = {
  args: { footerVariant: 'bare' },
  name: 'Footer bare',
}
