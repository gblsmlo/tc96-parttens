import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { cleanup, render, screen, within } = await import(
  '@testing-library/react'
)
const { FlowInspectorStatus } = await import('./flow-inspector-status')

afterEach(cleanup)

test('shows the last run and the test runs', () => {
  render(
    <FlowInspectorStatus
      durationMs={1500}
      runId="run_1"
      stats={{ completed: 6, entered: 8 }}
      status="failed"
    />,
  )
  const last = screen.getByRole('region', { name: 'Última execução' })
  expect(within(last).getByText('Falhou')).toBeTruthy()
  expect(within(last).getByText('1,5 s')).toBeTruthy()
  expect(within(last).getByText('run_1')).toBeTruthy()
  const tests = screen.getByRole('region', { name: 'Execuções de teste' })
  expect(within(tests).getByText('8')).toBeTruthy()
  expect(within(tests).getByText('6')).toBeTruthy()
  expect(within(tests).getByText('25%')).toBeTruthy()
  expect(screen.queryByText('Nenhuma execução chegou a este passo.')).toBeNull()
})

test('shows only the groups it receives', () => {
  render(<FlowInspectorStatus status="success" />)
  expect(screen.getByRole('region', { name: 'Última execução' })).toBeTruthy()
  expect(
    screen.queryByRole('region', { name: 'Execuções de teste' }),
  ).toBeNull()
  expect(screen.queryByText('Duração')).toBeNull()
})

test('notes that no run reached the step', () => {
  render(
    <FlowInspectorStatus
      stats={{ completed: 0, entered: 0 }}
      status="not-run"
    />,
  )
  expect(screen.getByText('Nenhuma execução chegou a este passo.')).toBeTruthy()
  expect(screen.getByText('—')).toBeTruthy()
})
