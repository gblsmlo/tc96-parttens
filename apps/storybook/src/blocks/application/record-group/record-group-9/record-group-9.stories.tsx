import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroup9 as RecordGroup9Block } from '@tc96/ui/blocks/application/record-group/record-group-9'
import { expect, within } from 'storybook/test'
import { indicatorLabels, pipelineMetrics } from '../fixtures/indicators.ts'

function PipelineIndicators() {
  return (
    <RecordGroup9Block labels={indicatorLabels} metrics={pipelineMetrics} />
  )
}

const meta = {
  component: PipelineIndicators,
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Group/RecordGroup9',
} satisfies Meta<typeof PipelineIndicators>

export default meta

type Story = StoryObj<typeof meta>

export const RecordGroup9: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The numbers of a campaign pipeline in a plain group, as tiles in two columns: each metric (id, label, value, icon and an optional target text and progress with a value and a max) renders read-only, and a progress shows as a meter. The consumer computes and formats every number.',
      },
    },
  },
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
    await expect(indicators.getByText('de 120 planejados')).toBeVisible()
    await expect(
      indicators.getByRole('meter', { name: 'Leads' }),
    ).toHaveAttribute('aria-valuenow', '70')
    for (const label of terms) {
      const text = indicators.getByText(label as string)
      await expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth)
    }
  },
}
