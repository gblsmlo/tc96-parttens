import { userEvent, type within } from 'storybook/test'

export const name = 'Ana Souza'
export const email = 'ana@acme.com'
export const password = 'segredo123'

export type Canvas = ReturnType<typeof within>

export const nameField = (canvas: Canvas) =>
  canvas.getByRole('textbox', { name: 'Nome' })

export const emailField = (canvas: Canvas) =>
  canvas.getByRole('textbox', { name: 'E-mail' })

export const passwordField = (canvas: Canvas) => canvas.getByLabelText('Senha')

export const confirmField = (canvas: Canvas) =>
  canvas.getByLabelText('Confirmar senha')

export const submitButton = (canvas: Canvas) =>
  canvas.getByRole('button', { name: 'Criar conta' })

export async function fillIdentity(canvas: Canvas) {
  await userEvent.type(nameField(canvas), name)
  await userEvent.type(emailField(canvas), email)
}

export async function fillAccount(canvas: Canvas, confirmation = password) {
  await fillIdentity(canvas)
  await userEvent.type(passwordField(canvas), password)
  await userEvent.type(confirmField(canvas), confirmation)
}
