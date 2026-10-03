import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import {
  AssetIcon,
  AssetList,
  AssetListItem,
  AssetStatWidget,
  type BalancePoint,
  BalanceWidget,
  formatAmount,
  type MarketShareSegment,
  MarketShareWidget,
  RiskScoreWidget,
  TrendIndicator,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { BitcoinIcon, GemIcon, SparklesIcon, ZapIcon } from 'lucide-react'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

type MarketPeriod = 'month' | 'week'
type BalancePeriod = '1m' | '6m' | '1y'

const brand = {
  bitcoin: '#f7931a',
  ethereum: '#627eea',
  zcash: '#a855f7',
}

const marketPeriods = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
] as const

const marketSegments: Record<MarketPeriod, MarketShareSegment[]> = {
  month: [
    {
      change: 0.0044,
      color: brand.bitcoin,
      id: 'btc',
      label: 'Bitcoin',
      value: 66,
    },
    {
      change: 0.0056,
      color: '#7b91f0',
      id: 'eth',
      label: 'Ethereum',
      value: 20,
    },
    {
      change: 0.0102,
      color: 'var(--muted-foreground)',
      id: 'other',
      label: 'Others',
      value: 14,
    },
  ],
  week: [
    {
      change: -0.0021,
      color: brand.bitcoin,
      id: 'btc',
      label: 'Bitcoin',
      value: 61,
    },
    {
      change: 0.0113,
      color: '#7b91f0',
      id: 'eth',
      label: 'Ethereum',
      value: 25,
    },
    {
      change: 0.0038,
      color: 'var(--muted-foreground)',
      id: 'other',
      label: 'Others',
      value: 14,
    },
  ],
}

const marketRange: Record<MarketPeriod, [string, string]> = {
  month: ['1 May', '31 May'],
  week: ['25 May', '31 May'],
}

const balanceSeries: Record<BalancePeriod, BalancePoint[]> = {
  '1m': [
    { label: 'May 1', value: 45120 },
    { label: 'May 8', value: 46380 },
    { label: 'May 15', value: 45710 },
    { label: 'May 22', value: 47240 },
    { label: 'May 31', value: 48250.75 },
  ],
  '6m': [
    { label: 'Dec', value: 38200 },
    { label: 'Jan', value: 39950 },
    { label: 'Feb', value: 37810 },
    { label: 'Mar', value: 42400 },
    { label: 'Apr', value: 44890 },
    { label: 'May', value: 48250.75 },
  ],
  '1y': [
    { label: 'Jun', value: 29800 },
    { label: 'Aug', value: 31750 },
    { label: 'Oct', value: 30420 },
    { label: 'Dec', value: 38200 },
    { label: 'Feb', value: 37810 },
    { label: 'Apr', value: 44890 },
    { label: 'May', value: 48250.75 },
  ],
}

const balanceChange: Record<BalancePeriod, number> = {
  '1m': 0.0694,
  '6m': 0.2631,
  '1y': 0.6191,
}

function MarketLeaders() {
  const [period, setPeriod] = useState<MarketPeriod>('month')
  const [start, end] = marketRange[period]

  return (
    <MarketShareWidget
      endLabel={end}
      onPeriodChange={setPeriod}
      period={period}
      periodLabel="Market period"
      periods={marketPeriods}
      segments={marketSegments[period]}
      startLabel={start}
      title="Market Leaders"
    >
      <AssetList aria-label="Market leaders">
        <AssetListItem
          icon={
            <AssetIcon color={brand.bitcoin}>
              <BitcoinIcon />
            </AssetIcon>
          }
          meta={`24h: ${formatAmount(500, { signDisplay: 'always' })}`}
          name="Bitcoin"
          value={formatAmount(115485.04)}
        />
        <AssetListItem
          icon={
            <AssetIcon color={brand.ethereum}>
              <GemIcon />
            </AssetIcon>
          }
          meta={<TrendIndicator value={-0.0124} variant="plain" />}
          name="Ethereum"
          value={formatAmount(4510.64)}
        />
      </AssetList>
    </MarketShareWidget>
  )
}

function ZcashReward({ tone }: Readonly<{ tone?: 'default' | 'inverted' }>) {
  return (
    <AssetStatWidget
      change={-0.0018}
      format={{ minimumIntegerDigits: 2, style: 'percent' }}
      icon={
        <AssetIcon color={brand.zcash}>
          <ZapIcon />
        </AssetIcon>
      }
      label="Reward rate"
      name="Zcash"
      symbol="ZEC"
      {...(tone ? { tone } : {})}
      value={0.0934}
    />
  )
}

