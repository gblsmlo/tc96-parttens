import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Timeline1Controls,
  timeline1ControlArgs,
  timeline1ControlArgTypes,
} from './timeline-1-controls.ts'
import { ComposedTimeline1 } from './timeline-1-layouts.tsx'

const meta = {
  args: timeline1ControlArgs,
  argTypes: timeline1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTimeline1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline1/Playground',
} satisfies Meta<Timeline1Controls>

export default meta

type Story = StoryObj<Timeline1Controls>

export const Playground: Story = {}
