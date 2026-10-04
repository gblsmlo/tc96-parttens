import { afterEach, describe, expect, test } from 'bun:test'

await import('../test/dom')

const { cleanup, render } = await import('@testing-library/react')
const { PropertyRow } = await import('./property-row')

afterEach(cleanup)

describe('PropertyRow', () => {
  test('renders a named fieldset with the slot and the variant', () => {
    const { container } = render(
      <PropertyRow ariaLabel="Tags" slot="tags-property" variant="plain">
        filho
      </PropertyRow>,
    )

    const row = container.querySelector('fieldset')
    expect(row?.getAttribute('aria-label')).toBe('Tags')
    expect(row?.dataset.slot).toBe('tags-property')
    expect(row?.dataset.variant).toBe('plain')
    expect(row?.textContent).toBe('filho')
  })

  test('resets the fieldset chrome and keeps the layout classes after it', () => {
    const { container } = render(
      <PropertyRow className="flex flex-wrap gap-1" slot="x" />,
    )

    const row = container.querySelector('fieldset')
    for (const token of [
      'm-0',
      'min-w-0',
      'border-0',
      'p-0',
      'flex',
      'gap-1',
    ]) {
      expect(row?.classList.contains(token)).toBe(true)
    }
  })

  test('lets the caller override a reset', () => {
    const { container } = render(<PropertyRow className="min-w-fit" slot="x" />)

    const row = container.querySelector('fieldset')
    expect(row?.classList.contains('min-w-fit')).toBe(true)
    expect(row?.classList.contains('min-w-0')).toBe(false)
  })

  test('omits the variant and the label when they are not given', () => {
    const { container } = render(<PropertyRow slot="property-collection" />)

    const row = container.querySelector('fieldset')
    expect(row?.hasAttribute('data-variant')).toBe(false)
    expect(row?.hasAttribute('aria-label')).toBe(false)
  })

  test('passes extra data attributes through', () => {
    const { container } = render(
      <PropertyRow data-display="count" data-editing="inline" slot="x" />,
    )

    const row = container.querySelector('fieldset')
    expect(row?.dataset.display).toBe('count')
    expect(row?.dataset.editing).toBe('inline')
  })
})
