import { afterEach, describe, expect, test } from 'bun:test'
import type { ReactElement } from 'react'

await import('../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { ActionBar } = await import('./action-bar')
const { CollectionSelectionActions } = await import(
  './collection-selection-actions'
)

afterEach(cleanup)

function Example({ selected = true }: { selected?: boolean }): ReactElement {
  return (
    <ActionBar
      actions={[
        {
          items: [
            {
              icon: <span aria-hidden="true">A</span>,
              label: 'Arquivar',
              onSelect: () => undefined,
            },
          ],
        },
        {
          items: [
            {
              label: 'Mais opções',
              submenu: [
                {
                  label: 'Organizar',
                  items: [
                    { label: 'Duplicar', onSelect: () => undefined },
                    { label: 'Mover', onSelect: () => undefined },
                  ],
                },
                {
                  items: [{ label: 'Excluir', onSelect: () => undefined }],
                },
              ],
            },
          ],
        },
      ]}
      selectedCount={selected ? 1 : 0}
    />
  )
}

describe('ActionBar', () => {
  test('stays hidden until at least one row is selected', () => {
    const { container } = render(<Example selected={false} />)

    expect(container.querySelector('[data-slot="action-bar"]')).toBeNull()
  })

  test('renders grouped actions and invokes the selected action', () => {
    let calls = 0
    const increment = () => {
      calls += 1
    }
    render(
      <ActionBar
        actions={[
          { items: [{ label: 'Arquivar', onSelect: increment }] },
          { items: [{ label: 'Excluir', onSelect: increment }] },
        ]}
        selectedCount={2}
      />,
    )

    expect(screen.getByText('2 selecionados')).toBeTruthy()
    expect(screen.getByRole('separator')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Arquivar' }))
    expect(calls).toBe(1)
  })

  test('opens a submenu above the action bar', () => {
    render(<Example />)

    fireEvent.click(screen.getByRole('button', { name: 'Mais opções' }))

    const popup = screen.getByRole('menu')
    expect(screen.getByRole('menuitem', { name: 'Duplicar' })).toBeTruthy()
    expect(screen.getByText('Organizar')).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toBeTruthy()
    expect(popup.querySelector('[data-slot="menu-separator"]')).toBeTruthy()
    expect(popup.dataset.side).toBe('top')
  })

  test('marks the visual emphasis of a primary action', () => {
    render(
      <ActionBar
        actions={[
          {
            items: [
              {
                label: 'Enviar',
                onSelect: () => undefined,
                variant: 'primary',
              },
            ],
          },
        ]}
        selectedCount={1}
      />,
    )

    const button = screen.getByRole('button', { name: 'Enviar' })

    expect(button.className).toContain('bg-primary')
    expect(button.className).not.toContain('blue')
  })

  test('keeps the previous component name as a compatibility alias', () => {
    expect(CollectionSelectionActions).toBe(ActionBar)
  })
})
