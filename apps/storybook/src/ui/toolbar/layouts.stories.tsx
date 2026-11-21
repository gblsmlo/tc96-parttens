import type { Meta, StoryObj } from '@storybook/react-vite'
import { toolbarControlArgs } from './toolbar-controls.ts'
import { ComposedToolbar } from './toolbar-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Toolbar/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutSeparators: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} separators={false} />,
}

export const WithoutGroups: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} groups={false} />,
}

export const WithLink: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} link="All files" />,
}

export const WithInput: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} input />,
}
