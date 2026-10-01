import { afterEach, describe, expect, mock, test } from 'bun:test'
import type { ComponentType, ReactNode } from 'react'

await import('../../test/dom')

// `collection/index` alcança o Kanban, e o dnd-kit lê `ResizeObserver` no import.
class MockResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.assign(globalThis, { ResizeObserver: MockResizeObserver })

const { act, cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { CircleDotIcon } = await import('lucide-react')
const collectionModule = await import('../index')
const FilterRadioSubmenu = Reflect.get(
  collectionModule,
  'FilterRadioSubmenu',
) as ComponentType<{
  clearLabel?: string
  icon: typeof CircleDotIcon
  label: string
  onValueChange: (value: string) => void
  options: readonly (readonly [string, string])[]
  value?: string
}>
const ViewSettingsMenu = Reflect.get(
  collectionModule,
  'ViewSettingsMenu',
) as ComponentType<{
  children: ReactNode
  onClearFilters: () => void
}>
const ViewSettingsSection = Reflect.get(
  collectionModule,
  'ViewSettingsSection',
) as ComponentType<{
  children: ReactNode
  label: ReactNode
}>
// A toolbar saiu de collection-views para `src/shared`; importar pelo nome
// faz o typecheck acusar se ela mudar de lugar de novo.
const { CollectionToolbar } = await import(
  '../../../shared/components/collection-toolbar'
)

/** O gatilho do menu é um `ToolbarButton`, que exige o contexto do Base UI. */
const renderSubmenu = (submenu: ReactNode) =>
  render(
    <CollectionToolbar
      endSlot={
        <ViewSettingsMenu onClearFilters={() => undefined}>
          <ViewSettingsSection label="Filtros">{submenu}</ViewSettingsSection>
        </ViewSettingsMenu>
      }
    />,
  )

const OPTIONS = [
  ['person', 'Pessoa'],
  ['organization', 'Organização'],
] as const

const openSubmenu = async (label: string) => {
  await act(async () =>
    fireEvent.click(screen.getByRole('button', { name: 'Exibição' })),
  )
  await act(async () => {
    fireEvent.click(screen.getByRole('menuitem', { name: label }))
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

afterEach(cleanup)

describe('FilterRadioSubmenu', () => {
  test('marca a opção ativa e devolve o valor escolhido', async () => {
    const onValueChange = mock(() => undefined)
    renderSubmenu(
      <FilterRadioSubmenu
        icon={CircleDotIcon}
        label="Tipo"
        onValueChange={onValueChange}
        options={OPTIONS}
        value="person"
      />,
    )

    await openSubmenu('Tipo')
    expect(
      screen
        .getByRole('menuitemradio', { name: 'Pessoa' })
        .getAttribute('aria-checked'),
    ).toBe('true')
    await act(async () =>
      fireEvent.click(
        screen.getByRole('menuitemradio', { name: 'Organização' }),
      ),
    )
    expect(onValueChange).toHaveBeenCalledWith('organization')
  })

  test('sem valor, "todos" é a opção marcada e devolve string vazia', async () => {
    const onValueChange = mock(() => undefined)
    renderSubmenu(
      <FilterRadioSubmenu
        icon={CircleDotIcon}
        label="Tipo"
        onValueChange={onValueChange}
        options={OPTIONS}
      />,
    )

    await openSubmenu('Tipo')
    const todos = screen.getByRole('menuitemradio', { name: 'Todos' })
    expect(todos.getAttribute('aria-checked')).toBe('true')

    await act(async () => fireEvent.click(todos))
    // O sentinela do `MenuRadioGroup` não vaza: a vitrine recebe ausência de filtro.
    expect(onValueChange).toHaveBeenCalledWith('')
  })
})
