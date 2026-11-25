import type { Meta, StoryObj } from '@storybook/react-vite'
import { ForgotPassword2 } from '@tc96/ui/blocks/application/auth/forgot-password-2'
import { fn } from 'storybook/test'
import { SendingForgotPassword2 } from './forgot-password-2-layouts.tsx'

const meta = {
  args: { destination: 'ana@acme.com', onSubmit: fn() },
  component: ForgotPassword2,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ForgotPassword/ForgotPassword2/Usages',
} satisfies Meta<typeof ForgotPassword2>

export default meta

type Story = StoryObj<typeof meta>

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

export const ConfirmationAfterSending: Story = {
  render: (args) => <SendingForgotPassword2 {...args} />,
}
