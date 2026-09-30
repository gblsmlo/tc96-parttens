import { afterEach, describe, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render, screen } = await import('@testing-library/react')
const { TextProperty } = await import('./text-property')

afterEach(cleanup)

describe('TextProperty', () => {
  test('renders a secondary badge for a text value', () => {
    render(<TextProperty ariaLabel="Source" value="Manual" />)

    const badge = screen.getByLabelText('Source: Manual')
    expect(badge.textContent).toContain('Manual')
  })

  test('renders the fallback when value is empty', () => {
    render(<TextProperty fallback="No type" value={null} />)

    expect(screen.getByText('No type')).toBeTruthy()
  })

  test('renders plain text without badge styling', () => {
    render(<TextProperty value="Manual" variant="plain" />)

    expect(screen.getByText('Manual')).toBeTruthy()
  })
})
