import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Login4,
  type Login4Props,
} from '@tc96/ui/blocks/application/auth/login-4'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { SendingLogin4 } from './login-4-layouts.tsx'
import {
  email,
  emailField,
  resendButton,
  sentTitle,
  submitButton,
} from './login-4-play.ts'

const meta = {
  args: { onSubmit: fn() },
  component: Login4,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login4/Behavior',
} satisfies Meta<typeof Login4>

export default meta

type Story = StoryObj<typeof meta>

function FailingLogin4(props: Readonly<Login4Props>) {
  const [error, setError] = useState<string>()
  return (
    <Login4
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('Não foi possível enviar o link.')
      }}
    />
  )
}

function RejectedLogin4(props: Readonly<Login4Props>) {
  const [fieldErrors, setFieldErrors] = useState<Login4Props['fieldErrors']>()
  return (
    <Login4
      {...props}
      fieldErrors={fieldErrors}
      onSubmit={(values) => {
        props.onSubmit(values)
        setFieldErrors({ email: 'Este e-mail não está cadastrado.' })
      }}
    />
  )
}

export const PageHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Entrar com link' }),
    ).toBeVisible()
  },
}

export const OnlyEmailField: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(emailField(canvas)).toHaveAttribute('autocomplete', 'email')
    await expect(canvas.getAllByRole('textbox')).toHaveLength(1)
    await expect(canvas.queryByLabelText('Senha')).toBeNull()
  },
}

export const LabelsOverrideDefaults: Story = {
  args: { labels: { submit: 'Receber link', title: 'Acessar sem senha' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Acessar sem senha' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Receber link' }),
    ).toBeVisible()
  },
}

export const SubmitSendsEmail: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(emailField(canvas), email)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ email })
  },
}

export const EnterSubmits: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(emailField(canvas), `${email}{Enter}`)
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
  },
}

export const PendingBlocksActions: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: /^Enviar link/ })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('data-loading')
    await expect(
      canvasElement.querySelector('[data-slot="form"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await userEvent.type(emailField(canvas), `${email}{Enter}`)
    await userEvent.click(submit, { pointerEventsCheck: 0 })
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const NativeConstraintsBlockSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const FieldErrorFocusesEmail: Story = {
  render: (args) => <RejectedLogin4 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(emailField(canvas), email)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAccessibleDescription(
      'Este e-mail não está cadastrado.',
    )
  },
}

export const ErrorFocusesAlert: Story = {
  render: (args) => <FailingLogin4 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(emailField(canvas), email)
    await userEvent.click(submitButton(canvas))
    const alert = await canvas.findByRole('alert')
    await waitFor(() => expect(alert).toHaveFocus())
    await expect(alert).toHaveTextContent('Não foi possível enviar o link.')
  },
}

export const SentShowsConfirmation: Story = {
  args: { destination: email, sent: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(
      canvas.getByText(`Enviamos um link para entrar para ${email}.`),
    ).toBeVisible()
    await expect(canvas.queryByLabelText('E-mail')).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Enviar link' }),
    ).toBeNull()
  },
}

export const SentWithoutDestinationIsGeneric: Story = {
  args: { sent: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Enviamos um link para entrar para o seu e-mail.',
      ),
    ).toBeVisible()
  },
}

export const SentFocusesTitleOnChange: Story = {
  render: (args) => <SendingLogin4 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(emailField(canvas), email)
    await userEvent.click(submitButton(canvas))
    const title = await canvas.findByRole('heading', {
      level: 1,
      name: 'Verifique seu e-mail',
    })
    await waitFor(() => expect(title).toHaveFocus())
  },
}

export const SentOnMountDoesNotFocusTitle: Story = {
  args: { sent: true },
  play: async ({ canvasElement }) => {
    await expect(sentTitle(within(canvasElement))).not.toHaveFocus()
  },
}

export const ResendOnlyWithCallback: Story = {
  args: { sent: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: /Reenviar/ }),
    ).toBeNull()
  },
}

export const ResendCallsBack: Story = {
  args: { onResend: fn(), sent: true },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(resendButton(within(canvasElement)))
    await expect(args.onResend).toHaveBeenCalledOnce()
  },
}

export const ResendCountdownDisablesButton: Story = {
  args: { onResend: fn(), resendIn: 30, sent: true },
  play: async ({ args, canvasElement }) => {
    const button = resendButton(within(canvasElement), 'Reenviar em 30s')
    await expect(button).toBeDisabled()
    await userEvent.click(button, { pointerEventsCheck: 0 })
    await expect(args.onResend).not.toHaveBeenCalled()
  },
}

export const ResendBlockedWhilePending: Story = {
  args: { onResend: fn(), pending: true, sent: true },
  play: async ({ args, canvasElement }) => {
    const button = resendButton(within(canvasElement))
    await expect(button).toBeDisabled()
    await userEvent.click(button, { pointerEventsCheck: 0 })
    await expect(args.onResend).not.toHaveBeenCalled()
  },
}

export const PasswordLinkOnlyWithHref: Story = {
  args: { passwordLoginHref: '/login' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Entrar com senha' }),
    ).toHaveAttribute('href', '/login')
  },
}

export const NoLinkWithoutHref: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('link')).toBeNull()
  },
}
