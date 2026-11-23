import type { Meta, StoryObj } from '@storybook/react-vite'
import { ForgotPassword2 } from '@tc96/blocks/auth/forgot-password-2'
import { expect, fn, within } from 'storybook/test'
import { SendingForgotPassword2 } from './forgot-password-2-layouts.tsx'
import {
  emailField,
  sentDescription,
  sentTitle,
} from './forgot-password-2-play.ts'

const meta = {
  args: { destination: 'ana@acme.com', onSubmit: fn() },
  component: ForgotPassword2,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/ForgotPassword/ForgotPassword2/Usages',
} satisfies Meta<typeof ForgotPassword2>

export default meta

type Story = StoryObj<typeof meta>

export const RequestResetLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Esqueceu a senha?' }),
    ).toBeVisible()
    await expect(emailField(canvas)).toBeVisible()
  },
}

export const UnknownEmail: Story = {
  args: { fieldErrors: { email: 'Este e-mail não está cadastrado.' } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Este e-mail não está cadastrado.'),
    ).toBeVisible()
  },
}

export const SendFailed: Story = {
  args: { error: 'Não foi possível enviar o link. Tente novamente.' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'Não foi possível enviar o link. Tente novamente.',
    )
  },
}

export const Sending: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: /^Enviar link/ }),
    ).toBeDisabled()
  },
}

export const LinkSent: Story = {
  args: { sent: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(canvas.getByText(sentDescription)).toBeVisible()
  },
}

export const ConfirmationAfterSending: Story = {
  render: (args) => <SendingForgotPassword2 {...args} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', {
        level: 1,
        name: 'Esqueceu a senha?',
      }),
    ).toBeVisible()
  },
}
