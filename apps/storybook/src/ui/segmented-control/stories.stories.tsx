import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SegmentedControlControls,
  segmentedControlControlArgs,
  segmentedControlControlArgTypes,
} from './segmented-control-controls.ts'
import { ComposedSegmentedControl } from './segmented-control-layouts.tsx'

const meta = {
  args: segmentedControlControlArgs,
  argTypes: segmentedControlControlArgTypes,
  parameters: {
    controls: { exclude: ['disabledItem', 'element', 'size', 'value'] },
  },
  render: (args) => <ComposedSegmentedControl {...args} />,
  tags: ['!autodocs'],
  title: 'UI/SegmentedControl/Stories',
} satisfies Meta<SegmentedControlControls>

export default meta

type Story = StoryObj<SegmentedControlControls>

export const Default: Story = {}

export const SizeSm: Story = {
  args: { size: 'sm' },
  name: 'Size sm',
}

export const SizeLg: Story = {
  args: { size: 'lg' },
  name: 'Size lg',
}

export const NoSelection: Story = {
  args: { value: 'none' },
  name: 'No selection',
}

export const DisabledItem: Story = {
  args: { disabledItem: true },
  name: 'Disabled item',
}
