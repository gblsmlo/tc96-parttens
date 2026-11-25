import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateProperty, DatePropertyBadge } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { DateCanvas } from './date-canvas.tsx'

const ignore = () => undefined

const meta = {
  args: {
    ariaLabel: 'ariaLabel',
    displayLabel: 'displayLabel',
    onValueChange: ignore,
    value: '2026-06-19T12:00:00.000Z',
    labels: ptBRPropertyLabels.date,
  },
  component: DateProperty,
  decorators: [DateCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Date/API Reference',
} satisfies Meta<typeof DateProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'ariaLabel: displayLabel',
    })

    await expect(
      trigger.querySelector('[data-slot="property-icon"]'),
    ).not.toBeNull()
  },
}

export const BadgeAnatomy: Story = {
  render: () => (
    <DatePropertyBadge
      displayLabel="DatePropertyBadge"
      value="2026-06-19T12:00:00.000Z"
      labels={ptBRPropertyLabels.date}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="property-surface"]'),
    ).not.toBeNull()
  },
}
