import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ResetPassword1,
  type ResetPasswordProps,
} from '@tc96/blocks/application/auth/reset-password-1'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { authLogo } from './fixtures/auth-data'

const usage = `
// npx @tc96/parttens add reset-password-1
import { ResetPassword1 } from '@acme/blocks/application/auth/reset-password-1'
import { Link } from '@tanstack/react-router'

// the reset token comes from the route; the block never sees it
<ResetPassword1
  error={error}
  fieldErrors={fieldErrors}
  loginHref="/login"
  logo={<Logo />}
  onSubmit={({ password }) => resetPassword(token, password)}
  passwordMinLength={8}
  pending={isResetting}
  renderLink={(href) => <Link to={href} />}
/>
`

const docs = {
  api: [
    {
      description:
        'Root component. The whole page: a `main` landmark that centers its content in the window height, the optional `logo` above a COSS `Card`, and inside it the title (an `h1`), the description, the form message, the form and the footer. Mount it on the route and do not wrap it in another `main`. The password change, the session and the redirect after it stay in the app: the block only calls `onSubmit`.',
      name: 'ResetPassword1',
    },
    {
      description:
        '`(values: ResetPasswordValues) => void`, with `password` only. The confirmation adds nothing to the values. It runs only after the native constraints pass (`required` and `minLength`), only when the password and the confirmation match, and never while `pending`. The return value is ignored. The fields are uncontrolled: the values stay in the form after an error.',
      name: 'onSubmit',
    },
    {
      description:
        'There is no token prop, no token field and no token in the values. The reset token belongs to the app: it reads it from the route and sends it with the new password. The block neither reads, validates nor keeps it. An expired or invalid token comes back through `error` (for example, "The link expired. Ask for a new one.").',
      name: 'token',
    },
    {
      description:
        'The confirmation field. On submit, after the native constraints, the block checks that both passwords are equal. When they differ it shows `labels.passwordMismatch` in the confirmation field, marks it `aria-invalid`, moves focus to it and does not call `onSubmit`. The message clears when either password field is edited. The confirmation is not a key of `ResetPasswordValues`, so `fieldErrors` cannot target it.',
      name: 'confirmPassword',
    },
    {
      description:
        '`number`, default `8`. The minimum password length: it is the native `minLength` constraint and the `n of N characters` feedback under the new password field. Only this blocks the submit.',
      name: 'passwordMinLength',
    },
    {
      description:
        '`AuthPasswordSuggestion[]`, default `lowercase`, `uppercase`, `number` and `symbol`. The character types the feedback suggests, each shown with its state in text (`labels.suggestionMet` or `labels.suggestionMissing`). They are advice and never block the submit; an empty list hides them. The feedback is tied to the field by `aria-describedby`, and a polite live region announces only when the minimum is reached or a suggestion changes state, not on every key.',
      name: 'passwordSuggestions',
    },
    {
      description:
        '`boolean`. Disables the submit button and shows `labels.submitPending`, and sets `aria-busy` on the form. `onSubmit` is not called while it is true, Enter included. The app owns this state.',
      name: 'pending',
    },
    {
      description:
        '`string`. A message for the whole form, shown in a COSS `Alert` with `role="alert"` and the title `labels.errorTitle`. When it goes from empty to filled and no field is invalid, focus moves to the alert. The text is rendered as text, never as HTML.',
      name: 'error',
    },
    {
      description:
        '`Partial<Record<keyof ResetPasswordValues, string>>`. A message for `password`, shown in `FieldError` and tied to the field with `aria-invalid`. When it goes from empty to filled, focus moves to the field. A message clears when the user edits its field.',
      name: 'fieldErrors',
    },
    {
      description:
        '`loginHref`. The footer link back to the sign in page, named by `labels.backToLogin`. It renders only when passed, and without it the footer is not rendered. `renderLink` is `(href) => ReactElement`: every link renders through it, so the router of the app owns navigation; the default is a plain `a` (`renderAnchor` from `@tc96/ui/render-anchor`).',
      name: 'loginHref',
    },
    {
      description:
        '`ReactNode`. Rendered above the card, outside it, centered. Nothing is rendered in its place when it is missing.',
      name: 'logo',
    },
    {
      description:
        "Partial `ResetPasswordLabels`. Every visible or accessible text the block owns, with pt-BR defaults, including the show and hide password texts, the mismatch message and the password feedback texts. The messages of the native constraints (`required`, `minLength`) are the browser's own.",
      name: 'labels',
    },
  ],
  description: {
    component:
      'A reset password page: a new password with live feedback and a confirmation, both with a show and hide button, and a link back to sign in, inside a centered card. The reset token never passes through the block. Install it with `npx @tc96/parttens add reset-password-1`.',
  },
  story: { height: '48rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    loginHref: '/login',
    logo: authLogo,
    onSubmit: fn(),
  },
  component: ResetPassword1,
  parameters: { docs, layout: 'fullscreen' },
  title: 'Blocks/Application/Auth/ResetPassword1',
} satisfies Meta<typeof ResetPassword1>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!autodocs']

const password = 'segredo123'

type Canvas = ReturnType<typeof within>

const passwordField = (canvas: Canvas) => canvas.getByLabelText('Nova senha')

const confirmField = (canvas: Canvas) =>
  canvas.getByLabelText('Confirmar senha')

const submitButton = (canvas: Canvas) =>
  canvas.getByRole('button', { name: 'Redefinir senha' })

const feedback = (canvasElement: HTMLElement) =>
  within(
    canvasElement.querySelector<HTMLElement>(
      '[data-slot="field-description"]',
    ) as HTMLElement,
  )

const announcement = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[aria-live="polite"]')

