import { afterEach, describe, expect, test } from 'bun:test'

await import('../../test/dom')

Object.assign(globalThis, { NodeFilter: window.NodeFilter })

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { TagsProperty } = await import('./tags-property')

afterEach(cleanup)

const options = [
  { label: 'Documentos', value: 'documents' },
  { label: 'Retorno', value: 'return' },
] as const

describe('TagsProperty', () => {
  test('renders the count trigger as an empty surface until a tag is chosen', () => {
    const { rerender } = render(
      <TagsProperty
        display="count"
        onValueChange={() => undefined}
        options={options}
        value={[]}
        variant="badge"
      />,
    )

    const trigger = () => screen.getByRole('button', { name: 'Tags' })
    expect(trigger().textContent).toBe('0 Tag')
    expect(trigger().getAttribute('data-empty')).toBe('true')

    rerender(
      <TagsProperty
        display="count"
        onValueChange={() => undefined}
        options={options}
        value={[options[0].value]}
        variant="badge"
      />,
    )
    expect(trigger().textContent).toBe('1 Tag')
    expect(trigger().getAttribute('data-empty')).toBe(null)

    rerender(
      <TagsProperty
        display="count"
        onValueChange={() => undefined}
        options={options}
        value={options.map((option) => option.value)}
        variant="badge"
      />,
    )
    expect(trigger().textContent).toBe('2 Tags')
  })

  test('uses a labelled chip to open the editing controls', () => {
    const { container } = render(
      <TagsProperty
        ariaLabel="Tags da tarefa"
        onValueChange={() => undefined}
        options={options}
        value={[]}
      />,
    )

    const trigger = screen.getByRole('button', { name: 'Adicionar tag' })
    expect(trigger).toBeTruthy()
    // Sem nenhuma tag o gatilho se explica: chip rotulado com o ícone de
    // etiqueta, e o nome acessível vem do texto visível.
    expect(trigger.textContent).toContain('Adicionar tag')
    expect(trigger.querySelectorAll('svg')).toHaveLength(1)
    expect(trigger.querySelector('svg')?.classList.contains('lucide-tag')).toBe(
      true,
    )
    expect(
      container.querySelector('[data-slot="combobox-chips"]')?.lastElementChild,
    ).toBe(trigger)

    fireEvent.click(trigger)
    expect(screen.getByRole('button', { name: 'Adicionar tag' })).toBeTruthy()
    expect(
      screen.queryByRole('combobox', { name: 'Tags da tarefa' }),
    ).toBeNull()
  })

  test('shrinks the trigger to the plus once the row already has tags', () => {
    render(
      <TagsProperty
        ariaLabel="Tags da tarefa"
        onValueChange={() => undefined}
        options={options}
        value={[options[0].value]}
      />,
    )

    const trigger = screen.getByRole('button', { name: 'Adicionar tag' })

    // Com uma tag ao lado, o contexto já está dado: sobra o sinal de adicionar.
    expect(trigger.textContent).toBe('')
    expect(
      trigger.querySelector('svg')?.classList.contains('lucide-plus'),
    ).toBe(true)
    expect(trigger.className).toContain('size-6')
  })

  test('renders the editable multi-value collection as a plain property', () => {
    const { container } = render(
      <TagsProperty
        ariaLabel="Tags da tarefa"
        onValueChange={() => undefined}
        options={options}
        value={['documents']}
        variant="plain"
      />,
    )

    expect(screen.getByRole('button', { name: 'Adicionar tag' })).toBeTruthy()
    expect(screen.getByText('Documentos')).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Remover tag Documentos' }),
    ).toBeTruthy()
    expect(
      container.querySelector<HTMLElement>('[data-slot="tags-property"]')
        ?.dataset.variant,
    ).toBe('plain')
    expect(
      container.querySelector('[data-slot="combobox-chips"]')?.className,
    ).toContain('bg-transparent!')
  })

  test('uses plain as the default visual variant', () => {
    const { container } = render(
      <TagsProperty
        onValueChange={() => undefined}
        options={options}
        value={['documents']}
      />,
    )

    expect(
      container.querySelector<HTMLElement>('[data-slot="tags-property"]')
        ?.dataset.variant,
    ).toBe('plain')
  })

  test('renders editable tags as the COSS chip, without own styling', () => {
    const { container } = render(
      <TagsProperty
        onValueChange={() => undefined}
        options={options}
        value={['documents']}
      />,
    )

    const tag = container.querySelector('[data-slot="combobox-chip"]')

    expect(tag?.textContent).toContain('Documentos')
    expect(tag?.className).not.toContain('rounded-full')
  })

  test('returns the next collection when an option is selected', async () => {
    const values: string[][] = []
    render(
      <TagsProperty
        ariaLabel="Tags da tarefa"
        onValueChange={(value) => values.push(Array.from(value))}
        options={options}
        value={['documents']}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar tag' }))
    const option = await screen.findByRole('option', { name: 'Retorno' })
    fireEvent.pointerDown(option, { pointerType: 'mouse' })
    fireEvent.click(option)

    expect(values).toEqual([['documents', 'return']])
  })

  test('gives action the added option and runs it instead of onValueChange', async () => {
    const calls: unknown[] = []
    const values: string[][] = []
    render(
      <TagsProperty
        action={(value, context) => calls.push({ context, value })}
        onValueChange={(value) => values.push(Array.from(value))}
        options={options}
        value={['documents']}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar tag' }))
    const option = await screen.findByRole('option', { name: 'Retorno' })
    fireEvent.pointerDown(option, { pointerType: 'mouse' })
    fireEvent.click(option)

    expect(values).toEqual([])
    expect(calls).toEqual([
      {
        context: {
          added: options[1],
          previousValue: ['documents'],
          removed: null,
        },
        value: ['documents', 'return'],
      },
    ])
  })

  test('gives action the removed option when a chip is removed', () => {
    const calls: unknown[] = []
    render(
      <TagsProperty
        action={(value, context) => calls.push({ context, value })}
        options={options}
        value={['documents', 'return']}
      />,
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Remover tag Documentos' }),
    )

    expect(calls).toEqual([
      {
        context: {
          added: null,
          previousValue: ['documents', 'return'],
          removed: options[0],
        },
        value: ['return'],
      },
    ])
  })

  test('opens the available options without a search field', async () => {
    render(
      <TagsProperty
        ariaLabel="Tags da tarefa"
        onValueChange={() => undefined}
        options={options}
        value={[]}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar tag' }))
    expect(
      screen.queryByRole('combobox', { name: 'Tags da tarefa' }),
    ).toBeNull()
    expect(
      await screen.findByRole('option', { name: 'Documentos' }),
    ).toBeTruthy()

    const popup = document.querySelector<HTMLElement>(
      '[data-slot="combobox-positioner"] > span',
    )
    expect(popup?.className).toContain('w-max')
    expect(popup?.className).toContain('min-w-0!')
    expect(
      document.querySelector<HTMLElement>('[data-slot="combobox-positioner"]')
        ?.dataset.align,
    ).toBe('end')
  })

  test('keeps read-only tags out of the editing controls', () => {
    render(
      <TagsProperty
        options={options}
        readOnly
        value={['documents']}
        variant="plain"
      />,
    )

    expect(screen.getByText('Documentos')).toBeTruthy()
    expect(screen.queryByRole('combobox')).toBeNull()
    expect(
      screen.queryByRole('button', { name: 'Remover tag Documentos' }),
    ).toBeNull()
  })
})
