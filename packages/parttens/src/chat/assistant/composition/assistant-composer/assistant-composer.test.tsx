import { afterEach, expect, mock, test } from 'bun:test'

await import('../../test/dom')

const { act, cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { AssistantComposer } = await import('./assistant-composer')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

const input = () =>
  screen.getByRole('textbox', {
    name: 'Mensagem para o assistente',
  }) as HTMLTextAreaElement

test('send calls onSend with the trimmed text and clears the input', async () => {
  const onSend = mock()
  render(<AssistantComposer onSend={onSend} />)

  fireEvent.input(input(), { target: { value: '  Por que falhou?  ' } })
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))
  })

  expect(onSend).toHaveBeenCalledWith('Por que falhou?')
  expect(input().value).toBe('')
})

test('send is disabled while the draft is empty', () => {
  render(<AssistantComposer onSend={() => {}} />)

  expect(
    (screen.getByRole('button', { name: 'Enviar' }) as HTMLButtonElement)
      .disabled,
  ).toBe(true)
})

test('attach renders only with onAttach and calls it', () => {
  const onAttach = mock()
  const { rerender } = render(<AssistantComposer onSend={() => {}} />)

  expect(screen.queryByRole('button', { name: 'Anexar contexto' })).toBeNull()

  rerender(<AssistantComposer onAttach={onAttach} onSend={() => {}} />)
  fireEvent.click(screen.getByRole('button', { name: 'Anexar contexto' }))

  expect(onAttach).toHaveBeenCalledTimes(1)
})

test('placeholder comes from the prop', () => {
  render(<AssistantComposer onSend={() => {}} placeholder="Pergunte algo" />)

  expect(input().placeholder).toBe('Pergunte algo')
})
