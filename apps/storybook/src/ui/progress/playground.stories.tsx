import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ProgressControls,
  progressControlArgs,
  progressControlArgTypes,
} from './progress-controls.ts'
import { ProgressCanvas } from './progress-frame.tsx'
import { ComposedProgress } from './progress-layouts.tsx'

const meta = {
  args: progressControlArgs,
  argTypes: progressControlArgTypes,
  decorators: [ProgressCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedProgress {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Progress/Playground',
} satisfies Meta<ProgressControls>

export default meta

type Story = StoryObj<ProgressControls>

export const Playground: Story = {}
