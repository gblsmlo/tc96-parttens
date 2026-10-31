import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroupMetric } from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const slotOf = (canvasElement: HTMLElement, name: string) =>
  canvasElement.querySelector(`[data-slot="${name}"]`) as HTMLElement | null

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Composition/Metric',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const LabelIsTermValueIsDescription: Story = {
  render: () => (
    <RecordGroupMetric
      icon={<svg data-testid="icon" />}
      label="Conversão"
      value="18,5%"
    />
  ),
  play: async ({ canvasElement }) => {
    const metric = slotOf(canvasElement, 'record-group-metric') as HTMLElement
    const term = metric.querySelector('dt') as HTMLElement

    await expect(metric.tagName).toBe('DL')
    await expect(metric.querySelector('[data-slot="card"]')).not.toBeNull()
    await expect(term.textContent).toBe('Conversão')
    await expect(
      within(canvasElement).getByTestId('icon').parentElement,
    ).toHaveAttribute('aria-hidden', 'true')
    await expect(
      slotOf(canvasElement, 'record-group-metric-value')?.textContent,
    ).toBe('18,5%')
  },
}

export const TargetAndProgressOnlyWhenPassed: Story = {
  render: () => <RecordGroupMetric label="Leads" value="84" />,
  play: async ({ canvasElement }) => {
    await expect(slotOf(canvasElement, 'record-group-metric-target')).toBeNull()
    await expect(
      slotOf(canvasElement, 'record-group-metric-progress'),
    ).toBeNull()
    await expect(within(canvasElement).queryByRole('meter')).toBeNull()
  },
}

export const MeterNamedByLabelAndClamped: Story = {
  render: () => (
    <RecordGroupMetric
      label="Leads"
      progress={1.4}
      target="de 120 planejados"
      value="168"
    />
  ),
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', { name: 'Leads' })

    await expect(
      slotOf(canvasElement, 'record-group-metric-target')?.textContent,
    ).toBe('de 120 planejados')
    await expect(
      slotOf(canvasElement, 'record-group-metric-value')?.textContent,
    ).toBe('168de 120 planejados')
    await expect(meter).toHaveAttribute('aria-valuenow', '100')
  },
}

export const NegativeOrNonFiniteProgressIsEmpty: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <RecordGroupMetric label="Vendas" progress={-0.2} value="0" />
      <RecordGroupMetric label="Sucesso" progress={Number.NaN} value="0" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const name of ['Vendas', 'Sucesso']) {
      await expect(
        within(canvasElement).getByRole('meter', { name }),
      ).toHaveAttribute('aria-valuenow', '0')
    }
  },
}

export const MergesClassNameOnTheList: Story = {
  render: () => (
    <RecordGroupMetric className="extra" label="Leads" value="84" />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      slotOf(canvasElement, 'record-group-metric')?.className,
    ).toContain('extra')
  },
}
