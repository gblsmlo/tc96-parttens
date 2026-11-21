import type { Meta, StoryObj } from '@storybook/react-vite'
import { FieldsetCanvas } from './fieldset-frame.tsx'
import { NestedFieldset, RadioGroupFieldset } from './fieldset-layouts.tsx'

const meta = {
  decorators: [FieldsetCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Fieldset/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Nested: Story = {
  render: () => <NestedFieldset />,
}

export const WithRadioGroup: Story = {
  render: () => <RadioGroupFieldset />,
}
