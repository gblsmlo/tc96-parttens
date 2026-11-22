import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectProperty } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { SelectCanvas } from './select-canvas.tsx'
import { activityOptions } from './select-data.ts'

const ignore = () => undefined

const meta = {
  args: {
    ariaLabel: 'Tipo',
    onValueChange: ignore,
    options: activityOptions,
    value: 'meeting',
  },
  component: SelectProperty,
  decorators: [SelectCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Select/API Reference',
} satisfies Meta<typeof SelectProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Tipo: Reunião',
    })

    await expect(trigger).toHaveAttribute('data-slot', 'property-surface')
    await expect(
      trigger.querySelector('[data-slot="property-icon"]'),
    ).not.toBeNull()
  },
}
