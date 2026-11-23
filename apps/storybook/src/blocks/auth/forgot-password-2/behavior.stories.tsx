import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ForgotPassword2,
  type ForgotPassword2Props,
} from '@tc96/blocks/auth/forgot-password-2'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { email, emailField, submitButton } from './forgot-password-2-play.ts'

const meta = {
  args: { destination: 'ana@acme.com', onSubmit: fn() },
  component: ForgotPassword2,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/ForgotPassword/ForgotPassword2/Behavior',
} satisfies Meta<typeof ForgotPassword2>

export default meta

type Story = StoryObj<typeof meta>

function FailingForgotPassword(props: Readonly<ForgotPassword2Props>) {
  const [error, setError] = useState<string>()
  return (
    <ForgotPassword2
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('Não foi possível enviar o link. Tente novamente.')
      }}
    />
  )
}

function RejectedForgotPassword(props: Readonly<ForgotPassword2Props>) {
  const [fieldErrors, setFieldErrors] =
    useState<ForgotPassword2Props['fieldErrors']>()
  return (
    <ForgotPassword2
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
    const submit = canvas.getByRole('button', { name: /^Enviar link/ })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('data-loading')
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

export const OnlyEssentialParts: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.queryByRole('separator')).toBeNull()
    await expect(canvas.getAllByRole('button')).toHaveLength(1)
  },
}
