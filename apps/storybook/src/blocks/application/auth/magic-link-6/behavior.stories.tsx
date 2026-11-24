import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  MagicLink6,
  type MagicLink6Props,
} from '@tc96/ui/blocks/application/auth/magic-link-6'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authProviders } from '../fixtures/auth-data'

const meta = {
  args: { onSubmit: fn() },
  component: MagicLink6,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/MagicLink/MagicLink6/Behavior',
} satisfies Meta<typeof MagicLink6>

export default meta

type Story = StoryObj<typeof meta>

function SendingMagicLink6(props: Readonly<MagicLink6Props>) {
  const [destination, setDestination] = useState<string>()
  return (
    <MagicLink6
      {...props}
      destination={destination}
      onReset={() => setDestination(undefined)}
      onSubmit={(values) => {
        props.onSubmit(values)
        setDestination(values.email)
      }}
      sent={Boolean(destination)}
    />
  )
}

export const SubmitSendsEmail: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'E-mail' }),
      'ana@acme.com{Enter}',
    )
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ email: 'ana@acme.com' })
  },
}

export const SentFocusesTitle: Story = {
  render: (args) => <SendingMagicLink6 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'E-mail' }),
      'ana@acme.com{Enter}',
    )
    const title = await canvas.findByRole('heading', {
      level: 1,
      name: 'Verifique seu e-mail',
    })
    await waitFor(() => expect(title).toHaveFocus())
    await expect(
      canvas.getByText('Enviamos um link de acesso para ana@acme.com.'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Usar outro e-mail' }),
    )
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Entrar com link' }),
    ).toBeVisible()
  },
}

export const ResendCountdown: Story = {
  args: { onResend: fn(), resendIn: 30, sent: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Reenviar em 30s' }),
    ).toBeDisabled()
  },
}

export const ProvidersAndSignupLink: Story = {
  args: {
    onProviderSelect: fn(),
    signupHref: '/signup',
    providers: authProviders,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Criar conta' }),
    ).toHaveAttribute('href', '/signup')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Continuar com Google' }),
    )
    await expect(args.onProviderSelect).toHaveBeenCalledWith('google')
  },
}

export const HiddenProviders: Story = {
  args: { providers: authProviders, showProviders: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('group', { name: 'Entrar com outro serviço' }),
    ).toBeNull()
    await expect(canvas.queryByText('ou continue com')).toBeNull()
  },
}
