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
  render: (args) => <ComposedSegmentedControl {...args} />,
  tags: ['!autodocs'],
  title: 'UI/SegmentedControl/Playground',
} satisfies Meta<SegmentedControlControls>

export default meta

type Story = StoryObj<SegmentedControlControls>

export const Playground: Story = {}
