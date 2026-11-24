import type { Meta, StoryObj } from '@storybook/react-vite'
import { NextSteps1Canvas } from './next-steps-1-canvas.tsx'
import {
  type NextSteps1Controls,
  nextSteps1ControlArgs,
  nextSteps1ControlArgTypes,
} from './next-steps-1-controls.ts'
import { ComposedNextSteps1 } from './next-steps-1-layouts.tsx'

const meta = {
  args: nextSteps1ControlArgs,
  argTypes: nextSteps1ControlArgTypes,
  decorators: [NextSteps1Canvas],
  render: (args) => <ComposedNextSteps1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Records/NextSteps1/Playground',
} satisfies Meta<NextSteps1Controls>

export default meta

type Story = StoryObj<NextSteps1Controls>

export const Playground: Story = {}
