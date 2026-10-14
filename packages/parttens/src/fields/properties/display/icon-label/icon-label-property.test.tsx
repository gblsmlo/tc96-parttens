import { afterEach, describe, expect, test } from 'bun:test'
import { CircleIcon } from 'lucide-react'

await import('../../test/dom')

const { cleanup, render, screen } = await import('@testing-library/react')
const { IconLabelProperty } = await import('./icon-label-property')

afterEach(cleanup)

describe('IconLabelProperty', () => {
  test('renders the label as a secondary badge', () => {
    render(<IconLabelProperty ariaLabel="Origem" label="Manual" />)

    const badge = screen.getByLabelText('Origem: Manual')
    expect(badge.textContent).toContain('Manual')
  })

  test('renders without an icon when none is given', () => {
    render(<IconLabelProperty label="Manual" />)

    expect(document.querySelector('svg')).toBeNull()
  })

  test('renders the icon when given', () => {
    render(<IconLabelProperty icon={CircleIcon} label="Manual" />)

    expect(document.querySelector('svg[aria-hidden="true"]')).toBeTruthy()
  })

  test('marks the icon as property-icon', () => {
    render(<IconLabelProperty icon={CircleIcon} label="Manual" />)

    expect(
      document
        .querySelector('svg[aria-hidden="true"]')
        ?.getAttribute('data-slot'),
    ).toBe('property-icon')
  })

  test('exposes ariaLabel as an img role without trailing', () => {
    const { unmount } = render(
      <IconLabelProperty ariaLabel="Criado em" label="27/09/2026" />,
    )
    expect(
      screen.getByRole('img', { name: 'Criado em: 27/09/2026' }),
    ).toBeTruthy()
    unmount()

    render(
      <IconLabelProperty
        ariaLabel="Criado em"
        label="27/09/2026"
        variant="plain"
      />,
    )
    expect(
      screen.getByRole('img', { name: 'Criado em: 27/09/2026' }),
    ).toBeTruthy()
  })

  test('renders plain text without badge styling', () => {
    render(<IconLabelProperty label="Manual" variant="plain" />)

    expect(screen.getByText('Manual')).toBeTruthy()
  })
})
