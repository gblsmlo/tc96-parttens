import { afterEach, describe, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
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
  test('focuses the field the add button opens, so typing starts the edit', () => {
    render(
      <TextProperty
        addLabel="Documento"
        ariaLabel="Documento"
        onCommit={() => undefined}
        value={null}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Documento' }))

    const field = screen.getByRole('textbox', { name: 'Documento' })
    expect(document.activeElement).toBe(field)
    expect(field.hasAttribute('data-editing')).toBe(true)
  })

  test('does not take focus with inline editing', () => {
    render(
      <TextProperty
        ariaLabel="Documento"
        editing="inline"
        onCommit={() => undefined}
        value={null}
      />,
    )

    expect(document.activeElement).toBe(document.body)
  })
})
