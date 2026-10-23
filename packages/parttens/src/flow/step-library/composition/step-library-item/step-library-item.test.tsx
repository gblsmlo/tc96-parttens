import { afterEach, expect, test } from 'bun:test'
import type { FlowStepType } from '../../../canvas/core'

await import('../../test/dom')

const { act, cleanup, render, screen } = await import('@testing-library/react')
const { FlowStepLibraryItem } = await import('./step-library-item')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

const type: FlowStepType = {
  description: 'Envia uma mensagem por e-mail',
  group: 'Mensagens',
  id: 'send-email',
  label: 'Enviar e-mail',
}

test('describes the button by the visible description', () => {
  render(<FlowStepLibraryItem onAdd={() => {}} type={type} />)
  const button = screen.getByRole('button', { name: 'Enviar e-mail' })
  const id = button.getAttribute('aria-describedby')
  expect(id).toBeTruthy()
  expect(document.getElementById(id as string)?.textContent).toBe(
    type.description,
  )
})

test('drops aria-describedby when collapsed hides the description', () => {
  render(<FlowStepLibraryItem collapsed onAdd={() => {}} type={type} />)
  const button = screen.getByRole('button', { name: 'Enviar e-mail' })
  expect(button.hasAttribute('aria-describedby')).toBe(false)
})

test('disabled disables the button and the drag', () => {
  render(<FlowStepLibraryItem disabled onAdd={() => {}} type={type} />)
  const button = screen.getByRole('button', {
    name: 'Enviar e-mail',
  }) as HTMLButtonElement
  expect(button.disabled).toBe(true)
  expect(button.getAttribute('draggable')).toBe('false')
})
