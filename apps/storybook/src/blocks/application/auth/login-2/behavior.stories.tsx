import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login2, type Login2Props } from '@tc96/blocks/application/auth/login-2'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const meta = {
  args: { onSubmit: fn() },
  component: Login2,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login2/Behavior',
} satisfies Meta<typeof Login2>

export default meta

type Story = StoryObj<typeof meta>

const email = 'ana@acme.com'
const password = 'segredo123'

type Canvas = ReturnType<typeof within>

const emailField = (canvas: Canvas) =>
  canvas.getByRole('textbox', { name: 'E-mail' })

const passwordField = (canvas: Canvas) => canvas.getByLabelText('Senha')

const submitButton = (canvas: Canvas) =>
  canvas.getByRole('button', { name: 'Entrar' })

async function fillCredentials(canvas: Canvas) {
  await userEvent.type(emailField(canvas), email)
  await userEvent.type(passwordField(canvas), password)
}

function FailingLogin2(props: Readonly<Login2Props>) {
  const [error, setError] = useState<string>()
  return (
    <Login2
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('E-mail ou senha incorretos.')
      }}
    />
  )
}

function RejectedLogin2(props: Readonly<Login2Props>) {
  const [fieldErrors, setFieldErrors] = useState<Login2Props['fieldErrors']>()
  return (
    <Login2
      {...props}
      fieldErrors={fieldErrors}
      onSubmit={(values) => {
        props.onSubmit(values)
        setFieldErrors({
          email: 'Este e-mail não está cadastrado.',
          password: 'A senha está incorreta.',
        })
      }}
    />
  )
}

export const PageHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Entrar' }),
    ).toBeVisible()
  },
}

export const FieldsAutocomplete: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(emailField(canvas)).toHaveAttribute('autocomplete', 'username')
    await expect(passwordField(canvas)).toHaveAttribute(
      'autocomplete',
      'current-password',
    )
  },
}

export const LabelsOverrideDefaults: Story = {
  args: { labels: { submit: 'Acessar', title: 'Acessar a conta' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Acessar a conta' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Acessar' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Entrar' })).toBeNull()
  },
}

export const SubmitSendsValues: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillCredentials(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email,
      password,
    })
  },
}

export const EnterSubmits: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(emailField(canvas), email)
    await userEvent.type(passwordField(canvas), `${password}{Enter}`)
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email,
      password,
    })
  },
}

export const PendingBlocksActions: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: /^Entrar/ })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('data-loading')
    await expect(submit).toHaveAttribute('type', 'submit')
    await expect(
      canvasElement.querySelector('[data-slot="form"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await userEvent.type(emailField(canvas), email)
    await userEvent.type(passwordField(canvas), `${password}{Enter}`)
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
    await userEvent.clear(emailField(canvas))
    await userEvent.type(emailField(canvas), 'ana')
    await userEvent.type(passwordField(canvas), password)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const FieldErrorsMarkFields: Story = {
  args: {
    fieldErrors: {
      email: 'Este e-mail não está cadastrado.',
      password: 'A senha está incorreta.',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(
      canvas.getByText('Este e-mail não está cadastrado.'),
    ).toBeVisible()
    await expect(passwordField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByText('A senha está incorreta.')).toBeVisible()
  },
}

export const FieldErrorsFocusFirstInvalid: Story = {
  render: (args) => <RejectedLogin2 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillCredentials(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(emailField(canvas)).toHaveAccessibleDescription(
      'Este e-mail não está cadastrado.',
    )
    await expect(passwordField(canvas)).toHaveAttribute('aria-invalid', 'true')
  },
}

export const ErrorShowsAlert: Story = {
  args: { error: 'E-mail ou senha incorretos.' },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveTextContent('Não foi possível continuar')
    await expect(alert).toHaveTextContent('E-mail ou senha incorretos.')
  },
}

export const ErrorFocusesAlert: Story = {
  render: (args) => <FailingLogin2 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('alert')).toBeNull()
    await fillCredentials(canvas)
    await userEvent.click(submitButton(canvas))
    const alert = await canvas.findByRole('alert')
    await waitFor(() => expect(alert).toHaveFocus())
    await expect(alert).toHaveTextContent('E-mail ou senha incorretos.')
  },
}

export const TogglePasswordVisibility: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(passwordField(canvas), password)
    await expect(passwordField(canvas)).toHaveAttribute('type', 'password')
    await userEvent.click(canvas.getByRole('button', { name: 'Mostrar senha' }))
    await expect(passwordField(canvas)).toHaveAttribute('type', 'text')
    await expect(passwordField(canvas)).toHaveValue(password)
    await userEvent.click(canvas.getByRole('button', { name: 'Ocultar senha' }))
    await expect(passwordField(canvas)).toHaveAttribute('type', 'password')
    await expect(
      canvas.getByRole('button', { name: 'Mostrar senha' }),
    ).toBeVisible()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const OnlyEssentialParts: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(canvas.queryByRole('checkbox')).toBeNull()
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.queryByRole('separator')).toBeNull()
  },
}
