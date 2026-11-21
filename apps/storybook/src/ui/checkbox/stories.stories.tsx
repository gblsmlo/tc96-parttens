import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CheckboxControls,
  checkboxControlArgs,
  checkboxControlArgTypes,
} from './checkbox-controls.ts'
import { ComposedCheckbox } from './checkbox-layouts.tsx'

const meta = {
  args: checkboxControlArgs,
  argTypes: checkboxControlArgTypes,
  parameters: {
    controls: {
      exclude: ['checked', 'indeterminate', 'disabled', 'invalid'],
    },
    layout: 'centered',
  },
  render: (args) => <ComposedCheckbox {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Checkbox/Stories',
} satisfies Meta<CheckboxControls>

export default meta

type Story = StoryObj<CheckboxControls>

export const Default: Story = {}

export const Checked: Story = {
  args: { checked: true },
}

export const Indeterminate: Story = {
  args: { indeterminate: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { invalid: true },
}
