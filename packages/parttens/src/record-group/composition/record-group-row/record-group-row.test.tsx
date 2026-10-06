import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render } = await import('@testing-library/react')
const { RecordGroupRow } = await import('./record-group-row')

afterEach(cleanup)

const rows = () =>
  [
    ...document.querySelectorAll('[data-slot="record-group-row"]'),
  ] as HTMLElement[]
const labelOf = (row: HTMLElement) =>
  row.querySelector('[data-slot="record-group-row-label"]') as HTMLElement
const valueCellOf = (row: HTMLElement) =>
  row.querySelector('[data-slot="record-group-row-value"]') as HTMLElement

test('defaults to start alignment and renders label and value', () => {
  render(<RecordGroupRow label="Status">Open</RecordGroupRow>)

  const [row] = rows()

  expect(row?.getAttribute('data-align')).toBe('start')
  expect(labelOf(row as HTMLElement).textContent).toBe('Status')
  expect(valueCellOf(row as HTMLElement).textContent).toBe('Open')
})

test('between sets data-align', () => {
  render(
    <RecordGroupRow align="between" label="Status">
      Open
    </RecordGroupRow>,
  )

  const [row] = rows()

  expect(row?.getAttribute('data-align')).toBe('between')
})

test('renders leading only when passed', () => {
  const { unmount } = render(
    <RecordGroupRow label="Status">Open</RecordGroupRow>,
  )

  expect(labelOf(rows()[0] as HTMLElement).querySelector('svg')).toBeNull()
  expect(labelOf(rows()[0] as HTMLElement).children).toHaveLength(1)

  unmount()
  render(
    <RecordGroupRow label="Status" leading={<svg data-testid="icon" />}>
      Open
    </RecordGroupRow>,
  )

  expect(labelOf(rows()[0] as HTMLElement).querySelector('svg')).not.toBeNull()
})
