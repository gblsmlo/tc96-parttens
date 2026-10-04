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

  test('is 16px with 10px initials unless a size is passed', () => {
    const { container, rerender } = render(<PersonAvatar option={option} />)
    const avatar = () => container.querySelector('[data-slot="avatar"]')

    expect(avatar()?.className).toContain('size-4')
    expect(fallbackOf(container)?.className).toContain('text-[0.625rem]')

    rerender(<PersonAvatar className="size-7" option={option} />)

    expect(avatar()?.className).toContain('size-7')
    expect(avatar()?.className).not.toContain('size-4')
  })

  test('keeps the muted fallback surface', () => {
    const { container } = render(<PersonAvatar option={option} />)

    expect(fallbackOf(container)?.className).toContain('bg-muted/40')
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

  test('forwards the avatar size', () => {
    const { container } = render(
      <PersonOptionContent avatarClassName="size-7" option={option} />,
    )

    expect(
      container.querySelector('[data-slot="avatar"]')?.className,
    ).toContain('size-7')
  })
})
