import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { PhoneInputCanvas } from './phone-input-canvas.tsx'
import { phoneInputControlArgs } from './phone-input-controls.ts'
import { LabelOverFieldPhoneInput } from './phone-input-layouts.tsx'

const meta = {
  decorators: [PhoneInputCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/PhoneInput/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ContactMobile: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The mobile number of a contact, on the [Label Over Field](?path=/story/patterns-properties-display-phoneinput-layouts--label-over-field) layout: the hint says what the number is for.',
      },
    },
  },
  render: () => (
    <LabelOverFieldPhoneInput
      {...phoneInputControlArgs}
      ariaLabel="Celular"
      message="Usado para lembretes por WhatsApp e SMS."
      placeholder="(11) 91234-5678"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Celular' }),
    ).toHaveValue('(11) 98765-4321')
  },
}

export const LisbonOffice: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The number of an office abroad, on the [Label Over Field](?path=/story/patterns-properties-display-phoneinput-layouts--label-over-field) layout with no message: the country comes from the number, Portugal.',
      },
    },
  },
  render: () => (
    <LabelOverFieldPhoneInput
      {...phoneInputControlArgs}
      ariaLabel="Escritório em Lisboa"
      defaultCountry="PT"
      value="+351912345678"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'País: Portugal' }),
    ).toBeVisible()
  },
}

export const RejectedNumber: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A business number the consumer rejected, on the [Label Over Field](?path=/story/patterns-properties-display-phoneinput-layouts--label-over-field) layout: the field is marked invalid and the consumer shows the message under it.',
      },
    },
  },
  render: () => (
    <LabelOverFieldPhoneInput
      {...phoneInputControlArgs}
      ariaLabel="Telefone comercial"
      invalid
      message="Informe um telefone válido."
      value="+55119876"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', {
        name: 'Telefone comercial',
      }),
    ).toHaveAttribute('aria-invalid', 'true')
  },
}
