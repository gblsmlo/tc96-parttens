import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectCanvas } from './select-canvas.tsx'
import {
  type SelectControls,
  selectControlArgs,
  selectControlArgTypes,
} from './select-controls.ts'
import { ComposedSelect } from './select-layouts.tsx'

const meta = {
  args: selectControlArgs,
  argTypes: selectControlArgTypes,
  decorators: [SelectCanvas],
  parameters: {
    controls: { exclude: ['disabled', 'readOnly', 'value', 'variant'] },
  },
  render: (args) => <ComposedSelect {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Select/Variants',
} satisfies Meta<SelectControls>

export default meta

type Story = StoryObj<SelectControls>

export const Default: Story = {}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const Empty: Story = {
  args: { value: 'none' },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
