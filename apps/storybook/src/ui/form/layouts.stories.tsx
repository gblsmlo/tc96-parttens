import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormCanvas } from './form-frame.tsx'
import { DialogForm, InlineForm, SeveralFieldsForm } from './form-layouts.tsx'

const meta = {
  decorators: [FormCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Form/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SeveralFields: Story = {
  render: () => <SeveralFieldsForm />,
}

export const Inline: Story = {
  render: () => <InlineForm />,
}

export const InDialog: Story = {
  render: () => <DialogForm />,
}
