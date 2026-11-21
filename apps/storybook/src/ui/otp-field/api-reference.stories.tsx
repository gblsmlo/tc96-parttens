import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldLabel } from '@tc96/ui/field'
import { OTPField, OTPFieldInput, OTPFieldSeparator } from '@tc96/ui/otp-field'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { OTPFieldCanvas } from './otp-field-frame.tsx'

const meta = {
  args: { length: 4 },
  component: OTPField,
  decorators: [OTPFieldCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/OTPField/API Reference',
} satisfies Meta<typeof OTPField>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Field>
      <FieldLabel>
        <Slot name="FieldLabel" />
      </FieldLabel>
      <OTPField {...args} length={4}>
        <OTPFieldInput />
        <OTPFieldInput aria-label="Character 2 of 4" />
        <OTPFieldSeparator />
        <OTPFieldInput aria-label="Character 3 of 4" />
        <OTPFieldInput aria-label="Character 4 of 4" />
      </OTPField>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'FieldLabel',
    })
    await expect(within(group).getAllByRole('textbox')).toHaveLength(4)
    await expect(within(group).getByRole('separator')).toBeVisible()
  },
}
