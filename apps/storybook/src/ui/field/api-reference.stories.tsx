import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { FieldCanvas } from './field-frame.tsx'

const meta = {
  component: Field,
  decorators: [FieldCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Field/API Reference',
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Field {...args}>
      <FieldLabel>
        <Slot name="FieldLabel" />
      </FieldLabel>
      <Input placeholder="Control" type="text" />
      <FieldDescription>
        <Slot name="FieldDescription" />
      </FieldDescription>
      <FieldError match>
        <Slot name="FieldError" />
      </FieldError>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const part of ['FieldLabel', 'FieldDescription', 'FieldError']) {
      await expect(canvas.getByText(part)).toBeVisible()
    }
    await expect(canvas.getByRole('textbox')).toHaveAccessibleName('FieldLabel')
  },
}
