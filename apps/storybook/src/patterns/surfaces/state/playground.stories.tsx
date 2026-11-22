import type { Meta, StoryObj } from '@storybook/react-vite'
import { StateCanvas } from './state-canvas.tsx'
import {
  type StateControls,
  stateControlArgs,
  stateControlArgTypes,
} from './state-controls.ts'
import { ComposedState } from './state-layouts.tsx'

const meta = {
  args: stateControlArgs,
  argTypes: stateControlArgTypes,
  decorators: [StateCanvas],
  render: (args) => <ComposedState {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/State/Playground',
} satisfies Meta<StateControls>

export default meta

type Story = StoryObj<StateControls>

export const Playground: Story = {}
