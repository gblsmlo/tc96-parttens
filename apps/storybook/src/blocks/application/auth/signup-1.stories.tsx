import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Signup1,
  type SignupProps,
} from '@tc96/blocks/application/auth/signup-1'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { authLogo, authProviders } from './fixtures/auth-data'

const usage = `
// npx @tc96/parttens add signup-1
import { Signup1 } from '@acme/blocks/application/auth/signup-1'
import { Link } from '@tanstack/react-router'

<Signup1
  error={error}
  fieldErrors={fieldErrors}
  loginHref="/login"
  logo={<Logo />}
  onProviderSelect={(id) => signUpWith(id)}
  onSubmit={({ name, email, password }) => signUp(name, email, password)}
  passwordMinLength={8}
  pending={isSigningUp}
  privacyHref="/privacy"
  providers={[{ id: 'google', label: 'Google', icon: <GoogleIcon /> }]}
  renderLink={(href) => <Link to={href} />}
  termsHref="/terms"
/>
`

const docs = {
  api: [
    {
      description:
        'Root component. The whole page: a `main` landmark that centers its content in the window height, the optional `logo` above a COSS `Card`, and inside it the title (an `h1`), the description, the form message, the form, the optional providers, the terms notice and the footer. Mount it on the route and do not wrap it in another `main`. Account creation, session, cookies and redirects stay in the app: the block only calls `onSubmit` and `onProviderSelect`.',
      name: 'Signup1',
    },
    {
      description:
        '`(values: SignupValues) => void`, with `name`, `email` and `password`. The password confirmation and the terms notice add nothing to the values. It runs only after the native constraints pass (`required`, `type="email"` and `minLength`), only when the password and the confirmation match, and never while `pending`. The return value is ignored. The fields are uncontrolled: the values stay in the form after an error.',
      name: 'onSubmit',
    },
    {
      description:
        'The confirmation field. On submit, after the native constraints, the block checks that both passwords are equal. When they differ it shows `labels.passwordMismatch` in the confirmation field, marks it `aria-invalid`, moves focus to it and does not call `onSubmit`. The message clears when either password field is edited. The confirmation is not a key of `SignupValues`, so `fieldErrors` cannot target it.',
      name: 'confirmPassword',
    },
    {
      description:
        '`number`, default `8`. The minimum password length: it is the native `minLength` constraint and the `n of N characters` feedback under the password field. Only this blocks the submit.',
      name: 'passwordMinLength',
    },
    {
      description:
        '`AuthPasswordSuggestion[]`, default `lowercase`, `uppercase`, `number` and `symbol`. The character types the feedback suggests, each shown with its state in text (`labels.suggestionMet` or `labels.suggestionMissing`). They are advice and never block the submit; an empty list hides them. The feedback is tied to the password field by `aria-describedby`, and a polite live region announces only when the minimum is reached or a suggestion changes state, not on every key.',
      name: 'passwordSuggestions',
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
        '`Partial<Record<keyof SignupValues, string>>`. A message per field (`name`, `email` and `password`), shown in `FieldError` and tied to the field with `aria-invalid`. When it goes from empty to filled, focus moves to the first invalid field. A message clears when the user edits its field.',
      name: 'fieldErrors',
    },
    {
      description:
        '`AuthProvider[]`: `id`, `label` and an optional `icon`. Each one is an outline button named by `labels.providerContinue(label)` below a separator; `onProviderSelect(id)` receives the `id`. Empty or missing renders neither the buttons nor the separator.',
      name: 'providers',
    },
    {
      description:
        '`termsHref` and `privacyHref`. The terms notice is plain text with links: `labels.termsLead`, then a link for each `href` passed, joined by `labels.termsAnd`. There is no checkbox and nothing in the values. With neither `href` the notice is not rendered. `loginHref` renders the footer link the same way: only when passed, and without it the footer is not rendered either.',
      name: 'termsHref',
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
        'Partial `SignupLabels`. Every visible or accessible text the block owns, with pt-BR defaults, including the show and hide password texts, the mismatch message and the password feedback texts. The messages of the native constraints (`required`, `type="email"`, `minLength`) are the browser\'s own.',
      name: 'labels',
    },
  ],
  description: {
    component:
      'A sign-up page: name, e-mail, a password with live feedback and a confirmation, both with a show and hide button, optional providers, a terms notice that is only links and a sign in link, inside a centered card. Install it with `npx @tc96/parttens add signup-1`.',
  },
  story: { height: '60rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    loginHref: '/login',
    logo: authLogo,
    onProviderSelect: fn(),
    onSubmit: fn(),
    privacyHref: '/privacy',
    providers: authProviders,
    termsHref: '/terms',
  },
  component: Signup1,
  parameters: { docs, layout: 'fullscreen' },
  title: 'Blocks/Application/Auth/Signup1',
} satisfies Meta<typeof Signup1>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!autodocs']

