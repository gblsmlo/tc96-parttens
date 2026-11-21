import type { Meta, StoryObj } from '@storybook/react-vite'
import { inputControlArgs } from './input-controls.ts'
import { InputCanvas } from './input-frame.tsx'
import { ButtonInput, FieldInput, LabeledInput } from './input-layouts.tsx'

const meta = {
  decorators: [InputCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Input/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithLabel: Story = {
  render: () => <LabeledInput {...inputControlArgs} />,
}

export const WithButton: Story = {
  render: () => <ButtonInput {...inputControlArgs} />,
}

export const InField: Story = {
  render: () => <FieldInput {...inputControlArgs} />,
}
