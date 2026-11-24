import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login1, type LoginProps } from '@tc96/blocks/application/auth/login-1'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo, authProviders } from '../fixtures/auth-data'

const meta = {
  args: {
    forgotPasswordHref: '/forgot-password',
    logo: authLogo,
    onProviderSelect: fn(),
    onSubmit: fn(),
    providers: authProviders,
    signupHref: '/signup',
  },
  component: Login1,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login1/Behavior',
} satisfies Meta<typeof Login1>

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

function FailingLogin(props: Readonly<LoginProps>) {
  const [error, setError] = useState<string>()
  return (
    <Login1
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('E-mail ou senha incorretos.')
      }}
    />
  )
}

function RejectedLogin(props: Readonly<LoginProps>) {
  const [fieldErrors, setFieldErrors] = useState<LoginProps['fieldErrors']>()
  return (
    <Login1
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
      remember: false,
    })
  },
}

export const RememberChecked: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillCredentials(canvas)
    const remember = canvas.getByRole('checkbox', { name: 'Lembrar de mim' })
    await expect(remember).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(remember)
    await expect(remember).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email,
      password,
      remember: true,
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
      remember: false,
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
    await expect(
      canvas.getByRole('button', { name: 'Continuar com Google' }),
    ).toBeDisabled()
    await userEvent.type(emailField(canvas), email)
    await userEvent.type(passwordField(canvas), `${password}{Enter}`)
    await userEvent.click(submit, { pointerEventsCheck: 0 })
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await expect(args.onProviderSelect).not.toHaveBeenCalled()
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
  render: (args) => <RejectedLogin {...args} />,
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
  render: (args) => <FailingLogin {...args} />,
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

export const LinksThroughRenderLink: Story = {
  args: { renderLink: fn(renderAnchor) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Esqueceu a senha?' }),
    ).toHaveAttribute('href', '/forgot-password')
    await expect(
      canvas.getByRole('link', { name: 'Criar conta' }),
    ).toHaveAttribute('href', '/signup')
    await expect(args.renderLink).toHaveBeenCalledWith('/forgot-password')
    await expect(args.renderLink).toHaveBeenCalledWith('/signup')
  },
}

export const LinksOnlyWithHref: Story = {
  args: {
    forgotPasswordHref: undefined,
    renderLink: fn(renderAnchor),
    signupHref: undefined,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.queryByText('Esqueceu a senha?')).toBeNull()
    await expect(canvas.queryByText('Não tem uma conta?')).toBeNull()
    await expect(args.renderLink).not.toHaveBeenCalled()
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

export const ProviderSelected: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Entrar com outro serviço' }),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Continuar com GitHub' }),
    )
    await expect(args.onProviderSelect).toHaveBeenCalledOnce()
    await expect(args.onProviderSelect).toHaveBeenCalledWith('github')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const PageFrame: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    const logo = canvas.getByText('Acme')
    const card = canvasElement.querySelector('[data-slot="card"]')
    await expect(card).not.toBeNull()
    await expect(card).toContainElement(logo)
    await expect(
      logo.compareDocumentPosition(canvas.getByRole('heading', { level: 1 })) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(canvas.getByRole('main')).toContainElement(logo)
  },
}

export const ProvidersSitAboveTheForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const providers = canvas.getByRole('group', {
      name: 'Entrar com outro serviço',
    })
    await expect(
      providers.compareDocumentPosition(emailField(canvas)) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(
      canvas.getByRole('button', { name: 'Continuar com Google' }),
    ).toHaveTextContent('Google')
  },
}
