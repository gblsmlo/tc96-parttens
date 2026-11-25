import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ForgotPassword1,
  type ForgotPasswordProps,
} from '@tc96/ui/blocks/application/auth/forgot-password-1'
import { useEffect, useState } from 'react'
import { fn } from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'
import { SendingForgotPassword } from './forgot-password-1-layouts.tsx'

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

export const RequestResetLink: Story = {}

export const UnknownEmail: Story = {
  args: { fieldErrors: { email: 'Este e-mail não está cadastrado.' } },
}

export const SendFailed: Story = {
  args: { error: 'Não foi possível enviar o link. Tente novamente.' },
}

export const Sending: Story = {
  args: { pending: true },
}

export const LinkSent: Story = {
  args: { sent: true },
}

export const ResendWaiting: Story = {
  args: { resendIn: 30, sent: true },
}

export const ResendFailed: Story = {
  args: {
    error: 'Não foi possível reenviar o e-mail. Tente novamente.',
    sent: true,
  },
}

export const ConfirmationAfterSending: Story = {
  render: (args) => <SendingForgotPassword {...args} />,
}

export const ResendCountedByTheClock: Story = {
  render: (args) => <ResendCountedByTheClockPage {...args} />,
}
