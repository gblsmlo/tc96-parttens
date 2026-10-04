import { afterEach, describe, expect, mock, test } from 'bun:test'
import type { ReactNode } from 'react'

await import('../test/dom')

Object.assign(globalThis, { NodeFilter: window.NodeFilter })

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { PropertyMultiSelectShell } = await import(
  './property-multi-select-shell'
)
const { TagIcon } = await import('lucide-react')

afterEach(cleanup)

const documents = { label: 'Documentos', value: 'documents' }
const returns = { label: 'Retorno', value: 'return' }
const options = [documents, returns]

const renderShell = ({
  isLoading,
  onChange = () => undefined,
  options: shellOptions = options,
  placement,
  renderTrigger,
  value = [],
}: {
  isLoading?: boolean
  onChange?: (
    value: readonly string[],
    change: {
      added: { label: string; value: string } | null
      previousValue: readonly string[]
      removed: { label: string; value: string } | null
    },
  ) => void
  options?: typeof options
  placement?: { align: 'start' }
  renderTrigger?: (controls: { open: () => void }) => ReactNode
  value?: string[]
} = {}) =>
  render(
    <PropertyMultiSelectShell
      addIcon={TagIcon}
      addLabel="Adicionar tag"
      ariaLabel="Tags"
      dropdownPlacement={placement}
      emptyLabel="Nenhuma tag encontrada."
      isLoading={isLoading}
      loadingLabel="Carregando tags…"
      onChange={onChange}
      options={shellOptions}
      placeholder="Adicionar uma tag"
      removeLabel={(option) => `Remover tag ${option.label}`}
      renderOption={(option) => option.label}
      renderTrigger={renderTrigger}
      selectedOptions={shellOptions.filter((option) =>
        value.includes(option.value),
      )}
      value={value}
    />,
  )

describe('PropertyMultiSelectShell', () => {
  test('empty, the add chip names itself with the placeholder and the add icon', () => {
    renderShell()

    const trigger = screen.getByRole('button', { name: 'Adicionar uma tag' })
    expect(trigger.textContent).toBe('Adicionar uma tag')
    expect(trigger.querySelector('svg')?.classList.contains('lucide-tag')).toBe(
      true,
    )
  })

  test('with values, chips name their removal and the add chip collapses to a plus', () => {
    renderShell({ value: ['documents'] })

    expect(
      screen.getByRole('button', { name: 'Remover tag Documentos' }),
    ).toBeTruthy()
    const trigger = screen.getByRole('button', { name: 'Adicionar tag' })
    expect(trigger.textContent).toBe('')
    expect(trigger.className).toContain('size-6')
  })

  test('reports the added option with the previous value', async () => {
    const onChange = mock()
    renderShell({ onChange, value: ['documents'] })

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar tag' }))
    const option = await screen.findByRole('option', { name: 'Retorno' })
    fireEvent.pointerDown(option, { pointerType: 'mouse' })
    fireEvent.click(option)

    expect(onChange).toHaveBeenCalledWith(['documents', 'return'], {
      added: returns,
      previousValue: ['documents'],
      removed: null,
    })
  })

  test('reports the removed option when a chip is removed', () => {
    const onChange = mock()
    renderShell({ onChange, value: ['documents', 'return'] })

    fireEvent.click(screen.getByRole('button', { name: 'Remover tag Retorno' }))

    expect(onChange).toHaveBeenCalledWith(['documents'], {
      added: null,
      previousValue: ['documents', 'return'],
      removed: returns,
    })
  })

  test('renderTrigger replaces the chips and opens the list', async () => {
    renderShell({
      renderTrigger: ({ open }) => (
        <button onClick={open} type="button">
          abrir
        </button>
      ),
    })

    expect(
      screen.queryByRole('button', { name: 'Adicionar uma tag' }),
    ).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'abrir' }))

    expect(
      await screen.findByRole('option', { name: 'Documentos' }),
    ).toBeTruthy()
  })

  test('aligns the popup to the end unless told otherwise', async () => {
    const { unmount } = renderShell()
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar uma tag' }))
    await screen.findByRole('option', { name: 'Documentos' })
    expect(
      document.querySelector<HTMLElement>('[data-slot="combobox-positioner"]')
        ?.dataset.align,
    ).toBe('end')
    unmount()

    renderShell({ placement: { align: 'start' } })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar uma tag' }))
    await screen.findByRole('option', { name: 'Documentos' })
    expect(
      document.querySelector<HTMLElement>('[data-slot="combobox-positioner"]')
        ?.dataset.align,
    ).toBe('start')
  })

  test('shows the loading and empty labels in the popup', async () => {
    renderShell({ isLoading: true, options: [] as unknown as typeof options })

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar uma tag' }))

    expect(await screen.findByText('Carregando tags…')).toBeTruthy()
    expect(screen.getByText('Nenhuma tag encontrada.')).toBeTruthy()
  })
})
