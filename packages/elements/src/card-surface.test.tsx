import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { CardSurface } from './card-surface'

const radiusVariable =
  '[--card-surface-radius:var(--card-radius,var(--radius-lg))]'

function classOf(markup: string) {
  return markup.match(/class="([^"]*)"/)?.[1].split(' ') ?? []
}

test('CardSurface renders a div with data-slot card and its children, and nothing else', () => {
  const markup = renderToStaticMarkup(<CardSurface />)
  expect(markup.startsWith('<div ')).toBe(true)
  expect(markup).toContain('data-slot="card"')
  expect(markup.endsWith('></div>')).toBe(true)
  expect(renderToStaticMarkup(<CardSurface>content</CardSurface>)).toContain(
    '>content</div>',
  )
})

test('CardSurface accepts render and keeps the slot, classes and props on the new element', () => {
  const markup = renderToStaticMarkup(
    <CardSurface aria-label="Totals" render={<section />}>
      body
    </CardSurface>,
  )
  expect(markup.startsWith('<section ')).toBe(true)
  expect(markup).toContain('data-slot="card"')
  expect(markup).toContain('aria-label="Totals"')
  expect(markup).toContain('>body</section>')
  expect(classOf(markup)).toContain('bg-card')
})

test('CardSurface takes the radius from --card-radius with --radius-lg as default, on the root and on the highlight', () => {
  const classes = classOf(renderToStaticMarkup(<CardSurface />))
  expect(classes).toContain(radiusVariable)
  expect(classes).toContain('rounded-(--card-surface-radius)')
  expect(classes).toContain(
    'before:rounded-[calc(var(--card-surface-radius)-1px)]',
  )
  expect(classes.some((name) => /--radius-(?:lg|2xl)\)-1px/.test(name))).toBe(
    false,
  )
})

test('CardSurface carries the approved surface: border, fill, shadow and highlight in both themes', () => {
  const classes = classOf(renderToStaticMarkup(<CardSurface />))
  for (const name of [
    'relative',
    'flex',
    'flex-col',
    'border',
    'border-border/80',
    'bg-card',
    'not-dark:bg-clip-padding',
    'text-card-foreground',
    'shadow-xs/5',
    'before:pointer-events-none',
    'before:absolute',
    'before:inset-0',
    'before:shadow-[0_1px_--theme(--color-black/4%)]',
    'dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
  ])
    expect(classes).toContain(name)
})

test('CardSurface merges className after its own classes', () => {
  const classes = classOf(
    renderToStaticMarkup(<CardSurface className="min-w-0 p-4" />),
  )
  expect(classes.slice(-2)).toEqual(['min-w-0', 'p-4'])
})

test('CardSurface lets border-transparent replace the border color and keeps the 1px width', () => {
  const classes = classOf(
    renderToStaticMarkup(<CardSurface className="border-transparent" />),
  )
  expect(classes).toContain('border-transparent')
  expect(classes).toContain('border')
  expect(classes).not.toContain('border-border/80')
})

test('CardSurface lets a per-instance --card-radius ride along without touching the radius classes', () => {
  const classes = classOf(
    renderToStaticMarkup(<CardSurface className="[--card-radius:1rem]" />),
  )
  expect(classes).toContain('[--card-radius:1rem]')
  expect(classes).toContain(radiusVariable)
  expect(classes).toContain('rounded-(--card-surface-radius)')
  expect(classes).toContain(
    'before:rounded-[calc(var(--card-surface-radius)-1px)]',
  )
})
