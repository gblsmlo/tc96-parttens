import type { Meta, StoryObj } from '@storybook/react-vite'
import { textareaControlArgs } from './textarea-controls.ts'
import { TextareaCanvas } from './textarea-frame.tsx'
import {
  ButtonTextarea,
  FieldTextarea,
  LabeledTextarea,
} from './textarea-layouts.tsx'

const meta = {
  decorators: [TextareaCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Textarea/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithLabel: Story = {
  render: () => <LabeledTextarea {...textareaControlArgs} />,
}

export const WithButton: Story = {
  render: () => <ButtonTextarea {...textareaControlArgs} />,
}

export const InField: Story = {
  render: () => <FieldTextarea {...textareaControlArgs} />,
}
