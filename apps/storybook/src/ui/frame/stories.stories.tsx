import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type FrameControls,
  frameControlArgs,
  frameControlArgTypes,
} from './frame-controls.ts'
import { FrameCanvas } from './frame-frame.tsx'
import { ComposedFrame } from './frame-layouts.tsx'

const meta = {
  args: frameControlArgs,
  argTypes: frameControlArgTypes,
  decorators: [FrameCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedFrame {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Frame/Stories',
} satisfies Meta<FrameControls>

export default meta

type Story = StoryObj<FrameControls>

export const Default: Story = {}
