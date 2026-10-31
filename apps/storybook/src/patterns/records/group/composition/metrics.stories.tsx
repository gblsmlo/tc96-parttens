import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroupMetrics } from '@tc96/parttens'
import { expect } from 'storybook/test'

const grid = (canvasElement: HTMLElement) =>
  canvasElement.querySelector(
    '[data-slot="record-group-metrics"]',
  ) as HTMLElement

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Composition/Metrics',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const TwoColumnsByDefault: Story = {
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

export const OneColumnWithClassName: Story = {
  render: () => <RecordGroupMetrics className="extra" columns={1} />,
  play: async ({ canvasElement }) => {
    await expect(grid(canvasElement).className).toContain('grid-cols-1')
    await expect(grid(canvasElement).className).not.toContain('grid-cols-2')
    await expect(grid(canvasElement).className).toContain('extra')
  },
}
