import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReferenceProperty } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { ReferenceCanvas } from './reference-canvas.tsx'

const meta = {
  args: { ariaLabel: 'ariaLabel', kind: 'record', label: 'label' },
  component: ReferenceProperty,
  decorators: [ReferenceCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Reference/API Reference',
} satisfies Meta<typeof ReferenceProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const chip = within(canvasElement).getByRole('img', {
      name: 'ariaLabel: label',
    })

    await expect(
      chip.querySelector('[data-slot="property-icon"]'),
    ).not.toBeNull()
  },
}
