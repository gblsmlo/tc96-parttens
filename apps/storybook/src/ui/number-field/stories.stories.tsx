import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type NumberFieldControls,
  numberFieldControlArgs,
  numberFieldControlArgTypes,
} from './number-field-controls.ts'
import { NumberFieldCanvas } from './number-field-frame.tsx'
import { ComposedNumberField } from './number-field-layouts.tsx'

const meta = {
  args: numberFieldControlArgs,
  argTypes: numberFieldControlArgTypes,
  decorators: [NumberFieldCanvas],
  parameters: {
    controls: { exclude: ['size', 'disabled', 'invalid'] },
    layout: 'centered',
  },
  render: (args) => <ComposedNumberField {...args} />,
  tags: ['!autodocs'],
  title: 'UI/NumberField/Stories',
} satisfies Meta<NumberFieldControls>

export default meta

type Story = StoryObj<NumberFieldControls>

export const Default: Story = {}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { invalid: true },
}
