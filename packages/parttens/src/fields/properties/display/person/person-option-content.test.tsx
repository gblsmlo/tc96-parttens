import { afterEach, describe, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render } = await import('@testing-library/react')
const { PersonAvatar, PersonOptionContent } = await import(
  './person-option-content'
)

afterEach(cleanup)

const option = { label: 'Gabriel Melo', value: 'gm' }

const fallbackOf = (container: HTMLElement) =>
  container.querySelector('[data-slot="avatar-fallback"]')

describe('PersonAvatar', () => {
  test('falls back to the initials of the label', () => {
    const { container } = render(<PersonAvatar option={option} />)

    expect(fallbackOf(container)?.textContent).toBe('GM')
  })

  test('prefers the explicit fallback', () => {
    const { container } = render(
      <PersonAvatar option={{ ...option, fallback: 'G!' }} />,
    )

    expect(fallbackOf(container)?.textContent).toBe('G!')
  })

  test('shows the user icon when there is no person', () => {
    const { container } = render(<PersonAvatar option={null} />)

    expect(fallbackOf(container)?.textContent).toBe('')
    expect(
      fallbackOf(container)
        ?.querySelector('svg')
        ?.classList.contains('lucide-user'),
    ).toBe(true)
  })

  test('is the sm Avatar unless a size is passed', () => {
    const { container, rerender } = render(<PersonAvatar option={option} />)
    const avatar = () => container.querySelector('[data-slot="avatar"]')

    expect(avatar()?.getAttribute('data-size')).toBe('sm')
    expect(avatar()?.className).toContain('size-6')

    rerender(<PersonAvatar option={option} size="lg" />)

    expect(avatar()?.getAttribute('data-size')).toBe('lg')
    expect(avatar()?.className).toContain('size-10')
    expect(avatar()?.className).not.toContain('size-6')
  })

  test('matches the outlined fallback used by avatar-only records', () => {
    const { container } = render(<PersonAvatar option={option} />)
    const fallback = fallbackOf(container)

    expect(fallback?.className).toContain('border')
    expect(fallback?.className).toContain('border-input')
    expect(fallback?.className).not.toContain('bg-muted/40')
  })
})

describe('PersonOptionContent', () => {
  test('renders the avatar and the label', () => {
    const { container, getByText } = render(
      <PersonOptionContent option={option} />,
    )

    expect(container.querySelector('[data-slot="avatar"]')).toBeTruthy()
    expect(getByText('Gabriel Melo').className).toContain('truncate')
  })

  test('shows the supporting label only from the sm breakpoint', () => {
    const { getByText, queryByText, rerender } = render(
      <PersonOptionContent option={option} />,
    )
    expect(queryByText('Owner')).toBeNull()

    rerender(
      <PersonOptionContent option={{ ...option, supportingLabel: 'Owner' }} />,
    )

    expect(getByText('Owner').className).toContain('hidden')
    expect(getByText('Owner').className).toContain('sm:inline')
  })
})
