import type { Meta, StoryObj } from '@storybook/react-vite'
import { CardPanel } from '@tc96/ui/card'
import {
  Amount,
  AvatarStack,
  ExpandableList,
  ProgressRing,
  StatList,
  TrendIndicator,
  WidgetPeriodToggle,
  WidgetShell,
} from '@tc96/ui/patterns'
import { expect, fn, userEvent, within } from 'storybook/test'
import { WidgetsCanvas } from './widgets-canvas.tsx'

interface BehaviorArgs {
  onExpandedChange: (expanded: boolean) => void
  onValueChange: (period: string) => void
}

const items = Array.from({ length: 8 }, (_, index) => `Item ${index + 1}`)

const ItemList = ({ shown }: Readonly<{ shown: readonly string[] }>) => (
  <ul>
    {shown.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

const weekOrMonth = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
] as const

const meta = {
  args: { onExpandedChange: fn(), onValueChange: fn() },
  argTypes: {
    onExpandedChange: { control: false },
    onValueChange: { control: false },
  },
  decorators: [WidgetsCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const amountOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="amount"]')

const trendIndicators = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll('[data-slot="trend-indicator"]'),
]

const expandableList = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="expandable-list"]')

export const FormatsCurrencyByDefault: Story = {
  render: () => <Amount value={48250.75} />,
  play: async ({ canvasElement }) => {
    await expect(amountOf(canvasElement)?.textContent).toBe('$48,250.75')
  },
}

export const DimsFractionOnRequest: Story = {
  render: () => (
    <Amount
      dimFraction
      format={{ minimumIntegerDigits: 2, style: 'percent' }}
      value={0.0934}
    />
  ),
  play: async ({ canvasElement }) => {
    const amount = amountOf(canvasElement)
    await expect(amount?.textContent).toBe('09.34%')
    await expect(
      amount?.querySelector('.text-muted-foreground')?.textContent,
    ).toBe('.34%')
  },
}

export const KeepsFractionUndimmedByDefault: Story = {
  render: () => <Amount value={48250.75} />,
  play: async ({ canvasElement }) => {
    await expect(
      amountOf(canvasElement)?.querySelector('.text-muted-foreground'),
    ).toBeNull()
  },
}

export const DirectionComesFromTheSign: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <TrendIndicator value={0.0044} />
      <TrendIndicator value={-0.0018} variant="plain" />
      <TrendIndicator value={0} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const indicators = trendIndicators(canvasElement)
    await expect(
      indicators.map((node) => node.getAttribute('data-direction')),
    ).toEqual(['up', 'down', 'flat'])
    await expect(indicators.map((node) => node.textContent)).toEqual([
      'Alta de 0.44%',
      'Queda de 0.18%',
      'Sem variação 0.00%',
    ])
  },
}

export const LabelsAndFormatAreOverridable: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <TrendIndicator
        format={{ maximumFractionDigits: 1, style: 'decimal' }}
        labels={{ down: 'Down', flat: 'Flat', up: 'Up' }}
        value={0.5}
      />
      <TrendIndicator
        format={{ maximumFractionDigits: 1, style: 'decimal' }}
        labels={{ down: 'Down', flat: 'Flat', up: 'Up' }}
        value={-2}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      trendIndicators(canvasElement).map((node) => node.textContent),
    ).toEqual(['Up 0.5', 'Down 2'])
  },
}

export const PlainVariantTintsTheText: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <TrendIndicator value={0.02} variant="plain" />
      <TrendIndicator value={-0.02} variant="plain" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [up, down] = trendIndicators(canvasElement)
    await expect(up).toHaveClass('text-success-foreground')
    await expect(down).toHaveClass('text-destructive-foreground')
  },
}

export const KeepsOnePeriodActive: Story = {
  render: ({ onValueChange }) => (
    <WidgetPeriodToggle
      aria-label="Período do gráfico"
      onValueChange={onValueChange}
      options={weekOrMonth}
      value="month"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Período do gráfico' }),
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Month' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Week' }))
    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await expect(args.onValueChange).toHaveBeenCalledWith('week')
  },
}

export const MarksTheActivePeriod: Story = {
  render: ({ onValueChange }) => (
    <WidgetPeriodToggle
      onValueChange={onValueChange}
      options={weekOrMonth}
      value="month"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Month' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(canvas.getByRole('button', { name: 'Week' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  },
}

export const CollapsesBeyondVisibleCount: Story = {
  render: () => (
    <ExpandableList
      expandLabel={(hidden) => `Ver todas (+${hidden})`}
      items={items}
      visibleCount={3}
    >
      {(shown) => <ItemList shown={shown} />}
    </ExpandableList>
  ),
  play: async ({ canvasElement }) => {
    await expect(expandableList(canvasElement)).toHaveAttribute(
      'data-expanded',
      'false',
    )
    await expect(canvasElement.querySelectorAll('li')).toHaveLength(3)
    await expect(
      within(canvasElement).getByRole('button', { name: 'Ver todas (+5)' }),
    ).toBeVisible()
  },
}

export const ExpandsIntoAScrollArea: Story = {
  render: () => (
    <ExpandableList
      expandLabel={(hidden) => `Ver todas (+${hidden})`}
      items={items}
      visibleCount={3}
    >
      {(shown) => <ItemList shown={shown} />}
    </ExpandableList>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ver todas (+5)' }),
    )
    await expect(expandableList(canvasElement)).toHaveAttribute(
      'data-expanded',
      'true',
    )
    await expect(canvasElement.querySelectorAll('li')).toHaveLength(8)
    await expect(
      canvasElement.querySelector('[data-slot="expandable-list-scroll"]'),
    ).not.toBeNull()
  },
}

