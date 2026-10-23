import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render, screen, within } = await import(
  '@testing-library/react'
)
const { FlowInspectorDetails } = await import('./flow-inspector-details')

afterEach(cleanup)

test('lists the pairs it receives in order', () => {
  render(
    <FlowInspectorDetails
      items={[
        { id: 'type', label: 'Tipo', value: 'Ação' },
        { id: 'name', label: 'Nome', value: 'Enviar mensagem' },
      ]}
    />,
  )
  const section = screen.getByRole('region', { name: 'Detalhes' })
  const terms = within(section)
    .getAllByRole('term')
    .map((term) => term.textContent)
  expect(terms).toEqual(['Tipo', 'Nome'])
  expect(within(section).getByText('Enviar mensagem')).toBeTruthy()
})

test('skips items without a value and renders only what it receives', () => {
  render(
    <FlowInspectorDetails
      items={[
        { id: 'type', label: 'Tipo', value: 'Ação' },
        { id: 'description', label: 'Descrição' },
        { id: 'inputs', label: 'Entradas', value: null },
      ]}
    />,
  )
  expect(screen.queryByText('Descrição')).toBeNull()
  expect(screen.queryByText('Entradas')).toBeNull()
  expect(screen.getByText('Tipo')).toBeTruthy()
})

test('shows the owner with an avatar fallback made of initials', () => {
  render(
    <FlowInspectorDetails
      items={[
        {
          id: 'owner',
          label: 'Responsável',
          owner: { name: 'Ana Souza' },
        },
      ]}
    />,
  )
  expect(screen.getByText('Ana Souza')).toBeTruthy()
  expect(screen.getByText('AS')).toBeTruthy()
})

test('takes the heading from the labels', () => {
  render(
    <FlowInspectorDetails
      items={[{ id: 'type', label: 'Type', value: 'Action' }]}
      labels={{ details: 'Details' }}
    />,
  )
  expect(screen.getByRole('region', { name: 'Details' })).toBeTruthy()
})
