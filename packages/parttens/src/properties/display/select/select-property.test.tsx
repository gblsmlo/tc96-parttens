import { afterEach, describe, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, fireEvent, render, screen, waitFor } = await import(
  '@testing-library/react'
)
const { useState } = await import('react')
const { SelectProperty } = await import('./select-property')

afterEach(cleanup)

function Controlled({ initial }: Readonly<{ initial: string | null }>) {
  const [value, setValue] = useState<string | null>(initial)

  return (
    <SelectProperty
      ariaLabel="Prioridade"
      emptyOptionLabel="Sem prioridade"
      onValueChange={setValue}
      options={options}
      placeholder="Prioridade"
      value={value}
    />
  )
}

async function choose(trigger: HTMLElement, name: string) {
  fireEvent.pointerDown(trigger, { pointerId: 1, pointerType: 'mouse' })
  fireEvent.mouseDown(trigger)
  fireEvent.pointerUp(trigger, { pointerId: 1, pointerType: 'mouse' })
  fireEvent.click(trigger)

  const option = await waitFor(() => screen.getByRole('option', { name }))
  fireEvent.pointerDown(option, { pointerType: 'mouse' })
  fireEvent.click(option)
}

const options = [
  { label: 'Reunião', value: 'meeting' },
  { label: 'Ligação', value: 'call' },
  { label: 'Outro', value: 'other' },
]

describe('SelectProperty', () => {
  test('stays a value while nobody can change it', () => {
    const { container } = render(
      <SelectProperty ariaLabel="Tipo" options={options} value="meeting" />,
    )

    const surface = container.querySelector('[data-slot="property-surface"]')
    expect(surface?.getAttribute('role')).toBe('img')
    expect(surface?.getAttribute('aria-label')).toBe('Tipo: Reunião')
    // Sem handler não há selector: uma propriedade read-only não simula edição.
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  test('becomes a trigger once the consumer can persist the choice', () => {
    render(
      <SelectProperty
        ariaLabel="Tipo"
        action={() => undefined}
        options={options}
        value="call"
      />,
    )

    expect(screen.getByRole('combobox', { name: 'Tipo: Ligação' })).toBeTruthy()
  })

  test('reports the chosen value with the one it replaced', async () => {
    const changes: { value: string | null; previous: string | null }[] = []
    render(
      <SelectProperty
        ariaLabel="Tipo"
        action={(value, context) =>
          changes.push({ previous: context.previousValue, value })
        }
        options={options}
        value="call"
      />,
    )

    const trigger = screen.getByRole('combobox', { name: 'Tipo: Ligação' })
    fireEvent.pointerDown(trigger, { pointerId: 1, pointerType: 'mouse' })
    fireEvent.mouseDown(trigger)
    fireEvent.pointerUp(trigger, { pointerId: 1, pointerType: 'mouse' })
    fireEvent.click(trigger)

    const option = await waitFor(() =>
      screen.getByRole('option', { name: 'Outro' }),
    )
    fireEvent.pointerDown(option, { pointerType: 'mouse' })
    fireEvent.click(option)

    expect(changes).toEqual([{ previous: 'call', value: 'other' }])
  })

  test('names the property while nothing is chosen', () => {
    const { container } = render(
      <SelectProperty
        ariaLabel="Tipo"
        options={options}
        placeholder="Tipo"
        value={null}
      />,
    )

    const surface = container.querySelector('[data-slot="property-surface"]')
    // Sem valor o nome acessível é só a propriedade, sem repetir o placeholder.
    expect(surface?.getAttribute('aria-label')).toBe('Tipo')
    // E a ausência usa a variante outline do Badge: não se lê como valor.
    expect(surface?.getAttribute('data-empty')).toBe('true')
    expect(container.textContent).toContain('Tipo')
  })

  test('offers going back to no value and reports it as null', async () => {
    const changes: (string | null)[] = []
    render(
      <SelectProperty
        action={(value) => changes.push(value)}
        ariaLabel="Tipo"
        emptyOptionLabel="Sem tipo"
        options={options}
        placeholder="Tipo"
        value="call"
      />,
    )

    const trigger = screen.getByRole('combobox', { name: 'Tipo: Ligação' })
    fireEvent.pointerDown(trigger, { pointerId: 1, pointerType: 'mouse' })
    fireEvent.mouseDown(trigger)
    fireEvent.pointerUp(trigger, { pointerId: 1, pointerType: 'mouse' })
    fireEvent.click(trigger)

    const vazio = await waitFor(() =>
      screen.getByRole('option', { name: 'Sem tipo' }),
    )
    fireEvent.pointerDown(vazio, { pointerType: 'mouse' })
    fireEvent.click(vazio)

    // Ausência é `null`, não uma string vazia vazando para o consumer.
    expect(changes).toEqual([null])
  })

  test('falls back when the current value is outside the catalog', () => {
    const { container } = render(
      <SelectProperty
        ariaLabel="Tipo"
        fallback="Não informado"
        options={options}
        value="desconhecido"
      />,
    )

    expect(container.textContent).toContain('Não informado')
    expect(
      container
        .querySelector('[data-slot="property-surface"]')
        ?.getAttribute('aria-label'),
    ).toBe('Tipo: Não informado')
  })

  test('reads as filled once the user picks the empty option over a null', async () => {
    const { container } = render(<Controlled initial={null} />)
    const surface = () =>
      container.querySelector('[data-slot="property-surface"]')

    expect(surface()?.getAttribute('data-empty')).toBe('true')

    await choose(
      screen.getByRole('combobox', { name: 'Prioridade' }),
      'Sem prioridade',
    )

    await waitFor(() =>
      expect(surface()?.getAttribute('data-empty')).toBeNull(),
    )
    expect(surface()?.getAttribute('aria-label')).toBe(
      'Prioridade: Sem prioridade',
    )
    expect(container.textContent).toContain('Sem prioridade')
    expect(surface()?.querySelector('svg')).not.toBeNull()
  })

  test('reads as filled after moving from a value to the empty option', async () => {
    const { container } = render(<Controlled initial="call" />)
    const surface = () =>
      container.querySelector('[data-slot="property-surface"]')

    await choose(
      screen.getByRole('combobox', { name: 'Prioridade: Ligação' }),
      'Sem prioridade',
    )

    await waitFor(() =>
      expect(surface()?.getAttribute('aria-label')).toBe(
        'Prioridade: Sem prioridade',
      ),
    )
    expect(surface()?.getAttribute('data-empty')).toBeNull()
  })

  test('goes back to absent when null returns from outside after another value', async () => {
    const element = (value: string | null) => (
      <SelectProperty
        ariaLabel="Prioridade"
        emptyOptionLabel="Sem prioridade"
        onValueChange={() => undefined}
        options={options}
        placeholder="Prioridade"
        value={value}
      />
    )
    const { container, rerender } = render(element(null))
    const surface = () =>
      container.querySelector('[data-slot="property-surface"]')

    await choose(
      screen.getByRole('combobox', { name: 'Prioridade' }),
      'Sem prioridade',
    )
    await waitFor(() =>
      expect(surface()?.getAttribute('data-empty')).toBeNull(),
    )

    rerender(element('call'))
    rerender(element(null))

    expect(surface()?.getAttribute('data-empty')).toBe('true')
  })
})
