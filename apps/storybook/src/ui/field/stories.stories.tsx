import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type FieldControls,
  fieldControlArgs,
  fieldControlArgTypes,
} from './field-controls.ts'
import { FieldCanvas } from './field-frame.tsx'
import { ComposedField } from './field-layouts.tsx'

const meta = {
  args: fieldControlArgs,
  argTypes: fieldControlArgTypes,
  decorators: [FieldCanvas],
  parameters: {
    controls: { exclude: ['disabled', 'invalid'] },
    layout: 'centered',
  },
  render: (args) => <ComposedField {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Field/Stories',
} satisfies Meta<FieldControls>

export default meta

type Story = StoryObj<FieldControls>

export const Default: Story = {}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { invalid: true },
}
