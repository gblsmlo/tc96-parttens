import { afterEach, describe, expect, mock, test } from 'bun:test'
import type { ComponentType } from 'react'

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
const collectionModule = await import('../index')
type SearchFieldProps = {
  label?: string
  onCommit: (value: string) => void
  placeholder?: string
  value?: string
}
const CollectionSearchField = Reflect.get(
  collectionModule,
  'CollectionSearchField',
) as ComponentType<SearchFieldProps>
// A toolbar saiu de collection-views para `src/shared`; importar pelo nome
// faz o typecheck acusar se ela mudar de lugar de novo.
const { CollectionToolbar } = await import(
  '../../../shared/components/collection-toolbar'
)

/** O campo só monta dentro da toolbar: `ToolbarInput` exige o contexto do Base UI. */
const renderField = (props: SearchFieldProps) =>
  render(<CollectionToolbar startSlot={<CollectionSearchField {...props} />} />)

afterEach(cleanup)

describe('CollectionSearchField', () => {
  test('só confirma no submit — digitar não escreve nada', async () => {
    const onCommit = mock(() => undefined)
    renderField({ label: 'Buscar contatos', onCommit })

    const field = screen.getByRole('searchbox', { name: 'Buscar contatos' })
    await act(async () => fireEvent.change(field, { target: { value: 'ana' } }))
    expect(onCommit).toHaveBeenCalledTimes(0)

    await act(async () =>
      fireEvent.submit(field.closest('form') as HTMLFormElement),
    )
    expect(onCommit).toHaveBeenCalledWith('ana')
  })

  test('esvaziar o campo confirma na hora, senão a busca fica presa', async () => {
    const onCommit = mock(() => undefined)
    renderField({ onCommit, value: 'ana' })

    const field = screen.getByRole('searchbox', { name: 'Buscar' })
    await act(async () => fireEvent.change(field, { target: { value: '' } }))
    expect(onCommit).toHaveBeenCalledWith('')
  })

  test('rascunho acompanha o valor confirmado quando ele muda por fora', async () => {
    const onCommit = mock(() => undefined)
    const { rerender } = renderField({ onCommit, value: 'ana' })
    expect(
      screen.getByRole<HTMLInputElement>('searchbox', { name: 'Buscar' }).value,
    ).toBe('ana')

    await act(async () =>
      rerender(
        <CollectionToolbar
          startSlot={
            <CollectionSearchField onCommit={onCommit} value="bruno" />
          }
        />,
      ),
    )
    expect(
      screen.getByRole<HTMLInputElement>('searchbox', { name: 'Buscar' }).value,
    ).toBe('bruno')
  })
})
