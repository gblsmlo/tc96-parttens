import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProductivityCanvas } from './productivity-canvas.tsx'
import {
  type ProductivityControls,
  productivityControlArgs,
  productivityControlArgTypes,
} from './productivity-controls.ts'
import { ComposedProductivity } from './productivity-layouts.tsx'

const meta = {
  args: productivityControlArgs,
  argTypes: productivityControlArgTypes,
  decorators: [ProductivityCanvas],
  parameters: {
    controls: { exclude: ['empty', 'live', 'tone', 'widget'] },
    layout: 'padded',
  },
  render: (args) => <ComposedProductivity {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Productivity/Stories',
} satisfies Meta<ProductivityControls>

export default meta

type Story = StoryObj<ProductivityControls>

export const Default: Story = {}

export const TaskProgressInverted: Story = {
  args: { tone: 'inverted' },
  name: 'Task progress inverted',
}

export const UpcomingEvent: Story = {
  args: { widget: 'upcoming-event' },
  name: 'Upcoming event',
}

export const UpcomingEventLive: Story = {
  args: { live: true, widget: 'upcoming-event' },
  name: 'Upcoming event live',
}

export const ProjectCard: Story = {
  args: { widget: 'project-card' },
  name: 'Project card',
}

export const Agenda: Story = {
  args: { widget: 'agenda' },
}

export const AgendaEmpty: Story = {
  args: { empty: true, widget: 'agenda' },
  name: 'Agenda empty',
}

export const WorldClock: Story = {
  args: { widget: 'world-clock' },
  name: 'World clock',
}
