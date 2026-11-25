import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneInput } from '@tc96/ui/patterns/properties/display/phone-input/phone-input'
import { expect, within } from 'storybook/test'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { PhoneInputCanvas } from './phone-input-canvas.tsx'

const ignore = () => undefined

const meta = {
  args: {
    ariaLabel: 'ariaLabel',
    onValueChange: ignore,
    value: '+5511987654321',
    labels: ptBRPropertyLabels.phoneInput,
  },
  component: PhoneInput,
  decorators: [PhoneInputCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/PhoneInput/API Reference',
} satisfies Meta<typeof PhoneInput>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'ariaLabel' })

    await expect(field.closest('[data-slot="phone-input"]')).not.toBeNull()
    await expect(
      canvas.getByRole('combobox', { name: 'País: Brasil' }),
    ).toBeVisible()
  },
}
