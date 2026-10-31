import { afterEach, describe, expect, mock, test } from 'bun:test'
import type { ReactNode } from 'react'

await import('../../test/dom')

class MockResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.assign(globalThis, { ResizeObserver: MockResizeObserver })

const { act, cleanup, fireEvent, render, screen, waitFor } = await import(
  '@testing-library/react'
)
const { MenuItem } = await import('@tc96/ui/menu')
const { CollectionToolbar } = await import(
  '../../../shared/components/collection-toolbar'
)
const {
  ViewSwitcherCreate,
  ViewSwitcherItem,
  ViewSwitcherItems,
  ViewSwitcherMenu,
  ViewSwitcherSearch,
} = await import('./collection-view-switcher')

const renderMenu = (children: ReactNode, label = 'Todas as pessoas') =>
  render(
    <CollectionToolbar
      startSlot={
        <ViewSwitcherMenu icon={<i data-testid="icon" />} label={label}>
          {children}
        </ViewSwitcherMenu>
      }
    />,
  )

const open = async (name = 'Todas as pessoas') => {
  await act(async () => fireEvent.click(screen.getByRole('button', { name })))
  return screen.getByRole('dialog', { name })
}

afterEach(cleanup)

describe('ViewSwitcherMenu', () => {
  test('shows the active view and opens a labelled dialog, not a menu', async () => {
    renderMenu(<span>Conteúdo</span>)

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByTestId('icon')).toBeTruthy()
    const dialog = await open()
    expect(dialog.textContent).toContain('Conteúdo')
    expect(screen.queryByRole('menu')).toBeNull()
  })

  test('renders no icon wrapper without an icon', () => {
    render(
      <CollectionToolbar
        startSlot={
          <ViewSwitcherMenu label="Sem ícone">
            <span>Conteúdo</span>
          </ViewSwitcherMenu>
        }
      />,
    )

    const trigger = screen.getByRole('button', { name: 'Sem ícone' })
    expect(trigger.querySelectorAll('svg')).toHaveLength(1)
    expect(trigger.querySelector('.shrink-0:not(svg)')).toBeNull()
  })

  test('truncates a long label in the trigger', () => {
    renderMenu(<span>Conteúdo</span>, 'Um nome muito longo de view')

    expect(
      screen
        .getByRole('button', { name: 'Um nome muito longo de view' })
        .querySelector('.truncate'),
    ).toBeTruthy()
  })
})

describe('ViewSwitcherSearch', () => {
  test('uses the default label and placeholder', async () => {
    renderMenu(<ViewSwitcherSearch onValueChange={() => undefined} value="" />)
    await open()

    const field = screen.getByRole('searchbox', { name: 'Buscar views' })
    expect(field.getAttribute('placeholder')).toBe('Buscar views...')
  })

  test('accepts a custom label and placeholder', async () => {
    renderMenu(
      <ViewSwitcherSearch
        label="Procurar"
        onValueChange={() => undefined}
        placeholder="Procurar..."
        value=""
      />,
    )
    await open()

    const field = screen.getByRole('searchbox', { name: 'Procurar' })
    expect(field.getAttribute('placeholder')).toBe('Procurar...')
  })

  test('reports the typed value', async () => {
    const onValueChange = mock((_value: string) => undefined)
    renderMenu(<ViewSwitcherSearch onValueChange={onValueChange} value="" />)
    await open()

    await act(async () =>
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'retorno' },
      }),
    )

    expect(onValueChange).toHaveBeenCalledWith('retorno')
  })
})

describe('ViewSwitcherItems', () => {
  test('groups items as "Views" by default', async () => {
    renderMenu(
      <ViewSwitcherItems>
        <ViewSwitcherItem label="A" onSelect={() => undefined} />
      </ViewSwitcherItems>,
    )
    await open()

    expect(screen.getByRole('group', { name: 'Views' })).toBeTruthy()
  })

  test('accepts a custom group label', async () => {
    renderMenu(
      <ViewSwitcherItems label="Favoritos">
        <ViewSwitcherItem label="A" onSelect={() => undefined} />
      </ViewSwitcherItems>,
    )
    await open()

    expect(screen.getByRole('group', { name: 'Favoritos' })).toBeTruthy()
  })
})

