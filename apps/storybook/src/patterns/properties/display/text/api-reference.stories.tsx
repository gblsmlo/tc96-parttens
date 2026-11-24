import { ShapesIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextProperty } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { TextCanvas } from './text-canvas.tsx'

const meta = {
  args: {
    ariaLabel: 'Tipo',
    copyLabel: 'Copiar tipo',
    icon: ShapesIcon,
    value: 'Solicitação de documento',
  },
  component: TextProperty,
  decorators: [TextCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Text/API Reference',
} satisfies Meta<typeof TextProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const value = within(canvasElement).getByRole('group', {
      name: 'Tipo: Solicitação de documento',
    })

    await expect(value).toHaveAttribute('data-slot', 'property-surface')
    await expect(
      value.querySelector('[data-slot="property-icon"]'),
    ).not.toBeNull()
    await expect(
      value.querySelector('[data-slot="text-property-copy"]'),
    ).not.toBeNull()
  },
}
