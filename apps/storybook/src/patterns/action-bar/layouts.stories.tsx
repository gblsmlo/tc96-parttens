import type { Meta, StoryObj } from '@storybook/react-vite'
import { actionBarControlArgs } from './action-bar-controls.ts'
import { ComposedActionBar } from './action-bar-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Patterns/ActionBar/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutSubmenu: Story = {
  render: () => <ComposedActionBar {...actionBarControlArgs} submenu={false} />,
}

export const WithoutClearButton: Story = {
  render: () => (
    <ComposedActionBar {...actionBarControlArgs} clearButton={false} />
  ),
}

export const WithoutIcons: Story = {
  render: () => <ComposedActionBar {...actionBarControlArgs} icons={false} />,
}

export const WithShortcuts: Story = {
  render: () => <ComposedActionBar {...actionBarControlArgs} shortcuts />,
}
