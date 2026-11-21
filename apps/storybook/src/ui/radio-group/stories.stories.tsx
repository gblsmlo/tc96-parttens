import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RadioGroupControls,
  radioGroupControlArgs,
  radioGroupControlArgTypes,
} from './radio-group-controls.ts'
import { ComposedRadioGroup } from './radio-group-layouts.tsx'

const meta = {
  args: radioGroupControlArgs,
  argTypes: radioGroupControlArgTypes,
  parameters: {
    controls: {
      exclude: ['defaultValue', 'disabled', 'disabledItem', 'invalid'],
    },
    layout: 'centered',
  },
  render: (args) => <ComposedRadioGroup {...args} />,
  tags: ['!autodocs'],
  title: 'UI/RadioGroup/Stories',
} satisfies Meta<RadioGroupControls>

export default meta

type Story = StoryObj<RadioGroupControls>

export const Default: Story = {}

export const NoSelection: Story = {
  args: { defaultValue: 'none' },
  name: 'No selection',
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledItem: Story = {
  args: { disabledItem: true },
  name: 'Disabled item',
}

export const Invalid: Story = {
  args: { invalid: true },
}