async function fillPasswords(canvas: Canvas, confirmation = password) {
  await userEvent.type(passwordField(canvas), password)
  await userEvent.type(confirmField(canvas), confirmation)
}

function ExpiredLinkReset(props: Readonly<ResetPasswordProps>) {
  const [error, setError] = useState<string>()
  return (
    <ResetPassword1
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('O link de redefinição expirou. Peça um novo link.')
      }}
    />
  )
}

function RejectedReset(props: Readonly<ResetPasswordProps>) {
  const [fieldErrors, setFieldErrors] =
    useState<ResetPasswordProps['fieldErrors']>()
  return (
    <ResetPassword1
      {...props}
      fieldErrors={fieldErrors}
      onSubmit={(values) => {
        props.onSubmit(values)
        setFieldErrors({ password: 'Escolha uma senha diferente da anterior.' })
      }}
    />
  )
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Redefinir senha' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Escolha uma nova senha para a sua conta.'),
    ).toBeVisible()
    await expect(passwordField(canvas)).toHaveAttribute(
      'autocomplete',
      'new-password',
    )
    await expect(passwordField(canvas)).toHaveAttribute('minlength', '8')
    await expect(passwordField(canvas)).toBeRequired()
    await expect(confirmField(canvas)).toHaveAttribute(
      'autocomplete',
      'new-password',
    )
    await expect(confirmField(canvas)).toBeRequired()
  },
}

export const Minimal: Story = {
  args: { loginHref: undefined, logo: undefined },
  parameters: {
    docs: {
      description: {
        story:
          'Only the required prop: no logo and no link. The card keeps the title, the fields, the password feedback and the submit button.',
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

export const SubmitSendsOnlyPassword: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillPasswords(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ password })
  },
  tags: interaction,
}

export const EnterSubmits: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(passwordField(canvas), password)
    await userEvent.type(confirmField(canvas), `${password}{Enter}`)
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ password })
  },
  tags: interaction,
}

export const NoResetToken: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvasElement.querySelector<HTMLFormElement>(
      '[data-slot="form"]',
    ) as HTMLFormElement
    const names = Array.from(form.elements)
      .map((element) => element.getAttribute('name'))
      .filter(Boolean)
    await expect(names).toEqual(['password', 'confirmPassword'])
    await expect(canvasElement.querySelector('input[type="hidden"]')).toBeNull()
    await expect(canvasElement.querySelector('[name*="token" i]')).toBeNull()
    await fillPasswords(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ password })
  },
  tags: interaction,
}

export const Pending: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Redefinindo…' })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('type', 'submit')
    await expect(
      canvasElement.querySelector('[data-slot="form"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await userEvent.type(passwordField(canvas), password)
    await userEvent.type(confirmField(canvas), `${password}{Enter}`)
    await userEvent.click(submit, { pointerEventsCheck: 0 })
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const NativeConstraintsBlockSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(passwordField(canvas)).toHaveFocus())
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await userEvent.type(passwordField(canvas), password)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(confirmField(canvas)).toHaveFocus())
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const MismatchBlocksSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillPasswords(canvas, `${password}x`)
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
    await fillPasswords(canvas, `${password}x`)
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
    await expect(args.onSubmit).toHaveBeenCalledWith({ password })
  },
  tags: interaction,
}

export const MismatchClearsWhenPasswordIsEdited: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillPasswords(canvas, `${password}x`)
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
    await userEvent.type(passwordField(canvas), weak)
    await userEvent.type(confirmField(canvas), weak)
    await expect(
      feedback(canvasElement).getByText('letra minúscula').closest('li'),
    ).toHaveTextContent('faltando')
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ password: weak })
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
    await fillPasswords(canvas)
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
    fieldErrors: { password: 'Escolha uma senha diferente da anterior.' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(passwordField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(
      canvas.getByText('Escolha uma senha diferente da anterior.'),
    ).toBeVisible()
    await expect(confirmField(canvas)).not.toHaveAttribute(
      'aria-invalid',
      'true',
    )
  },
  tags: interaction,
}

export const FieldErrorsFocusPassword: Story = {
  render: (args) => <RejectedReset {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillPasswords(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(passwordField(canvas)).toHaveFocus())
    await expect(passwordField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(passwordField(canvas)).toHaveAccessibleDescription(
      /Escolha uma senha diferente da anterior\./,
    )
    await expect(confirmField(canvas)).not.toHaveAttribute(
      'aria-invalid',
      'true',
    )
  },
  tags: interaction,
}

export const ErrorMessage: Story = {
  args: { error: 'O link de redefinição expirou. Peça um novo link.' },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveTextContent('Não foi possível continuar')
    await expect(alert).toHaveTextContent(
      'O link de redefinição expirou. Peça um novo link.',
    )
  },
  tags: interaction,
}

export const ErrorFocusesAlert: Story = {
  render: (args) => <ExpiredLinkReset {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('alert')).toBeNull()
    await fillPasswords(canvas)
    await userEvent.click(submitButton(canvas))
    const alert = await canvas.findByRole('alert')
    await waitFor(() => expect(alert).toHaveFocus())
    await expect(alert).toHaveTextContent(
      'O link de redefinição expirou. Peça um novo link.',
    )
  },
  tags: interaction,
}

export const BackToLoginThroughRenderLink: Story = {
  args: { renderLink: fn(renderAnchor) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Voltar para entrar' }),
    ).toHaveAttribute('href', '/login')
    await expect(args.renderLink).toHaveBeenCalledWith('/login')
  },
  tags: interaction,
}

export const LinkOnlyWithHref: Story = {
  args: { loginHref: undefined, renderLink: fn(renderAnchor) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.queryByText('Voltar para entrar')).toBeNull()
    await expect(args.renderLink).not.toHaveBeenCalled()
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
