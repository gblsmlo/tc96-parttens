import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type InputControls,
  inputControlArgs,
  inputControlArgTypes,
} from './input-controls.ts'
import { InputCanvas } from './input-frame.tsx'
import { ComposedInput } from './input-layouts.tsx'

const meta = {
  args: inputControlArgs,
  argTypes: inputControlArgTypes,
  decorators: [InputCanvas],
  parameters: {
    controls: { exclude: ['size', 'type', 'disabled', 'invalid', 'unstyled'] },
    layout: 'centered',
  },
  render: (args) => <ComposedInput {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Input/Stories',
} satisfies Meta<InputControls>

export default meta

type Story = StoryObj<InputControls>

export const Default: Story = {}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const File: Story = {
  args: { type: 'file' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { invalid: true },
}

export const Unstyled: Story = {
  args: { unstyled: true },
}
