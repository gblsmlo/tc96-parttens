import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordGroup,
  RecordGroupMetric,
  RecordGroupMetrics,
  type RecordGroupMetricsColumns,
  type RecordGroupVariant,
} from '@tc96/parttens'
import {
  BadgeCheckIcon,
  HandshakeIcon,
  PercentIcon,
  UsersIcon,
} from 'lucide-react'
import { expect, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import {
  booleanArgType,
  recordGroupArgTypes,
} from '../../../../test-utils/story-arg-types'
import { IconSlot, Slot } from '../fixtures/slot'

interface MetricsArgs {
  columns: RecordGroupMetricsColumns
  icon: boolean
  progress: boolean
  target: boolean
  variant: RecordGroupVariant
}

const hidden = { table: { disable: true } } as const

const usage = `
import { RecordGroup, RecordGroupMetric, RecordGroupMetrics } from '@acme/patterns'

<RecordGroup title="Indicators">
  <RecordGroupMetrics columns={2}>
    <RecordGroupMetric
      icon={<UsersIcon aria-hidden="true" />}
      label="Leads"
      progress={leads / plannedLeads}
      target={\`of \${plannedLeads} planned\`}
      value={leads}
    />
    <RecordGroupMetric icon={<PercentIcon aria-hidden="true" />} label="Conversion" value={conversion} />
  </RecordGroupMetrics>
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'Grid of `RecordGroupMetric` tiles inside a group. `columns` is `2` (the default) or `1`. The grid has no padding, and the content wrapper that holds it drops its own, so the tiles sit on the shell padding in `card` and `inset` and on the group edge in `plain`.',
      name: 'RecordGroupMetrics',
    },
    {
      description:
        'Indicator tile: a `dl` wrapping the COSS `Card`, with `label` and `icon` in the `dt` and `value` in the `dd`. `target` reads after the value, muted, with no separator added: the planned amount or a unit. `progress` is a ratio the consumer computes, clamped to 0..1 (a non-finite ratio is 0), and adds a COSS `Meter` named by the label. The pattern never formats or computes a number.',
      name: 'RecordGroupMetric',
    },
  ],
  description: {
    component:
      '`RecordGroupMetrics` fills a `RecordGroup` with indicator tiles. `Anatomy` shows the slots of a tile (`icon`, `label`, `value`, `target`, `progress`), driven by the controls. `Usage` follows the numbers of a campaign pipeline. `Behavior` is under test: each label is a term read whole, the meter is named by its label with the computed percent, and the tiles of a grid row share one height.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function Indicators({
  columns,
  variant,
}: Readonly<Pick<MetricsArgs, 'columns' | 'variant'>>) {
  const leads = 84
  const plannedLeads = 120

  return (
    <RecordGroup title="Indicadores" variant={variant}>
      <RecordGroupMetrics columns={columns}>
        <RecordGroupMetric
          icon={<UsersIcon aria-hidden />}
          label="Leads"
          progress={leads / plannedLeads}
          target={`de ${plannedLeads} planejados`}
          value={leads}
        />
        <RecordGroupMetric
          icon={<PercentIcon aria-hidden />}
          label="Conversão"
          value="18,5%"
        />
        <RecordGroupMetric
          icon={<BadgeCheckIcon aria-hidden />}
          label="Sucesso"
          target="vendas"
          value={12}
        />
        <RecordGroupMetric
          icon={<HandshakeIcon aria-hidden />}
          label="Em negociação"
          value={9}
        />
      </RecordGroupMetrics>
    </RecordGroup>
  )
}

const meta = {
  args: {
    columns: 2,
    icon: true,
    progress: true,
    target: true,
    variant: 'plain',
  },
  argTypes: {
    columns: { control: 'inline-radio', options: [1, 2] },
    icon: booleanArgType,
    progress: booleanArgType,
    target: booleanArgType,
    variant: recordGroupArgTypes.variant,
  },
  component: RecordGroupMetrics,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Metrics',
} satisfies Meta<MetricsArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ args, canvasElement }) => {
    for (const metric of canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-metric"]',
    )) {
      await expect(
        [...metric.querySelectorAll('[data-slot^="record-group-metric-"]')].map(
          (node) => node.getAttribute('data-slot'),
        ),
      ).toEqual([
        'record-group-metric-value',
        ...(args.target ? ['record-group-metric-target'] : []),
        ...(args.progress ? ['record-group-metric-progress'] : []),
      ])
    }
  },
  render: ({ columns, icon, progress, target, variant }) => (
    <RecordGroup title="Group" variant={variant}>
      <RecordGroupMetrics columns={columns}>
        {['First', 'Second'].map((name) => (
          <RecordGroupMetric
            icon={icon ? <IconSlot /> : undefined}
            key={name}
            label={`${name} label`}
            {...(progress ? { progress: 0.6 } : {})}
            target={target ? <Slot name="target" /> : undefined}
            value={<Slot name="value" />}
          />
        ))}
      </RecordGroupMetrics>
    </RecordGroup>
  ),
}

export const Usage: Story = {
  argTypes: { icon: hidden, progress: hidden, target: hidden },
  render: ({ columns, variant }) => (
    <Indicators columns={columns} variant={variant} />
  ),
}

export const Behavior: Story = {
  argTypes: {
    columns: hidden,
    icon: hidden,
    progress: hidden,
    target: hidden,
    variant: hidden,
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
    for (const label of terms) {
      const text = indicators.getByText(label as string)
      await expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth)
    }
    await expect(indicators.getByText('de 120 planejados')).toBeVisible()
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
  render: () => <Indicators columns={2} variant="plain" />,
}
