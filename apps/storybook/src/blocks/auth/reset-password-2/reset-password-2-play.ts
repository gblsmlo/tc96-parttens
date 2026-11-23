import { userEvent, type within } from 'storybook/test'

export type Canvas = ReturnType<typeof within>

export const password = 'segredo123'

export const expiringSoon = 'Falta menos de um minuto para este link expirar.'

export const passwordField = (canvas: Canvas) =>
  canvas.getByLabelText('Nova senha')

export const confirmField = (canvas: Canvas) =>
  canvas.getByLabelText('Confirmar senha')

export const submitButton = (canvas: Canvas) =>
  canvas.getByRole('button', { name: 'Redefinir senha' })

export const countdown = (canvas: Canvas, time: string) =>
  canvas.getByText(`Este link expira em ${time}`)

export const expiredTitle = (canvas: Canvas) =>
  canvas.getByRole('heading', { level: 1, name: 'Link expirado' })

export const requestButton = (canvas: Canvas, name = 'Solicitar novo link') =>
  canvas.getByRole('button', { name })

export async function fillPasswords(canvas: Canvas, confirmation = password) {
  await userEvent.type(passwordField(canvas), password)
  await userEvent.type(confirmField(canvas), confirmation)
}
