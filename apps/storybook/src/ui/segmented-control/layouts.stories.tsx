import type { Meta, StoryObj } from '@storybook/react-vite'
import { segmentedControlControlArgs } from './segmented-control-controls.ts'
import { ComposedSegmentedControl } from './segmented-control-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/SegmentedControl/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithIcons: Story = {
  render: () => (
    <ComposedSegmentedControl {...segmentedControlControlArgs} icon />
  ),
}

export const IconOnly: Story = {
  render: () => (
    <ComposedSegmentedControl
      {...segmentedControlControlArgs}
      dayLabel=""
      icon
      monthLabel=""
      weekLabel=""
    />
  ),
}

export const AsNavigation: Story = {
  render: () => (
    <ComposedSegmentedControl {...segmentedControlControlArgs} element="link" />
  ),
}

export const AsToggleGroup: Story = {
  render: () => (
    <ComposedSegmentedControl
      {...segmentedControlControlArgs}
      element="toggle"
    />
  ),
}
