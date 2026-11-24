import type { within } from 'storybook/test'

export type Canvas = ReturnType<typeof within>

export const email = 'ana@acme.com'

export const emailField = (canvas: Canvas) => canvas.getByLabelText('E-mail')

export const submitButton = (canvas: Canvas) =>
  canvas.getByRole('button', { name: 'Enviar link de acesso' })