describe('ViewSwitcherItem', () => {
  test('marks only the selected item as current', async () => {
    renderMenu(
      <ViewSwitcherItems>
        <ViewSwitcherItem
          label="Recentes"
          onSelect={() => undefined}
          selected
        />
        <ViewSwitcherItem label="Todas" onSelect={() => undefined} />
      </ViewSwitcherItems>,
    )
    const dialog = await open()

    const current = screen.getByRole('button', { name: 'Recentes' })
    const other = screen.getByRole('button', { name: 'Todas' })
    expect(current.getAttribute('aria-current')).toBe('true')
    expect(other.hasAttribute('aria-current')).toBe(false)
    expect(
      current
        .closest('[data-slot="view-switcher-item"]')
        ?.hasAttribute('data-selected'),
    ).toBe(true)
    expect(
      other
        .closest('[data-slot="view-switcher-item"]')
        ?.hasAttribute('data-selected'),
    ).toBe(false)
    expect(dialog.querySelectorAll('[data-selected]')).toHaveLength(1)
  })

  test('selecting an item calls onSelect and closes the popover', async () => {
    const onSelect = mock(() => undefined)
    renderMenu(
      <ViewSwitcherItems>
        <ViewSwitcherItem label="Todas" onSelect={onSelect} />
      </ViewSwitcherItems>,
    )
    await open()

    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Todas' })),
    )

    expect(onSelect).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  test('has no options button without options', async () => {
    renderMenu(
      <ViewSwitcherItems>
        <ViewSwitcherItem label="Todas" onSelect={() => undefined} />
      </ViewSwitcherItems>,
    )
    await open()

    expect(screen.queryByRole('button', { name: 'Opções de Todas' })).toBeNull()
  })

  test('names the options button after the view by default', async () => {
    renderMenu(
      <ViewSwitcherItems>
        <ViewSwitcherItem
          label="Todas"
          onSelect={() => undefined}
          options={<MenuItem>Duplicar</MenuItem>}
        />
      </ViewSwitcherItems>,
    )
    await open()

    expect(screen.getByRole('button', { name: 'Opções de Todas' })).toBeTruthy()
  })

  test('accepts a custom options label', async () => {
    renderMenu(
      <ViewSwitcherItems>
        <ViewSwitcherItem
          label="Todas"
          onSelect={() => undefined}
          options={<MenuItem>Duplicar</MenuItem>}
          optionsLabel="Mais ações"
        />
      </ViewSwitcherItems>,
    )
    await open()

    expect(screen.getByRole('button', { name: 'Mais ações' })).toBeTruthy()
  })

  test('opens the options as a menu next to the popover', async () => {
    renderMenu(
      <ViewSwitcherItems>
        <ViewSwitcherItem
          label="Todas"
          onSelect={() => undefined}
          options={<MenuItem>Duplicar</MenuItem>}
        />
      </ViewSwitcherItems>,
    )
    await open()

    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Opções de Todas' })),
    )

    expect(screen.getByRole('menuitem', { name: 'Duplicar' })).toBeTruthy()
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  test('using an option runs it and closes the popover', async () => {
    const onClick = mock(() => undefined)
    renderMenu(
      <ViewSwitcherItems>
        <ViewSwitcherItem
          label="Todas"
          onSelect={() => undefined}
          options={<MenuItem onClick={onClick}>Duplicar</MenuItem>}
        />
      </ViewSwitcherItems>,
    )
    await open()
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Opções de Todas' })),
    )

    await act(async () =>
      fireEvent.click(screen.getByRole('menuitem', { name: 'Duplicar' })),
    )

    expect(onClick).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
})

describe('ViewSwitcherCreate', () => {
  test('uses the default label, calls onClick and closes the popover', async () => {
    const onClick = mock(() => undefined)
    renderMenu(<ViewSwitcherCreate onClick={onClick} />)
    await open()

    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Criar nova view' })),
    )

    expect(onClick).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  test('accepts a custom label', async () => {
    renderMenu(<ViewSwitcherCreate label="Nova" onClick={() => undefined} />)
    await open()

    expect(screen.getByRole('button', { name: 'Nova' })).toBeTruthy()
  })
})
