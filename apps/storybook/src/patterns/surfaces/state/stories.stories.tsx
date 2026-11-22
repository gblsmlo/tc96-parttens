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
  parameters: { controls: { exclude: ['icon', 'state'] } },
  render: (args) => <ComposedState {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/State/Stories',
} satisfies Meta<StateControls>

export default meta

type Story = StoryObj<StateControls>

export const Default: Story = {}

export const NoResult: Story = {
  args: { state: 'no-result' },
  name: 'State no-result',
}

export const ErrorState: Story = {
  args: { state: 'error' },
  name: 'State error',
}

export const Permission: Story = {
  args: { state: 'permission' },
  name: 'State permission',
}

export const NotFound: Story = {
  args: { state: 'not-found' },
  name: 'State not-found',
}

export const Loading: Story = {
  args: { state: 'loading' },
  name: 'State loading',
}

export const Data: Story = {
  args: { state: 'data' },
  name: 'State data',
}

export const CustomIcon: Story = {
  args: { icon: 'custom' },
  name: 'Icon custom',
}

export const NoIcon: Story = {
  args: { icon: 'none' },
  name: 'Icon none',
}
