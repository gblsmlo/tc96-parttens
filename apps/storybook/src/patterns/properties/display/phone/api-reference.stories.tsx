import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneProperty } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { PhoneCanvas } from './phone-canvas.tsx'

const ignore = () => undefined

const meta = {
  args: { onValueChange: ignore, value: ['+5511987654321'] },
  component: PhoneProperty,
  decorators: [PhoneCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Phone/API Reference',
} satisfies Meta<typeof PhoneProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByRole('group', { name: 'Telefones' })

    await expect(row).toHaveAttribute('data-slot', 'phone-property')
    await expect(
      within(row).getByRole('button', { name: 'Adicionar telefone' }),
    ).toBeVisible()
  },
}

export const TriggerAnatomy: Story = {
  args: { display: 'trigger' },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Telefones: +55 11 98765 4321',
    })

    await expect(trigger).toHaveAttribute('data-slot', 'popover-trigger')
    await expect(
      trigger.querySelector('[data-slot="property-icon"]'),
    ).toBeInTheDocument()
  },
}
