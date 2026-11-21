import type { Meta, StoryObj } from '@storybook/react-vite'
import { contextMenuControlArgs } from './context-menu-controls.ts'
import { ComposedContextMenu } from './context-menu-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/ContextMenu/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithGroupLabel: Story = {
  render: () => (
    <ComposedContextMenu {...contextMenuControlArgs} label="Actions" />
  ),
}

export const WithShortcuts: Story = {
  render: () => <ComposedContextMenu {...contextMenuControlArgs} shortcuts />,
}

export const WithoutIcons: Story = {
  render: () => (
    <ComposedContextMenu {...contextMenuControlArgs} icons={false} />
  ),
}

export const InsetItem: Story = {
  render: () => <ComposedContextMenu {...contextMenuControlArgs} inset />,
}

export const WithSubmenu: Story = {
  render: () => <ComposedContextMenu {...contextMenuControlArgs} submenu />,
}

export const WithCheckboxItems: Story = {
  render: () => (
    <ComposedContextMenu {...contextMenuControlArgs} checkboxItems />
  ),
}

export const WithRadioGroup: Story = {
  render: () => <ComposedContextMenu {...contextMenuControlArgs} radioGroup />,
}

export const WithLinkItem: Story = {
  render: () => <ComposedContextMenu {...contextMenuControlArgs} linkItem />,
}
