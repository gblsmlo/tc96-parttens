import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { PhoneInputCanvas } from './phone-input-canvas.tsx'
import { StatefulPhoneInput } from './phone-input-layouts.tsx'

const meta = {
  decorators: [PhoneInputCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Phone Input/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ContactMobile: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-2">
      <span className="font-medium text-sm">Celular</span>
      <StatefulPhoneInput
        ariaLabel="Celular"
        placeholder="(11) 91234-5678"
        value="+5511987654321"
      />
      <p className="text-muted-foreground text-xs">
        Usado para lembretes por WhatsApp e SMS.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Celular' }),
    ).toHaveValue('(11) 98765-4321')
  },
}

export const LisbonOffice: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-2">
      <span className="font-medium text-sm">Escritório em Lisboa</span>
      <StatefulPhoneInput
        ariaLabel="Escritório em Lisboa"
        defaultCountry="PT"
        value="+351912345678"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'País: Portugal' }),
    ).toBeVisible()
  },
}

export const RejectedNumber: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-2">
      <span className="font-medium text-sm">Telefone comercial</span>
      <StatefulPhoneInput
        ariaLabel="Telefone comercial"
        invalid
        value="+55119876"
      />
      <p className="text-destructive-foreground text-xs" role="alert">
        Informe um telefone válido.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', {
        name: 'Telefone comercial',
      }),
    ).toHaveAttribute('aria-invalid', 'true')
  },
}
