import { afterEach, describe, expect, test } from 'bun:test'

await import('../test/dom')

const { cleanup, render, screen } = await import('@testing-library/react')
const {
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameFooter,
  CollectionFrameHeader,
  CollectionFrameOverlay,
} = await import('./collection-frame')

afterEach(cleanup)

function Frame({ mode }: Readonly<{ mode?: 'fill' | 'flow' }>) {
  return (
    <CollectionFrame data-testid="frame" mode={mode}>
      <CollectionFrameHeader data-testid="header">
        Toolbar
      </CollectionFrameHeader>
      <CollectionFrameBody aria-label="Tarefas">Registros</CollectionFrameBody>
      <CollectionFrameFooter data-testid="footer">
        Paginação
        <CollectionFrameOverlay>Ações</CollectionFrameOverlay>
      </CollectionFrameFooter>
    </CollectionFrame>
  )
}

describe('CollectionFrame', () => {
  test('fill bounds the frame and scrolls the body', () => {
    render(<Frame />)

    const frame = screen.getByTestId('frame')
    const body = screen.getByRole('region', { name: 'Tarefas' })
    expect(frame.dataset.mode).toBe('fill')
    expect(frame.className).toContain('min-h-0')
    expect(frame.className).toContain('flex-1')
    expect(body.className).toContain('min-h-0')
    expect(body.className).toContain('overflow-auto')
    expect(screen.getByTestId('footer').className).not.toContain('sticky')
  })

  test('flow lets the body grow and pins the footer to the viewport', () => {
    render(<Frame mode="flow" />)

    const frame = screen.getByTestId('frame')
    const body = screen.getByRole('region', { name: 'Tarefas' })
    expect(frame.dataset.mode).toBe('flow')
    expect(frame.className).not.toContain('flex-1')
    expect(body.className).not.toContain('overflow-auto')
    expect(screen.getByTestId('footer').className).toContain('sticky')
  })

  test('renders the parts in header, body, footer order', () => {
    render(<Frame />)

    const slots = [
      ...screen.getByTestId('frame').querySelectorAll('[data-slot]'),
    ].map((element) => element.getAttribute('data-slot'))
    expect(slots).toEqual([
      'collection-frame-header',
      'collection-frame-body',
      'collection-frame-footer',
      'collection-frame-overlay',
    ])
    expect(screen.getByText('Ações').parentElement?.dataset.slot).toBe(
      'collection-frame-overlay',
    )
  })
})
