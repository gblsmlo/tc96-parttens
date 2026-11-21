import type { Meta, StoryObj } from '@storybook/react-vite'
import { numberFieldControlArgs } from './number-field-controls.ts'
import { NumberFieldCanvas } from './number-field-frame.tsx'
import {
  ComposedNumberField,
  FieldNumberField,
  LabeledNumberField,
} from './number-field-layouts.tsx'

const meta = {
  decorators: [NumberFieldCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/NumberField/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithScrubArea: Story = {
  render: () => <ComposedNumberField {...numberFieldControlArgs} scrubArea />,
}

export const WithoutSteppers: Story = {
  render: () => (
    <ComposedNumberField {...numberFieldControlArgs} steppers={false} />
  ),
}

export const WithLabel: Story = {
  render: () => <LabeledNumberField {...numberFieldControlArgs} />,
}

export const InField: Story = {
  render: () => <FieldNumberField {...numberFieldControlArgs} />,
}
