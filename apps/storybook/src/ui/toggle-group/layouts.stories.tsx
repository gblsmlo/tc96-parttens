import type { Meta, StoryObj } from '@storybook/react-vite'
import { toggleGroupControlArgs } from './toggle-group-controls.ts'
import { ComposedToggleGroup } from './toggle-group-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/ToggleGroup/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithText: Story = {
  render: () => <ComposedToggleGroup {...toggleGroupControlArgs} text />,
}

export const TextOnly: Story = {
  render: () => (
    <ComposedToggleGroup {...toggleGroupControlArgs} icons={false} />
  ),
}

export const WithSeparators: Story = {
  render: () => <ComposedToggleGroup {...toggleGroupControlArgs} separators />,
}

export const VerticalOutline: Story = {
  render: () => (
    <ComposedToggleGroup
      {...toggleGroupControlArgs}
      orientation="vertical"
      variant="outline"
    />
  ),
}
