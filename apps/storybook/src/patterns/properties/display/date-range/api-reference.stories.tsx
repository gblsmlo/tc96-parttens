import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateRangeProperty } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { DateRangeCanvas } from './date-range-canvas.tsx'
import { sampleFrom, sampleTo } from './date-range-layouts.tsx'

const meta = {
  args: {
    ariaLabel: 'ariaLabel',
    displayLabel: 'displayLabel',
    onValueChange: () => undefined,
    value: { from: sampleFrom, to: sampleTo },
    labels: ptBRPropertyLabels.dateRange,
  },
  component: DateRangeProperty,
  decorators: [DateRangeCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/DateRange/API Reference',
} satisfies Meta<typeof DateRangeProperty>

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
