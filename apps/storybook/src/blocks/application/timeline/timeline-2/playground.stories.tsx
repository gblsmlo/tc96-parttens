import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Timeline2Controls,
  timeline2ControlArgs,
  timeline2ControlArgTypes,
} from './timeline-2-controls.ts'
import { ComposedTimeline2 } from './timeline-2-layouts.tsx'

const meta = {
  args: timeline2ControlArgs,
  argTypes: timeline2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTimeline2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline2/Playground',
} satisfies Meta<Timeline2Controls>

export default meta

type Story = StoryObj<Timeline2Controls>

export const Playground: Story = {}
