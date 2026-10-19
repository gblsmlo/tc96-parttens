import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render, screen } = await import('@testing-library/react')
const { ChatsPanelItemSkeleton, ChatsPanelSkeleton } = await import(
  './chats-panel-skeleton'
)
const { chatsPanelSkeletonWidths } = await import('../../core')
const { chatsPanelRowClassName } = await import('../../lib/variants')

afterEach(cleanup)

const rows = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-slot="chats-panel-item-skeleton"]',
    ),
  )

const widths = (row: HTMLElement) =>
  Array.from(row.querySelectorAll('[data-width]')).map((line) =>
    line.getAttribute('data-width'),
  )

test('is a busy status named by its label', () => {
  render(<ChatsPanelSkeleton label="Carregando conversas" />)

  const status = screen.getByRole('status', { name: 'Carregando conversas' })

  expect(status.getAttribute('aria-busy')).toBe('true')
  expect(status.getAttribute('data-slot')).toBe('chats-panel-skeleton')
})

test('renders six hidden rows by default, cycling the name and preview widths', () => {
  render(<ChatsPanelSkeleton label="Carregando conversas" />)

  expect(rows()).toHaveLength(6)
  expect(
    rows().every((row) => row.getAttribute('aria-hidden') === 'true'),
  ).toBe(true)
  expect(rows().map(widths)).toEqual([
    ['md', 'xl'],
    ['lg', 'lg'],
    ['sm', 'xl'],
    ['md', 'md'],
    ['md', 'xl'],
    ['lg', 'lg'],
  ])
})

test('renders count rows and none for a negative count', () => {
  const { rerender } = render(
    <ChatsPanelSkeleton count={2} label="Carregando conversas" />,
  )

  expect(rows()).toHaveLength(2)

  rerender(<ChatsPanelSkeleton count={-1} label="Carregando conversas" />)

  expect(rows()).toHaveLength(0)
})

test('shares the row box of the item and sizes the avatar from --avatar-size', () => {
  render(<ChatsPanelItemSkeleton />)

  const [row] = rows()
  const avatar = row?.querySelector('[data-slot="skeleton"]')

  expect(row?.className).toBe(chatsPanelRowClassName)
  expect(avatar?.className).toContain('size-(--avatar-size)')
  expect(avatar?.className).toContain('rounded-full')
})

test('maps each width size to one width class', () => {
  const classes = chatsPanelSkeletonWidths.map((width) => {
    cleanup()
    render(<ChatsPanelItemSkeleton nameWidth={width} />)
    return rows()[0]
      ?.querySelector('[data-width]')
      ?.className.match(/\bw-\d+/)?.[0]
  })

  expect(classes).toEqual(['w-8', 'w-16', 'w-24', 'w-32', 'w-44'])
})