const name = 'Ana Souza'
const email = 'ana@acme.com'
const password = 'segredo123'

type Canvas = ReturnType<typeof within>

const nameField = (canvas: Canvas) =>
  canvas.getByRole('textbox', { name: 'Nome' })

const emailField = (canvas: Canvas) =>
  canvas.getByRole('textbox', { name: 'E-mail' })

const passwordField = (canvas: Canvas) => canvas.getByLabelText('Senha')

const confirmField = (canvas: Canvas) =>
  canvas.getByLabelText('Confirmar senha')

const submitButton = (canvas: Canvas) =>
  canvas.getByRole('button', { name: 'Criar conta' })

const feedback = (canvasElement: HTMLElement) =>
  within(
    canvasElement.querySelector<HTMLElement>(
      '[data-slot="field-description"]',
    ) as HTMLElement,
  )

const announcement = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[aria-live="polite"]')

async function fillIdentity(canvas: Canvas) {
  await userEvent.type(nameField(canvas), name)
  await userEvent.type(emailField(canvas), email)
}

async function fillAccount(canvas: Canvas, confirmation = password) {
  await fillIdentity(canvas)
  await userEvent.type(passwordField(canvas), password)
  await userEvent.type(confirmField(canvas), confirmation)
}

function FailingSignup(props: Readonly<SignupProps>) {
  const [error, setError] = useState<string>()
  return (
    <Signup1
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('Não foi possível criar a conta. Tente novamente.')
      }}
    />
  )
}

function RejectedSignup(props: Readonly<SignupProps>) {
  const [fieldErrors, setFieldErrors] = useState<SignupProps['fieldErrors']>()
  return (
    <Signup1
      {...props}
      fieldErrors={fieldErrors}
      onSubmit={(values) => {
        props.onSubmit(values)
        setFieldErrors({
          email: 'Este e-mail já está em uso.',
          password: 'Escolha uma senha mais forte.',
        })
      }}
    />
  )
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Criar conta' }),
    ).toBeVisible()
    await expect(nameField(canvas)).toHaveAttribute('autocomplete', 'name')
    await expect(emailField(canvas)).toHaveAttribute('autocomplete', 'email')
    await expect(emailField(canvas)).toHaveAttribute('type', 'email')
    await expect(passwordField(canvas)).toHaveAttribute(
      'autocomplete',
      'new-password',
    )
    await expect(passwordField(canvas)).toHaveAttribute('minlength', '8')
    await expect(confirmField(canvas)).toHaveAttribute(
      'autocomplete',
      'new-password',
    )
    await expect(canvas.queryByRole('checkbox')).toBeNull()
  },
}

export const Minimal: Story = {
  args: {
    loginHref: undefined,
    logo: undefined,
    privacyHref: undefined,
    providers: undefined,
    termsHref: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Only the required prop: no logo, providers, terms notice or links. The card keeps the title, the fields, the password feedback and the submit button.',
      },
    },
  },
}

