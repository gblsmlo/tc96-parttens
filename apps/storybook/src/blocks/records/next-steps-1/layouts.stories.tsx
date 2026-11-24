import type { Meta, StoryObj } from '@storybook/react-vite'
import { NextSteps1Canvas } from './next-steps-1-canvas.tsx'
import { nextSteps1ControlArgs } from './next-steps-1-controls.ts'
import { ComposedNextSteps1 } from './next-steps-1-layouts.tsx'

const meta = {
  decorators: [NextSteps1Canvas],
  tags: ['!autodocs'],
  title: 'Blocks/Records/NextSteps1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedNextSteps1 {...nextSteps1ControlArgs} />,
}
