import { afterEach, describe, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render, screen } = await import('@testing-library/react')
const { StateGuard } = await import('./state-guard')

afterEach(cleanup)

const surface = { description: 'Ask an admin for access.', title: 'Restricted' }
const child = <p>Confidential record</p>

describe('StateGuard', () => {
  test('renders the loading block without data-kind and without children', () => {
    const { container } = render(
      <StateGuard
        state="loading"
        surface={{ description: 'Please wait.', title: 'Loading' }}
      >
        {child}
      </StateGuard>,
    )
    const block = container.querySelector('[data-slot="state-guard-loading"]')

    expect(screen.getByRole('status') === block).toBe(true)
    expect(block?.hasAttribute('data-kind')).toBe(false)
    expect(container.querySelector('[data-slot="empty"]')).toBeNull()
    expect(screen.getByText('Loading')).toBeTruthy()
    expect(screen.getByText('Please wait.')).toBeTruthy()
    expect(screen.queryByText('Confidential record')).toBeNull()
  })

  test('hides the spinner from assistive technology', () => {
    const { container } = render(
      <StateGuard state="loading" surface={{ title: 'Loading' }}>
        {child}
      </StateGuard>,
    )
    const spinner = container.querySelector(
      '[data-slot="state-guard-loading"] svg',
    )

    expect(spinner?.getAttribute('aria-hidden')).toBe('true')
  })

  test.each([
    'error',
    'permission',
    'empty',
    'no-result',
    'not-found',
  ] as const)('renders the %s surface and not the children', (state) => {
    const { container } = render(
      <StateGuard state={state} surface={surface}>
        {child}
      </StateGuard>,
    )

    expect(
      container.querySelector('[data-slot="empty"]')?.getAttribute('data-kind'),
    ).toBe(state)
    expect(screen.queryByText('Confidential record')).toBeNull()
  })

  test('mounts the children and no state for data', () => {
    const { container } = render(
      <StateGuard state="data" surface={surface}>
        {child}
      </StateGuard>,
    )

    expect(screen.getByText('Confidential record')).toBeTruthy()
    expect(container.querySelector('[data-slot="empty"]')).toBeNull()
    expect(
      container.querySelector('[data-slot="state-guard-loading"]'),
    ).toBeNull()
  })

  test('requires a surface outside the data state', () => {
    // @ts-expect-error surface is required when state is not data
    const missing = <StateGuard state="error">{child}</StateGuard>
    // @ts-expect-error surface is required when state is loading
    const missingLoading = <StateGuard state="loading">{child}</StateGuard>

    expect(missing).toBeTruthy()
    expect(missingLoading).toBeTruthy()
  })
})