export const PasswordRules: Story = {
  args: { passwordMinLength: 12, passwordSuggestions: ['number', 'symbol'] },
  parameters: {
    docs: {
      description: {
        story:
          'A longer minimum and a shorter suggestion list. The number in the feedback and in the native `minLength` is the same.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(passwordField(canvas)).toHaveAttribute('minlength', '12')
    await expect(
      feedback(canvasElement).getByText('0 de 12 caracteres'),
    ).toBeVisible()
    await expect(feedback(canvasElement).getByText('número')).toBeVisible()
    await expect(feedback(canvasElement).getByText('símbolo')).toBeVisible()
    await expect(
      feedback(canvasElement).queryByText('letra minúscula'),
    ).toBeNull()
    await expect(
      feedback(canvasElement).queryByText('letra maiúscula'),
    ).toBeNull()
  },
}

export const SubmitSendsValues: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillAccount(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email,
      name,
      password,
    })
  },
  tags: interaction,
}

export const EnterSubmits: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillIdentity(canvas)
    await userEvent.type(passwordField(canvas), password)
    await userEvent.type(confirmField(canvas), `${password}{Enter}`)
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email,
      name,
      password,
    })
  },
  tags: interaction,
}

export const Pending: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Criando conta…' })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('type', 'submit')
    await expect(
      canvasElement.querySelector('[data-slot="form"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getByRole('button', { name: 'Continuar com Google' }),
    ).toBeDisabled()
    await fillIdentity(canvas)
    await userEvent.type(passwordField(canvas), password)
    await userEvent.type(confirmField(canvas), `${password}{Enter}`)
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
    await waitFor(() => expect(nameField(canvas)).toHaveFocus())
    await expect(nameField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="field-error"]'),
      ).toBeVisible(),
    )
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await userEvent.type(nameField(canvas), name)
    await userEvent.type(emailField(canvas), 'ana')
    await userEvent.type(passwordField(canvas), password)
    await userEvent.type(confirmField(canvas), password)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const MismatchBlocksSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillAccount(canvas, `${password}x`)
    await expect(canvas.queryByText('As senhas não coincidem.')).toBeNull()
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(confirmField(canvas)).toHaveFocus())
    await expect(canvas.getByText('As senhas não coincidem.')).toBeVisible()
    await expect(confirmField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(confirmField(canvas)).toHaveAccessibleDescription(
      'As senhas não coincidem.',
    )
    await expect(passwordField(canvas)).not.toHaveAttribute(
      'aria-invalid',
      'true',
    )
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const MismatchClearsWhenConfirmationIsEdited: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillAccount(canvas, `${password}x`)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(confirmField(canvas)).toHaveFocus())
    await expect(canvas.getByText('As senhas não coincidem.')).toBeVisible()
    await userEvent.clear(confirmField(canvas))
    await waitFor(() =>
      expect(canvas.queryByText('As senhas não coincidem.')).toBeNull(),
    )
    await userEvent.type(confirmField(canvas), password)
    await waitFor(() =>
      expect(confirmField(canvas)).not.toHaveAttribute('aria-invalid', 'true'),
    )
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email,
      name,
      password,
    })
  },
  tags: interaction,
}

export const MismatchClearsWhenPasswordIsEdited: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillAccount(canvas, `${password}x`)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(confirmField(canvas)).toHaveFocus())
    await expect(canvas.getByText('As senhas não coincidem.')).toBeVisible()
    await userEvent.type(passwordField(canvas), 'x')
    await waitFor(() =>
      expect(canvas.queryByText('As senhas não coincidem.')).toBeNull(),
    )
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email,
      name,
      password: `${password}x`,
    })
  },
  tags: interaction,
}