export const CollapsesBackOnRequest: Story = {
  render: () => (
    <ExpandableList
      expandLabel={(hidden) => `Ver todas (+${hidden})`}
      items={items}
      visibleCount={3}
    >
      {(shown) => <ItemList shown={shown} />}
    </ExpandableList>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ver todas (+5)' }),
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Ver menos' }))
    await expect(expandableList(canvasElement)).toHaveAttribute(
      'data-expanded',
      'false',
    )
    await expect(canvasElement.querySelectorAll('li')).toHaveLength(3)
  },
}

export const StaysControlledWhenExpandedIsPassed: Story = {
  render: ({ onExpandedChange }) => (
    <ExpandableList
      expanded={false}
      expandLabel={(hidden) => `Ver todas (+${hidden})`}
      items={items}
      onExpandedChange={onExpandedChange}
      visibleCount={3}
    >
      {(shown) => <ItemList shown={shown} />}
    </ExpandableList>
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ver todas (+5)' }),
    )
    await expect(args.onExpandedChange).toHaveBeenCalledOnce()
    await expect(args.onExpandedChange).toHaveBeenLastCalledWith(true)
    await expect(expandableList(canvasElement)).toHaveAttribute(
      'data-expanded',
      'false',
    )
    await expect(canvasElement.querySelectorAll('li')).toHaveLength(3)
  },
}

export const DoesNotCollapseShortLists: Story = {
  render: () => (
    <ExpandableList items={items.slice(0, 3)} visibleCount={5}>
      {(shown) => <ItemList shown={shown} />}
    </ExpandableList>
  ),
  play: async ({ canvasElement }) => {
    await expect(expandableList(canvasElement)).not.toHaveAttribute(
      'data-expanded',
    )
    await expect(canvasElement.querySelectorAll('li')).toHaveLength(3)
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
  },
}

export const MountsARegionNamedByTheConsumer: Story = {
  render: () => (
    <WidgetShell aria-label="Moldura" className="p-2">
      conteúdo
    </WidgetShell>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('section[data-slot="card"]'),
    ).not.toBeNull()
    await expect(
      within(canvasElement).getByRole('region', { name: 'Moldura' }),
    ).toBeVisible()
  },
}

export const KeepsTransparentBorderAndCardShadow: Story = {
  render: () => (
    <WidgetShell aria-label="Moldura" className="p-2">
      conteúdo
    </WidgetShell>
  ),
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('section[data-slot="card"]')
    const tokens = (shell?.className ?? '').split(/\s+/)
    for (const token of [
      'border',
      'border-transparent',
      'shadow-(shadow:--card-shadow)',
      'not-dark:bg-clip-padding',
      'bg-card',
      'min-w-0',
      'p-2',
    ])
      await expect(tokens).toContain(token)
    for (const token of [
      'border-border/80',
      'border-0',
      'shadow-none',
      'before:hidden',
    ])
      await expect(tokens).not.toContain(token)
  },
}

export const StatListPairsLabelsWithValues: Story = {
  render: () => (
    <WidgetShell aria-label="Revenue">
      <CardPanel className="p-5">
        <StatList
          stats={[
            { id: 'current', label: 'This month', value: '$12,450' },
            { id: 'previous', label: 'Last month', value: '$10,230' },
          ]}
        />
      </CardPanel>
    </WidgetShell>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('This month', { selector: 'dt' }).nextElementSibling,
    ).toHaveTextContent('$12,450')
    await expect(
      canvas.getByText('Last month', { selector: 'dt' }).nextElementSibling,
    ).toHaveTextContent('$10,230')
  },
}

export const ProgressRingMarksEmptyApartFromZero: Story = {
  render: () => (
    <div className="flex gap-4">
      <ProgressRing ratio={0} />
      <ProgressRing empty ratio={0} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [zero, empty] = canvasElement.querySelectorAll(
      '[data-slot="progress-ring"]',
    )
    await expect(zero).toHaveAttribute('aria-hidden', 'true')
    await expect(zero).not.toHaveAttribute('data-empty')
    await expect(zero?.querySelectorAll('circle')).toHaveLength(2)
    await expect(empty).toHaveAttribute('aria-hidden', 'true')
    await expect(empty).toHaveAttribute('data-empty', 'true')
    await expect(empty?.querySelectorAll('circle')).toHaveLength(1)
  },
}

export const AvatarStackNamesPeopleAndFoldsOverflow: Story = {
  render: () => (
    <AvatarStack
      aria-label="Team"
      max={2}
      people={[
        { id: 'ana', label: 'Ana Martins' },
        { id: 'gabriel', label: 'Gabriel Melo' },
        { id: 'cris', label: 'Cris Lopes' },
        { id: 'dani', label: 'Dani Reis' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const team = within(canvasElement).getByRole('list', { name: 'Team' })
    await expect(within(team).getAllByRole('listitem')).toHaveLength(3)
    await expect(team).toHaveTextContent('AMAna Martins')
    await expect(
      team.querySelector('[data-slot="avatar-stack-overflow"]'),
    ).toHaveTextContent('+2Cris Lopes, Dani Reis')
  },
}
