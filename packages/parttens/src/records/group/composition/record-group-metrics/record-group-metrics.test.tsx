import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render } = await import('@testing-library/react')
const { RecordGroupMetrics } = await import('./record-group-metrics')

afterEach(cleanup)

const grid = () =>
  document.querySelector('[data-slot="record-group-metrics"]') as HTMLElement

test('lays the metrics out in two columns by default', () => {
  render(
    <RecordGroupMetrics>
      <span>Leads</span>
    </RecordGroupMetrics>,
  )

  expect(grid().tagName).toBe('DIV')
  expect(grid().className).toContain('grid-cols-2')
  expect(grid().textContent).toBe('Leads')
})

test('stacks the metrics in one column and merges the className', () => {
  render(<RecordGroupMetrics className="extra" columns={1} />)

  expect(grid().className).toContain('grid-cols-1')
  expect(grid().className).not.toContain('grid-cols-2')
  expect(grid().className).toContain('extra')
})
