import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Timeline4Controls,
  timeline4ControlArgs,
  timeline4ControlArgTypes,
} from './timeline-4-controls.ts'
import { ComposedTimeline4 } from './timeline-4-layouts.tsx'

const meta = {
  args: timeline4ControlArgs,
  argTypes: timeline4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTimeline4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline4/Playground',
} satisfies Meta<Timeline4Controls>

export default meta

type Story = StoryObj<Timeline4Controls>

export const Playground: Story = {}
