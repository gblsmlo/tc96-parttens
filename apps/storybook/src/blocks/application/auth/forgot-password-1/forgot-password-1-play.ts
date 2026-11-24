import type { within } from 'storybook/test'

export type Canvas = ReturnType<typeof within>

export const email = 'ana@acme.com'

export const sentDescription =
  'Enviamos um link para redefinir a senha para ana@acme.com.'

export const emailField = (canvas: Canvas) => canvas.getByLabelText('E-mail')

export const submitButton = (canvas: Canvas) =>
  canvas.getByRole('button', { name: 'Enviar link' })

export const sentTitle = (canvas: Canvas) =>
  canvas.getByRole('heading', { level: 1, name: 'Verifique seu e-mail' })

export const resendButton = (canvas: Canvas, name = 'Reenviar e-mail') =>
  canvas.getByRole('button', { name })
