import { afterEach, expect, mock, test } from 'bun:test'
import type { FlowLogEntry } from '../../core'

await import('../../test/dom')

const { cleanup, fireEvent, render, screen, within } = await import(
  '@testing-library/react'
)
const { FlowInspectorLogs } = await import('./flow-inspector-logs')

afterEach(cleanup)

const entries: FlowLogEntry[] = [
  {
    description: 'Passed: 1.842 tokens',
    id: 'a',
    sequence: 1,
    status: 'success',
    stepId: 's1',
    stepName: 'Claude',
  },
  {
    description: 'Falhou ao enviar',
    id: 'b',
    sequence: 2,
    status: 'failed',
    stepId: 's2',
    stepName: 'Resend',
  },
]

test('lists the entries with state, name, sequence and description', () => {
  render(
    <FlowInspectorLogs
      entries={entries}
      filter="all"
      onFilterChange={() => {}}
    />,
  )
  expect(screen.getByText('2 entradas')).toBeTruthy()
  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(2)
  expect(within(items[0] as HTMLElement).getByText('Claude')).toBeTruthy()
  expect(within(items[0] as HTMLElement).getByText('#1')).toBeTruthy()
  expect(
    within(items[0] as HTMLElement).getByText('Passed: 1.842 tokens'),
  ).toBeTruthy()
  expect(
    within(items[1] as HTMLElement).getByRole('img', { name: 'Falhou' }),
  ).toBeTruthy()
})

test('counts one entry in the singular', () => {
  render(
    <FlowInspectorLogs
      entries={entries.slice(0, 1)}
      filter="step"
      onFilterChange={() => {}}
    />,
  )
  expect(screen.getByText('1 entrada')).toBeTruthy()
})

test('presses the active filter and reports the other', () => {
  const onFilterChange = mock((_filter: string) => {})
  render(
    <FlowInspectorLogs
      entries={entries}
      filter="step"
      onFilterChange={onFilterChange}
    />,
  )
  const group = screen.getByRole('group', { name: 'Filtrar logs' })
  const step = within(group).getByRole('button', { name: 'Este passo' })
  const all = within(group).getByRole('button', { name: 'Todos os passos' })
  expect(step.getAttribute('aria-pressed')).toBe('true')
  expect(all.getAttribute('aria-pressed')).toBe('false')
  fireEvent.click(all)
  expect(onFilterChange).toHaveBeenCalledWith('all')
})

test('shows the empty state and runs the action', () => {
  const onEmptyAction = mock(() => {})
  render(
    <FlowInspectorLogs
      emptyActionLabel="Executar uma vez"
      entries={[]}
      filter="all"
      onEmptyAction={onEmptyAction}
      onFilterChange={() => {}}
    />,
  )
  expect(screen.getByText('Sem logs ainda')).toBeTruthy()
  expect(screen.getByText('0 entradas')).toBeTruthy()
  expect(screen.queryByRole('list')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Executar uma vez' }))
  expect(onEmptyAction).toHaveBeenCalledTimes(1)
})

test('hides the empty action without a callback', () => {
  render(
    <FlowInspectorLogs
      emptyActionLabel="Executar uma vez"
      entries={[]}
      filter="all"
      onFilterChange={() => {}}
    />,
  )
  expect(screen.queryByRole('button', { name: 'Executar uma vez' })).toBeNull()
})
