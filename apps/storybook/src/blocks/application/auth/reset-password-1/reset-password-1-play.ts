import { userEvent, within } from 'storybook/test'

export type Canvas = ReturnType<typeof within>

export const password = 'segredo123'

export const passwordField = (canvas: Canvas) =>
  canvas.getByLabelText('Nova senha')

export const confirmField = (canvas: Canvas) =>
  canvas.getByLabelText('Confirmar senha')

export const submitButton = (canvas: Canvas) =>
  canvas.getByRole('button', { name: 'Redefinir senha' })

export const feedback = (canvasElement: HTMLElement) =>
  within(
    canvasElement.querySelector<HTMLElement>(
      '[data-slot="field-description"]',
    ) as HTMLElement,
  )

export const announcement = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[aria-live="polite"]')

export async function fillPasswords(canvas: Canvas, confirmation = password) {
  await userEvent.type(passwordField(canvas), password)
  await userEvent.type(confirmField(canvas), confirmation)
}
