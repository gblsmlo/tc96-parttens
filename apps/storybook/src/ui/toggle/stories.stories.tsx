import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ToggleControls,
  toggleControlArgs,
  toggleControlArgTypes,
} from './toggle-controls.ts'
import { ComposedToggle } from './toggle-layouts.tsx'

const meta = {
  args: toggleControlArgs,
  argTypes: toggleControlArgTypes,
  parameters: {
    controls: { exclude: ['disabled', 'pressed', 'size', 'variant'] },
    layout: 'centered',
  },
  render: (args) => <ComposedToggle {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Toggle/Stories',
} satisfies Meta<ToggleControls>

export default meta

type Story = StoryObj<ToggleControls>

export const Default: Story = {}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const SizeSm: Story = {
  args: { size: 'sm' },
  name: 'Size sm',
}

export const SizeLg: Story = {
  args: { size: 'lg' },
  name: 'Size lg',
}

export const Pressed: Story = {
  args: { pressed: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
