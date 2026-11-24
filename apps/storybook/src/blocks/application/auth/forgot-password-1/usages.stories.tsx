import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ForgotPassword1,
  type ForgotPasswordProps,
} from '@tc96/blocks/application/auth/forgot-password-1'
import { useEffect, useState } from 'react'
import { expect, fn, within } from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'
import { SendingForgotPassword } from './forgot-password-1-layouts.tsx'
import {
  emailField,
  resendButton,
  sentDescription,
  sentTitle,
} from './forgot-password-1-play.ts'

const meta = {
  args: {
    destination: 'ana@acme.com',
    loginHref: '/login',
    logo: authLogo,
    onResend: fn(),
    onSubmit: fn(),
  },
  component: ForgotPassword1,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ForgotPassword/ForgotPassword1/Usages',
} satisfies Meta<typeof ForgotPassword1>

export default meta

type Story = StoryObj<typeof meta>

function useSecondsLeft(seconds: number) {
  const [deadline] = useState(() => Date.now() + seconds * 1000)
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return Math.max(0, Math.ceil((deadline - now) / 1000))
}

function ResendCountedByTheClockPage(props: Readonly<ForgotPasswordProps>) {
  const resendIn = useSecondsLeft(30)
  return <ForgotPassword1 {...props} resendIn={resendIn} sent />
}

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

export const ResendWaiting: Story = {
  args: { resendIn: 30, sent: true },
  play: async ({ canvasElement }) => {
    await expect(
      resendButton(within(canvasElement), 'Reenviar em 30s'),
    ).toBeDisabled()
  },
}

export const ResendFailed: Story = {
  args: {
    error: 'Não foi possível reenviar o e-mail. Tente novamente.',
    sent: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Não foi possível reenviar o e-mail. Tente novamente.',
    )
  },
}

export const ConfirmationAfterSending: Story = {
  render: (args) => <SendingForgotPassword {...args} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', {
        level: 1,
        name: 'Esqueceu a senha?',
      }),
    ).toBeVisible()
  },
}

export const ResendCountedByTheClock: Story = {
  render: (args) => <ResendCountedByTheClockPage {...args} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: /^Reenviar em \d+s$/,
      }),
    ).toBeDisabled()
  },
}