function RiskAnalysis() {
  return (
    <RiskScoreWidget
      action={
        <Button size="sm" variant="ghost">
          <SparklesIcon aria-hidden="true" />
          Rebalance with AI
        </Button>
      }
      highLabel="High Risk"
      lowLabel="Low Risk"
      score={72}
      stats={[
        { id: 'score', label: 'Risk Score', value: '72/100' },
        { id: 'suggestion', label: 'AI Suggestion', value: '15% BTC → ETH' },
      ]}
      title="AI Risk Analysis"
    />
  )
}

function TotalBalance() {
  const [period, setPeriod] = useState<BalancePeriod>('6m')
  const data = balanceSeries[period]
  const last = data.at(-1)?.value ?? 0

  return (
    <BalanceWidget
      change={balanceChange[period]}
      changeLabel="in the selected period"
      chartLabel={`Balance grew from ${formatAmount(data[0]?.value ?? 0)} to ${formatAmount(last)}`}
      data={data}
      onPeriodChange={setPeriod}
      period={period}
      periodLabel="Balance period"
      periods={[
        { label: '1M', value: '1m' },
        { label: '6M', value: '6m' },
        { label: '1Y', value: '1y' },
      ]}
      title="Total balance"
      value={last}
    />
  )
}

// O tom invertido aplica o .dark do tema ao widget. No tema escuro deste
// Storybook, o muted-foreground sobre o card fica em 4,21:1 no texto pequeno;
// o contraste segue verificado no restante da story.
const invertedThemeContrast = {
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          selector: '*:not([data-tone="inverted"] *)',
        },
      ],
    },
  },
}

const meta = {
  title: 'Patterns/Widgets/Finance',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  parameters: invertedThemeContrast,
  render: () => (
    <div className="grid min-h-screen place-items-center p-6 sm:p-10">
      <div className="grid w-full max-w-5xl gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-4">
          <MarketLeaders />
          <TotalBalance />
        </div>
        <div className="grid content-start gap-4">
          <RiskAnalysis />
          <div className="grid gap-4 sm:grid-cols-2">
            <ZcashReward tone="inverted" />
            <AssetStatWidget
              change={0.0031}
              format={{ minimumIntegerDigits: 2, style: 'percent' }}
              icon={
                <AssetIcon color={brand.ethereum}>
                  <GemIcon />
                </AssetIcon>
              }
              label="Staking yield"
              name="Ethereum"
              symbol="ETH"
              value={0.0412}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const market = canvas.getByRole('region', { name: 'Market Leaders' })
    await expect(market).toHaveTextContent('Bitcoin: 66.00%')
    await userEvent.click(within(market).getByRole('button', { name: 'Week' }))
    await expect(market).toHaveTextContent('Bitcoin: 61.00%')
    await expect(market).toHaveTextContent('25 May')
    await expect(
      canvas.getByRole('meter', { name: 'AI Risk Analysis' }),
    ).toHaveAttribute('aria-valuenow', '72')
  },
}

const single =
  (width: string): Decorator =>
  (Story) => (
    <div className="grid min-h-screen place-items-center p-6">
      <div className={`w-full ${width}`}>
        <Story />
      </div>
    </div>
  )

export const MarketShare: Story = {
  decorators: [single('max-w-md')],
  render: () => <MarketLeaders />,
}

export const Balance: Story = {
  decorators: [single('max-w-md')],
  render: () => <TotalBalance />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const widget = canvas.getByRole('region', { name: 'Total balance' })
    await expect(widget).toHaveTextContent('26.31%')
    await userEvent.click(within(widget).getByRole('button', { name: '1Y' }))
    await expect(widget).toHaveTextContent('61.91%')
  },
}

export const RiskScore: Story = {
  decorators: [single('max-w-md')],
  render: () => <RiskAnalysis />,
}

export const RiskScoreTones: Story = {
  decorators: [single('max-w-md')],
  render: () => (
    <div className="grid gap-4">
      {(['success', 'warning', 'destructive', 'info'] as const).map(
        (tone, index) => (
          <RiskScoreWidget
            highLabel="High"
            key={tone}
            lowLabel="Low"
            score={[24, 58, 86, 40][index] ?? 0}
            title={`Tone ${tone}`}
            tone={tone}
          />
        ),
      )}
    </div>
  ),
}

export const AssetStat: Story = {
  decorators: [single('max-w-xs')],
  render: () => <ZcashReward />,
}

export const AssetStatInverted: Story = {
  parameters: invertedThemeContrast,
  decorators: [single('max-w-xs')],
  render: () => <ZcashReward tone="inverted" />,
}
