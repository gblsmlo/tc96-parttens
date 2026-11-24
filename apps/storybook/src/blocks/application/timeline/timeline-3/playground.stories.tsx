import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Timeline3Controls,
  timeline3ControlArgs,
  timeline3ControlArgTypes,
} from './timeline-3-controls.ts'
import { ComposedTimeline3 } from './timeline-3-layouts.tsx'

const meta = {
  args: timeline3ControlArgs,
  argTypes: timeline3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTimeline3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline3/Playground',
} satisfies Meta<Timeline3Controls>

export default meta

type Story = StoryObj<Timeline3Controls>

export const Playground: Story = {}
