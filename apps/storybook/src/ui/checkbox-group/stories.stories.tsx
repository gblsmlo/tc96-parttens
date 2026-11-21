import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CheckboxGroupControls,
  checkboxGroupControlArgs,
  checkboxGroupControlArgTypes,
} from './checkbox-group-controls.ts'
import { ComposedCheckboxGroup } from './checkbox-group-layouts.tsx'

const meta = {
  args: checkboxGroupControlArgs,
  argTypes: checkboxGroupControlArgTypes,
  parameters: {
    controls: { exclude: ['disabled', 'disabledItem'] },
    layout: 'centered',
  },
  render: (args) => <ComposedCheckboxGroup {...args} />,
  tags: ['!autodocs'],
  title: 'UI/CheckboxGroup/Stories',
} satisfies Meta<CheckboxGroupControls>

export default meta

type Story = StoryObj<CheckboxGroupControls>

export const Default: Story = {}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledItem: Story = {
  args: { disabledItem: true },
  name: 'Disabled item',
}
