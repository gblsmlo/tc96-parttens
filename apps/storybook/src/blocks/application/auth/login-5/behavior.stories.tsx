import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login5, type Login5Props } from '@tc96/blocks/application/auth/login-5'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { loginMethods, PickingLogin5 } from './login-5-layouts.tsx'

const meta = {
  args: {
    methods: loginMethods,
    onMethod: fn(),
    onMethodChange: fn(),
    onSubmit: fn(),
  },
  component: Login5,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login5/Behavior',
} satisfies Meta<typeof Login5>

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

function FailingLogin5(props: Readonly<Login5Props>) {
  const [error, setError] = useState<string>()
  return (
    <Login5
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('E-mail ou senha incorretos.')
      }}
    />
  )
}

function RejectedLogin5(props: Readonly<Login5Props>) {
  const [fieldErrors, setFieldErrors] = useState<Login5Props['fieldErrors']>()
  return (
    <Login5
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
      canvas.getByRole('heading', { level: 1, name: 'Entrar' }),
    ).toBeVisible()
  },
}

export const MethodsRenderAsButtons: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Formas de entrar' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Entrar com chave de acesso' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Entrar com SSO' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'E-mail e senha' }),
    ).toBeVisible()
    await expect(canvas.queryByLabelText('E-mail')).toBeNull()
  },
}

export const MethodCallsBack: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Entrar com SSO' }),
    )
    await expect(args.onMethod).toHaveBeenCalledWith('sso')
    await expect(args.onMethodChange).not.toHaveBeenCalled()
  },
}

export const EmailMethodRequestsChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'E-mail e senha' }),
    )
    await expect(args.onMethodChange).toHaveBeenCalledWith('email')
    await expect(args.onMethod).not.toHaveBeenCalled()
  },
}

export const MethodIsControlled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'E-mail e senha' }),
    )
    await expect(canvas.queryByLabelText('E-mail')).toBeNull()
  },
}

export const EmailMethodRevealsForm: Story = {
  render: (args) => <PickingLogin5 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'E-mail e senha' }),
    )
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Entrar com e-mail' }),
    ).toBeVisible()
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAttribute('autocomplete', 'username')
    await expect(passwordField(canvas)).toHaveAttribute(
      'autocomplete',
      'current-password',
    )
    await expect(
      canvas.queryByRole('group', { name: 'Formas de entrar' }),
    ).toBeNull()
  },
}

export const BackReturnsToMethods: Story = {
  args: { method: 'email' },
  render: (args) => <PickingLogin5 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Outras formas de entrar' }),
    )
    const emailMethod = canvas.getByRole('button', { name: 'E-mail e senha' })
    await waitFor(() => expect(emailMethod).toHaveFocus())
    await expect(canvas.queryByLabelText('E-mail')).toBeNull()
  },
}

export const LabelsOverrideDefaults: Story = {
  args: { labels: { emailMethod: 'Senha', title: 'Acessar a conta' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Acessar a conta' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Senha' })).toBeVisible()
  },
}

export const SubmitSendsValues: Story = {
  args: { method: 'email' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillCredentials(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ email, password })
  },
}

export const EnterSubmits: Story = {
  args: { method: 'email' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(emailField(canvas), email)
    await userEvent.type(passwordField(canvas), `${password}{Enter}`)
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
  },
}

export const PendingBlocksActions: Story = {
  args: { method: 'email', pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: /^Entrar/ })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('data-loading')
    await expect(
      canvasElement.querySelector('[data-slot="form"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await userEvent.type(emailField(canvas), email)
    await userEvent.type(passwordField(canvas), `${password}{Enter}`)
    await userEvent.click(submit, { pointerEventsCheck: 0 })
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const PendingBlocksMethods: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const sso = canvas.getByRole('button', { name: 'Entrar com SSO' })
    await expect(sso).toBeDisabled()
    await userEvent.click(sso, { pointerEventsCheck: 0 })
    await expect(args.onMethod).not.toHaveBeenCalled()
    await expect(
      canvas.getByRole('button', { name: 'E-mail e senha' }),
    ).toBeDisabled()
  },
}

export const NativeConstraintsBlockSubmit: Story = {
  args: { method: 'email' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const FieldErrorsFocusFirstInvalid: Story = {
  args: { method: 'email' },
  render: (args) => <RejectedLogin5 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillCredentials(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAccessibleDescription(
      'Este e-mail não está cadastrado.',
    )
  },
}

export const ErrorFocusesAlert: Story = {
  args: { method: 'email' },
  render: (args) => <FailingLogin5 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillCredentials(canvas)
    await userEvent.click(submitButton(canvas))
    const alert = await canvas.findByRole('alert')
    await waitFor(() => expect(alert).toHaveFocus())
    await expect(alert).toHaveTextContent('E-mail ou senha incorretos.')
  },
}

export const TogglePasswordVisibility: Story = {
  args: { method: 'email' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(passwordField(canvas), password)
    await userEvent.click(canvas.getByRole('button', { name: 'Mostrar senha' }))
    await expect(passwordField(canvas)).toHaveAttribute('type', 'text')
    await userEvent.click(canvas.getByRole('button', { name: 'Ocultar senha' }))
    await expect(passwordField(canvas)).toHaveAttribute('type', 'password')
  },
}

export const LinksOnlyWithHref: Story = {
  args: {
    forgotPasswordHref: '/forgot',
    method: 'email',
    signupHref: '/signup',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Esqueceu a senha?' }),
    ).toHaveAttribute('href', '/forgot')
    await expect(
      canvas.getByRole('link', { name: 'Criar conta' }),
    ).toHaveAttribute('href', '/signup')
  },
}

export const NoLinksWithoutHref: Story = {
  args: { method: 'email' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('link')).toBeNull()
  },
}
