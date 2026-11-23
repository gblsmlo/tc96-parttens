import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ForgotPassword1,
  type ForgotPasswordProps,
} from '@tc96/blocks/auth/forgot-password-1'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'
import { email, emailField, submitButton } from './forgot-password-1-play.ts'

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
  title: 'Blocks/Auth/ForgotPassword1/Behavior',
} satisfies Meta<typeof ForgotPassword1>

export default meta

type Story = StoryObj<typeof meta>

function FailingForgotPassword(props: Readonly<ForgotPasswordProps>) {
  const [error, setError] = useState<string>()
  return (
    <ForgotPassword1
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('Não foi possível enviar o link. Tente novamente.')
      }}
    />
  )
}

function RejectedForgotPassword(props: Readonly<ForgotPasswordProps>) {
  const [fieldErrors, setFieldErrors] =
    useState<ForgotPasswordProps['fieldErrors']>()
  return (
    <ForgotPassword1
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
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Esqueceu a senha?' }),
    ).toBeVisible()
    await expect(
      canvas.getByText(
        'Informe seu e-mail e enviaremos um link para redefinir a senha.',
      ),
    ).toBeVisible()
  },
}

export const FieldIsARequiredEmail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(emailField(canvas)).toHaveAttribute('type', 'email')
    await expect(emailField(canvas)).toHaveAttribute('autocomplete', 'email')
    await expect(emailField(canvas)).toBeRequired()
    await expect(submitButton(canvas)).toHaveAttribute('type', 'submit')
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
    await expect(args.onSubmit).toHaveBeenCalledWith({ email })
  },
}

export const PendingBlocksSubmit: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Enviando…' })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('type', 'submit')
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
    await userEvent.type(emailField(canvas), 'ana')
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const FieldErrorsMarkTheField: Story = {
  args: { fieldErrors: { email: 'Este e-mail não está cadastrado.' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(
      canvas.getByText('Este e-mail não está cadastrado.'),
    ).toBeVisible()
    await expect(emailField(canvas)).toHaveAccessibleDescription(
      'Este e-mail não está cadastrado.',
    )
  },
}

export const FieldErrorsFocusFirstInvalid: Story = {
  render: (args) => <RejectedForgotPassword {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(emailField(canvas), email)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(emailField(canvas)).toHaveAccessibleDescription(
      'Este e-mail não está cadastrado.',
    )
  },
}

export const ErrorShowsAlert: Story = {
  args: { error: 'Não foi possível enviar o link. Tente novamente.' },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveTextContent('Não foi possível continuar')
    await expect(alert).toHaveTextContent(
      'Não foi possível enviar o link. Tente novamente.',
    )
  },
}

export const ErrorFocusesAlert: Story = {
  render: (args) => <FailingForgotPassword {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('alert')).toBeNull()
    await userEvent.type(emailField(canvas), email)
    await userEvent.click(submitButton(canvas))
    const alert = await canvas.findByRole('alert')
    await waitFor(() => expect(alert).toHaveFocus())
    await expect(alert).toHaveTextContent(
      'Não foi possível enviar o link. Tente novamente.',
    )
  },
}

export const BackToLoginInTheForm: Story = {
  args: { renderLink: fn(renderAnchor) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Voltar para entrar' }),
    ).toHaveAttribute('href', '/login')
    await expect(args.renderLink).toHaveBeenCalledWith('/login')
  },
}

export const BackToLoginOnlyWithHref: Story = {
  args: { loginHref: undefined, renderLink: fn(renderAnchor) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Esqueceu a senha?' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.queryByText('Voltar para entrar')).toBeNull()
    await expect(args.renderLink).not.toHaveBeenCalled()
  },
}

export const PageFrame: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    const logo = canvas.getByText('Acme')
    const card = canvasElement.querySelector('[data-slot="card"]')
    await expect(card).not.toBeNull()
    await expect(card?.contains(logo)).toBe(false)
    await expect(
      logo.compareDocumentPosition(card as Element) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(canvas.getByRole('main')).toContainElement(logo)
  },
}
