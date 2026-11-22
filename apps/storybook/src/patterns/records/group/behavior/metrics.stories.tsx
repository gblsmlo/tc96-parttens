import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroupMetrics } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { IndicatorsGroup } from '../layouts/metrics'
import { RecordGroupCanvas } from '../record-group-canvas'

const grid = (canvasElement: HTMLElement) =>
  canvasElement.querySelector(
    '[data-slot="record-group-metrics"]',
  ) as HTMLElement

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Behavior',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const MetricsTwoColumnsByDefault: Story = {
  render: () => (
    <RecordGroupMetrics>
      <span>Leads</span>
    </RecordGroupMetrics>
  ),
  play: async ({ canvasElement }) => {
    await expect(grid(canvasElement).tagName).toBe('DIV')
    await expect(grid(canvasElement).className).toContain('grid-cols-2')
    await expect(grid(canvasElement).textContent).toBe('Leads')
  },
}

export const MetricsOneColumnWithClassName: Story = {
  render: () => <RecordGroupMetrics className="extra" columns={1} />,
  play: async ({ canvasElement }) => {
    await expect(grid(canvasElement).className).toContain('grid-cols-1')
    await expect(grid(canvasElement).className).not.toContain('grid-cols-2')
    await expect(grid(canvasElement).className).toContain('extra')
  },
}

export const MetricsTilesReadWholeAndShareTheRowHeight: Story = {
  decorators: [RecordGroupCanvas],
  play: async ({ canvasElement }) => {
    const indicators = within(
      within(canvasElement).getByRole('region', { name: 'Indicadores' }),
    )
    const terms = indicators
      .getAllByRole('term')
      .map((term) => term.textContent)

    await expect(terms).toEqual([
      'Leads',
      'Conversão',
      'Sucesso',
      'Em negociação',
    ])
    for (const label of terms) {
      const text = indicators.getByText(label as string)
      await expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth)
    }
    await expect(
      indicators.getByRole('meter', { name: 'Leads' }),
    ).toHaveAttribute('aria-valuenow', '70')

    const [leads, conversion] = [
      ...canvasElement.querySelectorAll<HTMLElement>('[data-slot="card"]'),
    ]
    await expect(leads?.getBoundingClientRect().top).toBe(
      conversion?.getBoundingClientRect().top,
    )
    await expect(leads?.getBoundingClientRect().height).toBe(
      conversion?.getBoundingClientRect().height,
    )
  },
  render: () => <IndicatorsGroup />,
}
