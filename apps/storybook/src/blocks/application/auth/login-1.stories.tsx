import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login1, type LoginProps } from '@tc96/blocks/application/auth/login-1'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { authLogo, authProviders } from './fixtures/auth-data'

const usage = `
// npx @tc96/parttens add login-1
import { Login1 } from '@acme/blocks/application/auth/login-1'
import { Link } from '@tanstack/react-router'

<Login1
  error={error}
  fieldErrors={fieldErrors}
  forgotPasswordHref="/forgot-password"
  logo={<Logo />}
  onProviderSelect={(id) => signInWith(id)}
  onSubmit={({ email, password, remember }) => signIn(email, password, remember)}
  pending={isSigningIn}
  providers={[{ id: 'google', label: 'Google', icon: <GoogleIcon /> }]}
  renderLink={(href) => <Link to={href} />}
  signupHref="/signup"
/>
`

const docs = {
  api: [
    {
      description:
        'Root component. The whole page: a `main` landmark that centers its content in the window height, the optional `logo` above a COSS `Card`, and inside it the title (an `h1`), the description, the form message, the form, the optional providers and the footer. Mount it on the route and do not wrap it in another `main`. Authentication, session, cookies and redirects stay in the app: the block only calls `onSubmit` and `onProviderSelect`.',
      name: 'Login1',
    },
    {
      description:
        '`(values: LoginValues) => void`, with `email`, `password` and `remember` (`false` while the box is unchecked). It runs only after the native constraints pass (`required` and `type="email"`) and never while `pending`. The return value is ignored. The fields are uncontrolled: the values stay in the form after an error.',
      name: 'onSubmit',
    },
    {
      description:
        '`boolean`. Disables the submit button and shows `labels.submitPending`, sets `aria-busy` on the form and disables the provider buttons. `onSubmit` and `onProviderSelect` are not called while it is true, Enter included. The app owns this state.',
      name: 'pending',
    },
    {
      description:
        '`string`. A message for the whole form, shown in a COSS `Alert` with `role="alert"` and the title `labels.errorTitle`. When it goes from empty to filled and no field is invalid, focus moves to the alert. The text is rendered as text, never as HTML.',
      name: 'error',
    },
    {
      description:
        '`Partial<Record<keyof LoginValues, string>>`. A message per field, shown in `FieldError` and tied to the field with `aria-invalid`. When it goes from empty to filled, focus moves to the first invalid field. A message clears when the user edits its field.',
      name: 'fieldErrors',
    },
    {
      description:
        '`AuthProvider[]`: `id`, `label` and an optional `icon`. Each one is an outline button named by `labels.providerContinue(label)` below a separator; `onProviderSelect(id)` receives the `id`. Empty or missing renders neither the buttons nor the separator.',
      name: 'providers',
    },
    {
      description:
        '`forgotPasswordHref` and `signupHref`. A link renders only when its `href` is passed, through `renderLink(href)`; without `signupHref` the footer is not rendered either.',
      name: 'forgotPasswordHref',
    },
    {
      description:
        '`(href) => ReactElement`. Every link renders through it, so the router of the app owns navigation; the default is a plain `a` (`renderAnchor` from `@tc96/ui/render-anchor`). The element receives the class names and the text through the Base UI `render` prop.',
      name: 'renderLink',
    },
    {
      description:
        '`ReactNode`. Rendered above the card, outside it, centered. Nothing is rendered in its place when it is missing.',
      name: 'logo',
    },
    {
      description:
        'Partial `LoginLabels`. Every visible or accessible text the block owns, with pt-BR defaults, including the show and hide password texts. The messages of the native constraints (`required`, `type="email"`) are the browser\'s own.',
      name: 'labels',
    },
  ],
  description: {
    component:
      'A sign-in page: e-mail, password with a show and hide button, a remember me box, a forgot password link, optional providers and a sign up link, inside a centered card. Install it with `npx @tc96/parttens add login-1`.',
  },
  story: { height: '48rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

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
  parameters: { docs, layout: 'fullscreen' },
  title: 'Blocks/Application/Auth/Login1',
} satisfies Meta<typeof Login1>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!autodocs']

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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Entrar' }),
    ).toBeVisible()
    await expect(emailField(canvas)).toHaveAttribute('autocomplete', 'username')
    await expect(passwordField(canvas)).toHaveAttribute(
      'autocomplete',
      'current-password',
    )
    await expect(
      canvas.getByRole('checkbox', { name: 'Lembrar de mim' }),
    ).toHaveAttribute('aria-checked', 'false')
  },
}

export const Minimal: Story = {
  args: {
    forgotPasswordHref: undefined,
    logo: undefined,
    providers: undefined,
    signupHref: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Only the required prop: no logo, providers or links. The card keeps the title, the fields and the submit button.',
      },
    },
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
  tags: interaction,
}

export const RememberChecked: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillCredentials(canvas)
    const remember = canvas.getByRole('checkbox', { name: 'Lembrar de mim' })
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
  tags: interaction,
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
  tags: interaction,
}

export const Pending: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Entrando…' })
    await expect(submit).toBeDisabled()
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
  tags: interaction,
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
  tags: interaction,
}

export const FieldErrors: Story = {
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
  tags: interaction,
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
  tags: interaction,
}

export const ErrorMessage: Story = {
  args: { error: 'E-mail ou senha incorretos.' },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveTextContent('Não foi possível continuar')
    await expect(alert).toHaveTextContent('E-mail ou senha incorretos.')
  },
  tags: interaction,
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
  tags: interaction,
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
  tags: interaction,
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
  tags: interaction,
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
  tags: interaction,
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
  tags: interaction,
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
  tags: interaction,
}
