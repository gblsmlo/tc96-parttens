import { afterEach, expect, test } from 'bun:test'

await import('../properties/test/dom')

class ResizeObserverStub {
  disconnect() {}
  observe() {}
  unobserve() {}
}
Object.assign(globalThis, { ResizeObserver: ResizeObserverStub })

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const {
  Amount,
  AssetList,
  AssetListItem,
  AssetStatWidget,
  BalanceWidget,
  CardWidgetShell,
  MarketShareWidget,
  RiskScoreWidget,
  TrendIndicator,
  WidgetPeriodToggle,
} = await import('./index')

afterEach(cleanup)

test('dims the fraction of an amount on request', () => {
  const { container } = render(
    <Amount
      dimFraction
      format={{ minimumIntegerDigits: 2, style: 'percent' }}
      value={0.0934}
    />,
  )
  const amount = container.querySelector('[data-slot="amount"]')
  expect(amount?.textContent).toBe('09.34%')
  expect(amount?.querySelector('.text-muted-foreground')?.textContent).toBe(
    '.34%',
  )
})

test('announces the trend direction that the arrow only shows', () => {
  const { container } = render(
    <>
      <TrendIndicator value={0.0044} />
      <TrendIndicator value={-0.0018} variant="plain" />
      <TrendIndicator value={0} />
    </>,
  )
  const indicators = [
    ...container.querySelectorAll('[data-slot="trend-indicator"]'),
  ]
  expect(indicators.map((node) => node.getAttribute('data-direction'))).toEqual(
    ['up', 'down', 'flat'],
  )
  expect(indicators.map((node) => node.textContent)).toEqual([
    'Alta de 0.44%',
    'Queda de 0.18%',
    'Sem variação 0.00%',
  ])
  expect(indicators[0]?.getAttribute('data-slot')).toBe('trend-indicator')
  expect(indicators[1]?.className).toContain('text-destructive-foreground')
})

test('keeps one period active in the period toggle', () => {
  const changes: string[] = []
  render(
    <WidgetPeriodToggle
      aria-label="Período do gráfico"
      onValueChange={(period) => changes.push(period)}
      options={[
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
      ]}
      value="month"
    />,
  )
  expect(screen.getByRole('group', { name: 'Período do gráfico' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Month' }))
  fireEvent.click(screen.getByRole('button', { name: 'Week' }))
  expect(changes).toEqual(['week'])
})

test('market share widget derives each share from the segment weights', () => {
  render(
    <MarketShareWidget
      endLabel="31 May"
      segments={[
        { change: 0.0044, id: 'btc', label: 'Bitcoin', value: 60 },
        { change: 0.0056, id: 'eth', label: 'Ethereum', value: 30 },
        { id: 'other', label: 'Others', value: 10 },
      ]}
      startLabel="1 May"
      title="Market Leaders"
    >
      <AssetList aria-label="Ativos">
        <AssetListItem
          meta="24h: +$500.00"
          name="Bitcoin"
          value="$115,485.04"
        />
      </AssetList>
    </MarketShareWidget>,
  )
  const region = screen.getByRole('region', { name: 'Market Leaders' })
  expect(region.textContent).toContain('Bitcoin: 60.00%')
  expect(region.textContent).toContain('Ethereum: 30.00%')
  expect(region.textContent).toContain('Others: 10.00%')
  expect(region.textContent).toContain('1 May')
  expect(screen.getByRole('list', { name: 'Ativos' }).textContent).toContain(
    '24h: +$500.00',
  )
})

test('risk score widget exposes a meter and leaves the tone to the consumer', () => {
  render(
    <RiskScoreWidget
      score={72}
      stats={[
        { id: 'score', label: 'Risk Score', value: '72/100' },
        { id: 'suggestion', label: 'AI Suggestion', value: '15% BTC → ETH' },
      ]}
      title="AI Risk Analysis"
      tone="warning"
    />,
  )
  const meter = screen.getByRole('meter', { name: 'AI Risk Analysis' })
  expect(meter.getAttribute('aria-valuenow')).toBe('72')
  expect(document.querySelector('[data-tone="warning"]')?.className).toContain(
    'bg-warning',
  )
  expect(screen.getByText('15% BTC → ETH').tagName).toBe('DD')
})

test('inverted asset stat widget scopes the dark theme to itself', () => {
  const { container } = render(
    <AssetStatWidget
      change={-0.0018}
      format={{ minimumIntegerDigits: 2, style: 'percent' }}
      label="Reward rate"
      name="Zcash"
      symbol="ZEC"
      tone="inverted"
      value={0.0934}
    />,
  )
  const scope = container.querySelector('[data-slot="asset-stat-widget-scope"]')
  expect(scope?.classList.contains('dark')).toBe(true)
  expect(screen.getByRole('region', { name: 'Zcash ZEC' })).toBeTruthy()
  expect(container.textContent).toContain('09.34%')
})

test('balance widget describes its chart for screen readers', () => {
  const periods: string[] = []
  render(
    <BalanceWidget
      change={0.0412}
      changeLabel="vs. last month"
      chartLabel="Balance over the last 6 months"
      data={[
        { label: 'Jan', value: 10 },
        { label: 'Feb', value: 12 },
      ]}
      onPeriodChange={(period) => periods.push(period)}
      period="6m"
      periods={[
        { label: '1M', value: '1m' },
        { label: '6M', value: '6m' },
      ]}
      title="Total balance"
      value={48250.75}
    />,
  )
  expect(
    screen.getByRole('img', { name: 'Balance over the last 6 months' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('region', { name: 'Total balance' }).textContent,
  ).toContain('$48,250.75')
  fireEvent.click(screen.getByRole('button', { name: '1M' }))
  expect(periods).toEqual(['1m'])
})

test('card widget shell drops the native shadow and strengthens the border', () => {
  const { container } = render(
    <CardWidgetShell aria-label="Moldura" className="p-2">
      conteúdo
    </CardWidgetShell>,
  )
  const shell = container.querySelector('section[data-slot="card"]')
  expect(shell).toBeTruthy()
  for (const token of ['border-input', 'shadow-none', 'before:hidden', 'p-2'])
    expect(shell?.className).toContain(token)
  expect(shell?.className).not.toContain('shadow-xs')
  expect(screen.getByRole('region', { name: 'Moldura' })).toBeTruthy()
})
