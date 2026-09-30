import { afterEach, describe, expect, test } from 'bun:test'

await import('../../test/dom')

Object.assign(globalThis, { NodeFilter: window.NodeFilter })

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { PeopleProperty } = await import('./people-property')

afterEach(cleanup)

const options = [
  { label: 'Bruno Lima', value: 'person-1' },
  { label: 'Ana Souza', value: 'person-2' },
] as const

describe('PeopleProperty', () => {
  test('uses a labelled chip to open the editing controls', () => {
    const { container } = render(
      <PeopleProperty
        ariaLabel="Participantes da tarefa"
        onValueChange={() => undefined}
        options={options}
        value={[]}
      />,
    )

    const trigger = screen.getByRole('button', { name: 'Adicionar pessoa' })
    expect(trigger).toBeTruthy()
    expect(trigger.textContent).toContain('Adicionar pessoa')
    expect(
      container.querySelector('[data-slot="combobox-chips"]')?.lastElementChild,
    ).toBe(trigger)
  })

  test('shrinks the trigger to the plus once someone is already applied', () => {
    render(
      <PeopleProperty
        ariaLabel="Participantes da tarefa"
        onValueChange={() => undefined}
        options={options}
        value={[options[0].value]}
      />,
    )

    const trigger = screen.getByRole('button', { name: 'Adicionar pessoa' })
    expect(
      trigger.querySelector('svg')?.classList.contains('lucide-plus'),
    ).toBe(true)
  })

  test('renders each applied person as an avatar and name chip', () => {
    const { container } = render(
      <PeopleProperty
        ariaLabel="Participantes da tarefa"
        onValueChange={() => undefined}
        options={options}
        value={['person-1']}
      />,
    )

    expect(screen.getByText('Bruno Lima')).toBeTruthy()
    expect(container.querySelector('[data-slot="avatar"]')).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Remover Bruno Lima' }),
    ).toBeTruthy()
  })

  test('returns the next collection when a person is selected', async () => {
    const values: string[][] = []
    render(
      <PeopleProperty
        ariaLabel="Participantes da tarefa"
        onValueChange={(value) => values.push(Array.from(value))}
        options={options}
        value={['person-1']}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar pessoa' }))
    const option = await screen.findByRole('option', { name: /Ana Souza/ })
    fireEvent.pointerDown(option, { pointerType: 'mouse' })
    fireEvent.click(option)

    expect(values).toEqual([['person-1', 'person-2']])
  })

  test('returns the next collection when a chip is removed', () => {
    const values: string[][] = []
    render(
      <PeopleProperty
        ariaLabel="Participantes da tarefa"
        onValueChange={(value) => values.push(Array.from(value))}
        options={options}
        value={['person-1', 'person-2']}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remover Bruno Lima' }))

    expect(values).toEqual([['person-2']])
  })

  test('keeps read-only people out of the editing controls', () => {
    render(<PeopleProperty options={options} readOnly value={['person-1']} />)

    expect(screen.getByText('Bruno Lima')).toBeTruthy()
    expect(screen.queryByRole('combobox')).toBeNull()
    expect(
      screen.queryByRole('button', { name: 'Remover Bruno Lima' }),
    ).toBeNull()
  })

  test('shows a placeholder when nobody is applied and there is nothing to change', () => {
    render(<PeopleProperty options={options} readOnly value={[]} />)

    expect(screen.getByText('Adicionar pessoa')).toBeTruthy()
  })
})
