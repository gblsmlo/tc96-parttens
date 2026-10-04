import { afterEach, describe, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { Button } = await import('@tc96/ui/button')
const { STATE_SURFACE_KINDS } = await import('../../core')
const { StateSurface } = await import('./state-surface')

afterEach(cleanup)

const copy = { description: 'Nothing to show here.', title: 'Nothing here' }

describe('StateSurface', () => {
  test.each([
    ['empty', 'status'],
    ['no-result', 'status'],
    ['not-found', 'status'],
    ['error', 'alert'],
    ['permission', 'alert'],
  ] as const)(
    'exposes %s with data-kind and role %s and no aria-live',
    (kind, role) => {
      const { container } = render(<StateSurface {...copy} kind={kind} />)
      const root = container.querySelector('[data-slot="empty"]')

      expect(screen.getByRole(role) === root).toBe(true)
      expect(root?.getAttribute('data-kind')).toBe(kind)
      expect(root?.hasAttribute('aria-live')).toBe(false)
    },
  )

  test('covers exactly the five kinds', () => {
    expect([...STATE_SURFACE_KINDS]).toEqual([
      'empty',
      'no-result',
      'error',
      'permission',
      'not-found',
    ])
  })

  test('renders the default icon in a decorative rounded color frame', () => {
    const { container } = render(<StateSurface {...copy} kind="empty" />)
    const frame = container.querySelector('[data-slot="icon-frame"]')

    expect(frame?.getAttribute('aria-hidden')).toBe('true')
    expect(frame?.getAttribute('data-shape')).toBe('rounded')
    expect(frame?.getAttribute('data-variant')).toBe('color')
    expect(frame?.querySelector('svg')).toBeTruthy()
    expect(frame?.className).toContain('bg-muted/60')
    expect(frame?.className).not.toContain('bg-muted ')
    expect(frame?.getAttribute('style') ?? '').not.toContain('color')
    expect(frame?.className).not.toMatch(/text-(?!foreground)/)
  })

  test.each(['error', 'permission'] as const)(
    'tints the %s frame with the destructive variable',
    (kind) => {
      const { container } = render(<StateSurface {...copy} kind={kind} />)
      const frame = container.querySelector('[data-slot="icon-frame"]')
      const style = frame?.getAttribute('style') ?? ''

      expect(frame?.getAttribute('data-shape')).toBe('rounded')
      expect(frame?.getAttribute('data-variant')).toBe('color')
      expect(style).toContain('var(--destructive)')
      expect(style).toContain('background-color')
      expect(frame?.className).not.toContain('bg-muted/60')
    },
  )

  test('replaces the default icon with the consumer icon', () => {
    const { container } = render(
      <StateSurface {...copy} icon={<i data-testid="custom" />} kind="error" />,
    )

    expect(
      screen.getByTestId('custom').closest('[data-slot="icon-frame"]'),
    ).toBeTruthy()
    expect(container.querySelector('svg')).toBeNull()
  })

  test('hides the icon when icon is null', () => {
    const { container } = render(
      <StateSurface {...copy} icon={null} kind="error" />,
    )

    expect(container.querySelector('[data-slot="icon-frame"]')).toBeNull()
    expect(container.querySelector('svg')).toBeNull()
  })

  test('renders the actions slot and keeps the consumer variant and handler', () => {
    const pressed: string[] = []
    render(
      <StateSurface
        {...copy}
        actions={
          <Button onClick={() => pressed.push('retry')} variant="destructive">
            Try again
          </Button>
        }
        kind="error"
      />,
    )

    const button = screen.getByRole('button', { name: 'Try again' })
    fireEvent.click(button)

    expect(pressed).toEqual(['retry'])
    expect(button.className).toContain('destructive')
  })
})
