import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats3 } from '@tc96/blocks/application/stats/stats-3'
import { expect, within } from 'storybook/test'
import { capacity } from '../fixtures/stats-3.ts'
import { type Stats3Controls, stats3ControlArgs } from './stats-3-controls.ts'
import { ComposedStats3 } from './stats-3-layouts.tsx'

const meta = {
  args: stats3ControlArgs,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStats3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats3/Behavior',
} satisfies Meta<Stats3Controls>

export default meta

type Story = StoryObj<typeof meta>

export const EachCellShowsValueOverTotal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const meters = canvas.getAllByRole('meter')
    await expect(meters).toHaveLength(3)
    await expect(meters[0]).toHaveAttribute('aria-valuetext', '18 / 25')
    await expect(meters[1]).toHaveAttribute('aria-valuetext', '64 / 100')
    await expect(meters[2]).toHaveAttribute('aria-valuetext', '3 / 10')
    await expect(meters[0]).toHaveAccessibleName('Assentos')
  },
}

export const FilledBarsFollowTheRatio: Story = {
  play: async ({ canvasElement }) => {
    const filled = within(canvasElement)
      .getAllByRole('meter')
      .map((meter) => meter.querySelectorAll('[data-filled="true"]').length)
    await expect(filled).toEqual([7, 6, 3])
  },
}

export const SegmentsSetsTheBarCount: Story = {
  args: { segments: 5 },
  play: async ({ canvasElement }) => {
    const meters = within(canvasElement).getAllByRole('meter')
    for (const meter of meters) {
      await expect(meter.querySelectorAll('span[data-filled]')).toHaveLength(5)
    }
    await expect(
      meters[0].querySelectorAll('[data-filled="true"]'),
    ).toHaveLength(4)
  },
}

export const ValueAboveTotalFillsEveryBar: Story = {
  render: () => (
    <Stats3
      items={[{ id: 'seats', label: 'Assentos', total: 25, value: 40 }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter')
    await expect(meter.querySelectorAll('[data-filled="true"]')).toHaveLength(
      10,
    )
    await expect(meter).toHaveAttribute('aria-valuenow', '25')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Stats3
      items={capacity}
      labels={{
        ratio: (value, total) => `${value} de ${total}`,
        title: 'Limites',
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'Limites' })).toBeVisible()
    await expect(canvas.getAllByText('18 de 25')).not.toHaveLength(0)
    await expect(canvas.queryByText('18 / 25')).toBeNull()
  },
}
