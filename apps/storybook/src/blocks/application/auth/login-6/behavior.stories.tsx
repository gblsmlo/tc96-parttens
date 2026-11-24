import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Login6,
  type Login6Props,
} from '@tc96/ui/blocks/application/auth/login-6'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo, authProviders } from '../fixtures/auth-data'
import { gradientMedia } from './login-6-layouts.tsx'

const meta = {
  args: { onSubmit: fn() },
  component: Login6,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login6/Behavior',
} satisfies Meta<typeof Login6>

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

function FailingLogin6(props: Readonly<Login6Props>) {
  const [error, setError] = useState<string>()
  return (
    <Login6
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('E-mail ou senha incorretos.')
      }}
    />
  )
}

function RejectedLogin6(props: Readonly<Login6Props>) {
  const [fieldErrors, setFieldErrors] = useState<Login6Props['fieldErrors']>()
  return (
    <Login6
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
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Entrar' }),
    ).toBeVisible()
  },
}

export const MediaSlot: Story = {
  args: { media: gradientMedia },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const media = canvas.getByRole('complementary', {
      name: 'Apresentação do produto',
    })
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(canvas.getByRole('main')).not.toContainElement(media)
    await expect(media.className).toContain('hidden')
    await expect(media.className).toContain('md:flex')
  },
}

export const WithoutMediaHasNoLandmark: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('complementary')).toBeNull()
  },
}

export const LogoOutsideForm: Story = {
  args: { logo: authLogo },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const logo = canvas.getByText('Acme')
    await expect(canvasElement.querySelector('form')).not.toContainElement(logo)
  },
}

export const ProvidersBelowForm: Story = {
  args: { providers: authProviders },
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('form')
    const group = within(canvasElement).getByRole('group', {
      name: 'Entrar com outro serviço',
    })
    await expect(form?.compareDocumentPosition(group) ?? 0).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    await expect(group.className).toContain('grid-cols-2')
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
  render: (args) => <RejectedLogin6 {...args} />,
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
  render: (args) => <FailingLogin6 {...args} />,
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(passwordField(canvas), password)
    await expect(passwordField(canvas)).toHaveAttribute('type', 'password')
    await userEvent.click(canvas.getByRole('button', { name: 'Mostrar senha' }))
    await expect(passwordField(canvas)).toHaveAttribute('type', 'text')
    await expect(passwordField(canvas)).toHaveValue(password)
    await userEvent.click(canvas.getByRole('button', { name: 'Ocultar senha' }))
    await expect(passwordField(canvas)).toHaveAttribute('type', 'password')
  },
}

export const LinksOnlyWithHref: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('link')).toBeNull()
  },
}

export const LinksRenderWithHref: Story = {
  args: { forgotPasswordHref: '/forgot', signupHref: '/signup' },
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

export const ProvidersCallBack: Story = {
  args: {
    onProviderSelect: fn(),
    providers: [{ id: 'google', label: 'Google' }],
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Continuar com Google',
      }),
    )
    await expect(args.onProviderSelect).toHaveBeenCalledWith('google')
  },
}
