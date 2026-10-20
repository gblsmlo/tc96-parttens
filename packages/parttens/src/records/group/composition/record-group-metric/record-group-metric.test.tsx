import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render, screen } = await import('@testing-library/react')
const { RecordGroupMetric } = await import('./record-group-metric')

afterEach(cleanup)

const slot = (name: string) =>
  document.querySelector(`[data-slot="${name}"]`) as HTMLElement | null

test('renders the label as the term and the value as its description', () => {
  render(
    <RecordGroupMetric
      icon={<svg data-testid="icon" />}
      label="Conversão"
      value="18,5%"
    />,
  )

  const metric = slot('record-group-metric') as HTMLElement
  const term = metric.querySelector('dt') as HTMLElement

  expect(metric.tagName).toBe('DL')
  expect(metric.querySelector('[data-slot="card"]')).not.toBeNull()
  expect(term.textContent).toBe('Conversão')
  expect(
    screen.getByTestId('icon').parentElement?.getAttribute('aria-hidden'),
  ).toBe('true')
  expect(slot('record-group-metric-value')?.textContent).toBe('18,5%')
})

test('renders target and progress only when passed', () => {
  render(<RecordGroupMetric label="Leads" value="84" />)

  expect(slot('record-group-metric-target')).toBeNull()
  expect(slot('record-group-metric-progress')).toBeNull()
  expect(screen.queryByRole('meter')).toBeNull()
})

test('names the meter by the label and clamps the progress', () => {
  render(
    <RecordGroupMetric
      label="Leads"
      progress={1.4}
      target="de 120 planejados"
      value="168"
    />,
  )

  const meter = screen.getByRole('meter', { name: 'Leads' })

  expect(slot('record-group-metric-target')?.textContent).toBe(
    'de 120 planejados',
  )
  expect(slot('record-group-metric-value')?.textContent).toBe(
    '168de 120 planejados',
  )
  expect(meter.getAttribute('aria-valuenow')).toBe('100')
})

test('treats a negative or non-finite progress as empty', () => {
  render(
    <>
      <RecordGroupMetric label="Vendas" progress={-0.2} value="0" />
      <RecordGroupMetric label="Sucesso" progress={Number.NaN} value="0" />
    </>,
  )

  for (const name of ['Vendas', 'Sucesso']) {
    expect(
      screen.getByRole('meter', { name }).getAttribute('aria-valuenow'),
    ).toBe('0')
  }
})

test('merges the consumer className on the list', () => {
  render(<RecordGroupMetric className="extra" label="Leads" value="84" />)

  expect(slot('record-group-metric')?.className).toContain('extra')
})
