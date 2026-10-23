import { afterEach, expect, test } from 'bun:test'

await import('../../test/dom')

const { act, cleanup, render, screen } = await import('@testing-library/react')
const { FlowRunCard } = await import('./flow-run-card')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

test('names the card region and shows the status and the progress', () => {
  render(
    <FlowRunCard
      run={{
        completed: 2,
        note: 'Enviar e-mail falhou',
        status: 'failed',
        total: 4,
      }}
    />,
  )

  expect(screen.getByRole('region', { name: 'Última execução' })).toBeTruthy()
  expect(screen.getByText('Falhou')).toBeTruthy()
  expect(screen.getByText('Enviar e-mail falhou')).toBeTruthy()
  expect(
    screen.getByRole('progressbar', { name: 'Última execução: 50%' }),
  ).toBeTruthy()
})

test('describes a run with no note by its completed steps', () => {
  render(<FlowRunCard run={{ completed: 3, status: 'success', total: 3 }} />)

  expect(screen.getByText('3 de 3 passos concluídos')).toBeTruthy()
  expect(
    screen.getByRole('progressbar', { name: 'Última execução: 100%' }),
  ).toBeTruthy()
})

test('shows zero progress without steps', () => {
  render(<FlowRunCard run={{ completed: 0, status: 'not-run', total: 0 }} />)

  expect(screen.getByText('Não executada')).toBeTruthy()
  expect(
    screen.getByRole('progressbar', { name: 'Última execução: 0%' }),
  ).toBeTruthy()
})
