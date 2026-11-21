import type { Meta, StoryObj } from '@storybook/react-vite'
import { menuControlArgs } from './menu-controls.ts'
import { ComposedMenu } from './menu-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Menu/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithGroupLabel: Story = {
  render: () => <ComposedMenu {...menuControlArgs} label="Actions" />,
}

export const WithShortcuts: Story = {
  render: () => <ComposedMenu {...menuControlArgs} shortcuts />,
}

export const WithoutIcons: Story = {
  render: () => <ComposedMenu {...menuControlArgs} icons={false} />,
}

export const InsetItem: Story = {
  render: () => <ComposedMenu {...menuControlArgs} inset />,
}

export const WithSubmenu: Story = {
  render: () => <ComposedMenu {...menuControlArgs} submenu />,
}

export const WithCheckboxItems: Story = {
  render: () => <ComposedMenu {...menuControlArgs} checkboxItems />,
}

export const WithRadioGroup: Story = {
  render: () => <ComposedMenu {...menuControlArgs} radioGroup />,
}

export const WithLinkItem: Story = {
  render: () => <ComposedMenu {...menuControlArgs} linkItem />,
}
