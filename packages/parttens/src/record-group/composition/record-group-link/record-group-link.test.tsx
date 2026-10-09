import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { RecordGroupLink } = await import('./record-group-link')

afterEach(cleanup)

const slot = (name: 'meta' | 'name') =>
  document.querySelector(`[data-slot="record-group-link-${name}"]`)

test('is a link named by its content, leading and meta included', () => {
  render(
    <RecordGroupLink
      href="/parcelas/1"
      leading={<svg aria-hidden="true" />}
      meta="Paga"
    >
      Parcela 1
    </RecordGroupLink>,
  )

  const link = screen.getByRole('link', { name: 'Parcela 1 Paga' })

  expect(link.tagName).toBe('A')
  expect(link.getAttribute('href')).toBe('/parcelas/1')
  expect(link.getAttribute('data-slot')).toBe('record-group-link')
  expect(slot('name')?.textContent).toBe('Parcela 1')
  expect(slot('meta')?.textContent).toBe('Paga')
  expect(link.querySelector('svg')).not.toBeNull()
})

test('renders leading and meta only when passed', () => {
  render(<RecordGroupLink href="/parcelas/1">Parcela 1</RecordGroupLink>)

  const link = screen.getByRole('link', { name: 'Parcela 1' })

  expect(link.children).toHaveLength(1)
  expect(slot('meta')).toBeNull()
})

test('renders through the consumer element and keeps its handlers', () => {
  let clicks = 0
  render(
    <RecordGroupLink
      className="extra"
      onClick={() => {
        clicks += 1
      }}
      render={<button type="button" />}
    >
      contrato-assinado.pdf
    </RecordGroupLink>,
  )

  const button = screen.getByRole('button', { name: 'contrato-assinado.pdf' })
  fireEvent.click(button)

  expect(clicks).toBe(1)
  expect(button.getAttribute('data-slot')).toBe('record-group-link')
  expect(button.className).toContain('extra')
  expect(button.className).toContain('min-h-9')
  expect(button.className).toContain('text-start')
})