export const FeedbackUpdatesWhileTyping: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const item = (text: string) =>
      feedback(canvasElement).getByText(text).closest('li') as HTMLElement
    await expect(
      feedback(canvasElement).getByText('0 de 8 caracteres'),
    ).toBeVisible()
    await expect(
      feedback(canvasElement).getByText('Para uma senha mais segura, use:'),
    ).toBeVisible()
    for (const text of [
      'letra minúscula',
      'letra maiúscula',
      'número',
      'símbolo',
    ]) {
      await expect(item(text)).toHaveTextContent('faltando')
      await expect(item(text)).not.toHaveAttribute('data-met')
    }
    await expect(passwordField(canvas)).toHaveAccessibleDescription(
      /0 de 8 caracteres/,
    )
    await userEvent.type(passwordField(canvas), 'abc')
    await expect(
      feedback(canvasElement).getByText('3 de 8 caracteres'),
    ).toBeVisible()
    await expect(item('letra minúscula')).toHaveTextContent('atendida')
    await expect(item('letra minúscula')).toHaveAttribute('data-met')
    await expect(item('letra maiúscula')).toHaveTextContent('faltando')
    await userEvent.type(passwordField(canvas), 'D1!')
    await expect(
      feedback(canvasElement).getByText('6 de 8 caracteres'),
    ).toBeVisible()
    for (const text of ['letra maiúscula', 'número', 'símbolo']) {
      await expect(item(text)).toHaveTextContent('atendida')
    }
    await userEvent.type(passwordField(canvas), 'efgh')
    await expect(
      feedback(canvasElement).getByText('8 de 8 caracteres'),
    ).toBeVisible()
    await userEvent.clear(passwordField(canvas))
    await expect(
      feedback(canvasElement).getByText('0 de 8 caracteres'),
    ).toBeVisible()
    await expect(item('letra minúscula')).toHaveTextContent('faltando')
  },
  tags: interaction,
}

export const FeedbackAnnouncesOnlyChanges: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(announcement(canvasElement)).toBeEmptyDOMElement()
    await userEvent.type(passwordField(canvas), 'abc')
    await expect(announcement(canvasElement)).toHaveTextContent(
      /^letra minúscula: atendida$/,
    )
    await userEvent.type(passwordField(canvas), 'D')
    await expect(announcement(canvasElement)).toHaveTextContent(
      /^letra maiúscula: atendida$/,
    )
    await userEvent.type(passwordField(canvas), 'EF')
    await expect(announcement(canvasElement)).toHaveTextContent(
      /^letra maiúscula: atendida$/,
    )
    await userEvent.type(passwordField(canvas), 'GH')
    await expect(announcement(canvasElement)).toHaveTextContent(
      /^8 de 8 caracteres$/,
    )
  },
  tags: interaction,
}

export const FeedbackDoesNotBlockSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const weak = '12345678'
    await fillIdentity(canvas)
    await userEvent.type(passwordField(canvas), weak)
    await userEvent.type(confirmField(canvas), weak)
    await expect(
      feedback(canvasElement).getByText('letra minúscula').closest('li'),
    ).toHaveTextContent('faltando')
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email,
      name,
      password: weak,
    })
  },
  tags: interaction,
}

export const NoSuggestions: Story = {
  args: { passwordSuggestions: [] },
  play: async ({ canvasElement }) => {
    await expect(
      feedback(canvasElement).getByText('0 de 8 caracteres'),
    ).toBeVisible()
    await expect(
      feedback(canvasElement).queryByText('Para uma senha mais segura, use:'),
    ).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="field-description"] li'),
    ).toBeNull()
  },
  tags: interaction,
}

