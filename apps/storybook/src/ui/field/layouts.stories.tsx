import type { Meta, StoryObj } from '@storybook/react-vite'
import { fieldControlArgs } from './field-controls.ts'
import { FieldCanvas } from './field-frame.tsx'
import {
  CheckboxInLabelField,
  ComposedField,
  FieldControlField,
  RadioItemsField,
  TextareaField,
  ValidityField,
} from './field-layouts.tsx'

const meta = {
  decorators: [FieldCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Field/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutDescription: Story = {
  render: () => <ComposedField {...fieldControlArgs} description="" />,
}

export const WithRequiredIndicator: Story = {
  render: () => <ComposedField {...fieldControlArgs} required />,
}

export const WithTextarea: Story = {
  render: () => <TextareaField />,
}

export const CheckboxInLabel: Story = {
  render: () => <CheckboxInLabelField />,
}

export const RadioItems: Story = {
  render: () => <RadioItemsField />,
}

export const WithFieldControl: Story = {
  render: () => <FieldControlField />,
}

export const WithValidity: Story = {
  render: () => <ValidityField />,
}
