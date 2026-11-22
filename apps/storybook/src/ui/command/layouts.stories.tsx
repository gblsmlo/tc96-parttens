import type { Meta, StoryObj } from '@storybook/react-vite'
import { commandControlArgs } from './command-controls.ts'
import { ComposedCommand, DetachedTriggerCommand } from './command-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Command/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const FlatList: Story = {
  render: () => <ComposedCommand {...commandControlArgs} groups={false} />,
}

export const WithoutSeparators: Story = {
  render: () => <ComposedCommand {...commandControlArgs} separators={false} />,
}

export const WithoutShortcuts: Story = {
  render: () => <ComposedCommand {...commandControlArgs} shortcuts={false} />,
}

export const WithoutPanel: Story = {
  render: () => <ComposedCommand {...commandControlArgs} panel={false} />,
}

export const WithoutFooter: Story = {
  render: () => <ComposedCommand {...commandControlArgs} footer={false} />,
}

export const Inline: Story = {
  render: () => <ComposedCommand {...commandControlArgs} dialog={false} />,
}

export const DetachedTrigger: Story = {
  render: () => <DetachedTriggerCommand />,
}