export const TogglePasswordVisibility: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(passwordField(canvas), password)
    await userEvent.type(confirmField(canvas), password)
    const [showPassword, showConfirmation] = canvas.getAllByRole('button', {
      name: 'Mostrar senha',
    })
    await expect(passwordField(canvas)).toHaveAttribute('type', 'password')
    await expect(confirmField(canvas)).toHaveAttribute('type', 'password')
    await userEvent.click(showPassword)
    await expect(passwordField(canvas)).toHaveAttribute('type', 'text')
    await expect(passwordField(canvas)).toHaveValue(password)
    await expect(confirmField(canvas)).toHaveAttribute('type', 'password')
    await expect(
      canvas.getAllByRole('button', { name: 'Mostrar senha' }),
    ).toHaveLength(1)
    await userEvent.click(showConfirmation)
    await expect(confirmField(canvas)).toHaveAttribute('type', 'text')
    await expect(confirmField(canvas)).toHaveValue(password)
    await expect(
      canvas.getAllByRole('button', { name: 'Ocultar senha' }),
    ).toHaveLength(2)
    await userEvent.click(showPassword)
    await userEvent.click(showConfirmation)
    await expect(passwordField(canvas)).toHaveAttribute('type', 'password')
    await expect(confirmField(canvas)).toHaveAttribute('type', 'password')
    await expect(
      canvas.getAllByRole('button', { name: 'Mostrar senha' }),
    ).toHaveLength(2)
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const FieldErrors: Story = {
  args: {
    fieldErrors: {
      email: 'Este e-mail já está em uso.',
      name: 'Informe o nome completo.',
      password: 'Escolha uma senha mais forte.',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(nameField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByText('Informe o nome completo.')).toBeVisible()
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByText('Este e-mail já está em uso.')).toBeVisible()
    await expect(passwordField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(
      canvas.getByText('Escolha uma senha mais forte.'),
    ).toBeVisible()
  },
  tags: interaction,
}

export const FieldErrorsFocusFirstInvalid: Story = {
  render: (args) => <RejectedSignup {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillAccount(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(emailField(canvas)).toHaveAccessibleDescription(
      'Este e-mail já está em uso.',
    )
    await expect(passwordField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(nameField(canvas)).not.toHaveAttribute('aria-invalid', 'true')
  },
  tags: interaction,
}

export const ErrorMessage: Story = {
  args: { error: 'Não foi possível criar a conta. Tente novamente.' },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveTextContent('Não foi possível continuar')
    await expect(alert).toHaveTextContent(
      'Não foi possível criar a conta. Tente novamente.',
    )
  },
  tags: interaction,
}

export const ErrorFocusesAlert: Story = {
  render: (args) => <FailingSignup {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('alert')).toBeNull()
    await fillAccount(canvas)
    await userEvent.click(submitButton(canvas))
    const alert = await canvas.findByRole('alert')
    await waitFor(() => expect(alert).toHaveFocus())
    await expect(alert).toHaveTextContent(
      'Não foi possível criar a conta. Tente novamente.',
    )
  },
  tags: interaction,
}

export const LinksThroughRenderLink: Story = {
  args: { renderLink: fn(renderAnchor) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: 'Entrar' })).toHaveAttribute(
      'href',
      '/login',
    )
    await expect(canvas.getByText('Já tem uma conta?')).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Termos de Uso' }),
    ).toHaveAttribute('href', '/terms')
    await expect(
      canvas.getByRole('link', { name: 'Política de Privacidade' }),
    ).toHaveAttribute('href', '/privacy')
    await expect(
      canvas.getByText('Ao criar a conta você concorda com os'),
    ).toBeVisible()
    await expect(canvas.getByText('e a')).toBeVisible()
    await expect(args.renderLink).toHaveBeenCalledWith('/login')
    await expect(args.renderLink).toHaveBeenCalledWith('/terms')
    await expect(args.renderLink).toHaveBeenCalledWith('/privacy')
    await expect(canvas.queryByRole('checkbox')).toBeNull()
  },
  tags: interaction,
}

export const TermsOnlyWithHref: Story = {
  args: {
    loginHref: undefined,
    privacyHref: undefined,
    renderLink: fn(renderAnchor),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Termos de Uso' }),
    ).toHaveAttribute('href', '/terms')
    await expect(canvas.queryByText('Política de Privacidade')).toBeNull()
    await expect(canvas.queryByText('e a')).toBeNull()
    await expect(canvas.queryByText('Já tem uma conta?')).toBeNull()
    await expect(args.renderLink).toHaveBeenCalledWith('/terms')
    await expect(args.renderLink).not.toHaveBeenCalledWith('/privacy')
  },
  tags: interaction,
}

export const LinksOnlyWithHref: Story = {
  args: {
    loginHref: undefined,
    privacyHref: undefined,
    renderLink: fn(renderAnchor),
    termsHref: undefined,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.queryByText('Já tem uma conta?')).toBeNull()
    await expect(
      canvas.queryByText('Ao criar a conta você concorda com os'),
    ).toBeNull()
    await expect(args.renderLink).not.toHaveBeenCalled()
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
