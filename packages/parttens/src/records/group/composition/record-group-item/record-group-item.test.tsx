import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render, screen } = await import('@testing-library/react')
const { RecordGroupItem } = await import('./record-group-item')

afterEach(cleanup)

const slot = (name: 'title' | 'trailing') =>
  document.querySelector(`[data-slot="record-group-item-${name}"]`)

test('renders leading, title and the trailing control in order', () => {
  render(
    <RecordGroupItem leading={<svg aria-hidden="true" />} title="Parcela 1">
      <input aria-label="Valor da Parcela 1" />
    </RecordGroupItem>,
  )

  const item = document.querySelector(
    '[data-slot="record-group-item"]',
  ) as HTMLElement

  expect(item.tagName).toBe('DIV')
  expect(item.getAttribute('role')).toBeNull()
  expect(item.firstElementChild?.querySelector('svg')).not.toBeNull()
  expect(slot('title')?.textContent).toBe('Parcela 1')
  expect(
    slot('trailing')?.contains(
      screen.getByRole('textbox', { name: 'Valor da Parcela 1' }),
    ),
  ).toBe(true)
})

test('renders leading and trailing only when passed', () => {
  render(<RecordGroupItem title="Parcela 1" />)

  const item = document.querySelector(
    '[data-slot="record-group-item"]',
  ) as HTMLElement

  expect(item.children).toHaveLength(1)
  expect(slot('trailing')).toBeNull()
})

test('merges the consumer className', () => {
  render(<RecordGroupItem className="extra" title="Parcela 1" />)

  const item = document.querySelector(
    '[data-slot="record-group-item"]',
  ) as HTMLElement

  expect(item.className).toContain('extra')
  expect(item.className).toContain('min-h-9')
})
