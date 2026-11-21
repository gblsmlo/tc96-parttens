import type { Meta, StoryObj } from '@storybook/react-vite'
import { drawerControlArgs } from './drawer-controls.ts'
import {
  ComposedDrawer,
  DetachedTriggerDrawer,
  MenuDrawer,
  NestedDrawer,
  ScrollingPanelDrawer,
} from './drawer-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/Drawer/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutBar: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} showBar={false} />,
}

export const WithCloseButton: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} showCloseButton />,
}

export const WithoutDescription: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} description="" />,
}

export const WithoutPanel: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} body="" />,
}

export const WithoutFooter: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} footer={false} />,
}

export const ScrollingPanel: Story = {
  render: () => <ScrollingPanelDrawer />,
}

export const Menu: Story = {
  render: () => <MenuDrawer />,
}

export const Nested: Story = {
  render: () => <NestedDrawer />,
}

export const DetachedTrigger: Story = {
  render: () => <DetachedTriggerDrawer />,
}
