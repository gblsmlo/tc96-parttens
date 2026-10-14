import { afterEach, describe, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render, screen } = await import('@testing-library/react')
const { PersonProperty } = await import('./person-property')

afterEach(cleanup)

const options = [{ fallback: 'AS', label: 'Ana Souza', value: 'ana' }] as const

// A aresta do avatar por superfície — 16px no badge, 20px no plain — é asseverada nas
// stories `Patterns/Fields/Properties/Person`, em geometria renderizada. Aqui fica o que não é
// aparência: o rótulo acessível, a supressão do texto e o estado vazio.
describe('PersonProperty', () => {
  test('renders only the avatar while preserving the accessible person label', () => {
    render(
      <PersonProperty
        ariaLabel="Responsável"
        display="avatar"
        options={options}
        readOnly
        value="ana"
        variant="plain"
      />,
    )

    expect(screen.getByLabelText('Responsável: Ana Souza')).toBeTruthy()
    expect(screen.queryByText('Ana Souza')).toBeNull()
  })

  test('keeps an empty avatar visually identifiable when no person is assigned', () => {
    const { container } = render(
      <PersonProperty
        ariaLabel="Responsável"
        display="avatar"
        options={options}
        placeholder="Sem responsável"
        readOnly
        value={null}
        variant="plain"
      />,
    )

    expect(screen.getByLabelText('Responsável: Sem responsável')).toBeTruthy()
    expect(container.querySelector('.lucide-user')).toBeTruthy()
  })
})
