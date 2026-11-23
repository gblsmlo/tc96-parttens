import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ForgotPassword1,
  type ForgotPasswordProps,
} from '@tc96/blocks/application/auth/forgot-password-1'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { authLogo } from './fixtures/auth-data'

const usage = `
// npx @tc96/parttens add forgot-password-1
import { ForgotPassword1 } from '@acme/blocks/application/auth/forgot-password-1'
import { Link } from '@tanstack/react-router'

// \`sent\` and \`resendIn\` are the app's: the block keeps no "sent" state and runs no timer
<ForgotPassword1
  destination={sentTo}
  error={error}
  fieldErrors={fieldErrors}
  loginHref="/login"
  logo={<Logo />}
  onResend={() => requestResetLink(sentTo)}
  onSubmit={({ email }) => requestResetLink(email)}
  pending={isPending}
  renderLink={(href) => <Link to={href} />}
  resendIn={secondsLeft}
  sent={Boolean(sentTo)}
/>
`

const docs = {
  api: [
    {
      description:
        'Root component. The whole page: a `main` landmark that centers its content in the window height, the optional `logo` above a COSS `Card`, and inside it the title (an `h1`), the description, the form message, the e-mail form and the footer. Mount it on the route and do not wrap it in another `main`. Sending the link, the session and the redirect stay in the app: the block only calls `onSubmit` and `onResend`.',
      name: 'ForgotPassword1',
    },
    {
      description:
        '`(values: ForgotPasswordValues) => void`, with `email` only. It runs only after the native constraints pass (`required` and a valid e-mail), never while `pending` and never in the confirmation, where there is no form. Enter in the field sends too. The return value is ignored.',
      name: 'onSubmit',
    },
    {
      description:
        '`boolean`. When true, the form is replaced, inside the same card, by the confirmation: `labels.sentTitle` (an `h1`) and `labels.sentDescription`, the resend footer and the back to login link. The app decides when it turns true, usually after `onSubmit` succeeded; the block keeps no "sent" state. When it goes from false to true, focus moves to the confirmation title; a page that mounts with `sent` already true does not take focus.',
      name: 'sent',
    },
    {
      description:
        '`string`. Optional. Where the link was sent, shown in the confirmation through `labels.sentDescription(destination)`. The block never reads the e-mail from the form, so the app passes it (and decides whether to reveal it). Without it the text is generic.',
      name: 'destination',
    },
    {
      description:
        '`onResend` and `resendIn`. The resend button of the confirmation renders only when `onResend` is passed. `resendIn` is the number of seconds the app counts down: while it is above zero the button is disabled and shows `labels.resendIn(seconds)`; at zero or when missing it shows `labels.resend` and calls `onResend()`. The block runs no timer and the countdown is plain text, outside any `aria-live` region.',
      name: 'onResend',
    },
    {
      description:
        '`boolean`. Disables the submit button and shows `labels.submitPending`, sets `aria-busy` on the form and disables the resend button of the confirmation. `onSubmit` and `onResend` are not called while it is true, Enter included. The app owns this state.',
      name: 'pending',
    },
    {
      description:
        '`string`. A message for the whole form, shown in a COSS `Alert` with `role="alert"` and the title `labels.errorTitle`, in the form and in the confirmation (a failed resend, for example). When it goes from empty to filled and no field is invalid, focus moves to the alert. Whether the e-mail exists is the app\'s to reveal or not.',
      name: 'error',
    },
    {
      description:
        '`Partial<Record<keyof ForgotPasswordValues, string>>`, that is `email`. The message is shown in `FieldError` and tied to the field with `aria-invalid`. When it goes from empty to filled, focus moves to the field.',
      name: 'fieldErrors',
    },
    {
      description:
        '`loginHref`. The footer link back to the sign in page, named by `labels.backToLogin`, in the form and in the confirmation. It renders only when passed. `renderLink` is `(href) => ReactElement`: every link renders through it; the default is a plain `a` (`renderAnchor` from `@tc96/ui/render-anchor`).',
      name: 'loginHref',
    },
    {
      description:
        '`ReactNode`. Rendered above the card, outside it, centered. Nothing is rendered in its place when it is missing.',
      name: 'logo',
    },
    {
      description:
        "Partial `ForgotPasswordLabels`. Every visible or accessible text the block owns, with pt-BR defaults, including the confirmation (`sentTitle`, `sentDescription`) and the resend texts (`didNotReceive`, `resend`, `resendIn`). The messages of the native constraints are the browser's own.",
      name: 'labels',
    },
  ],
  description: {
    component:
      'A forgot password page: an e-mail field that asks for the reset link, and a confirmation that replaces the form in the same card when the app says the e-mail was sent, with a way back to sign in and an optional resend with a countdown the app controls. Install it with `npx @tc96/parttens add forgot-password-1`.',
  },
  story: { height: '40rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    destination: 'ana@acme.com',
    loginHref: '/login',
    logo: authLogo,
    onResend: fn(),
    onSubmit: fn(),
  },
  component: ForgotPassword1,
  parameters: { docs, layout: 'fullscreen' },
  title: 'Blocks/Application/Auth/ForgotPassword1',
} satisfies Meta<typeof ForgotPassword1>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!autodocs']

const email = 'ana@acme.com'

const sentDescription =
  'Enviamos um link para redefinir a senha para ana@acme.com.'

type Canvas = ReturnType<typeof within>

const emailField = (canvas: Canvas) => canvas.getByLabelText('E-mail')

const submitButton = (canvas: Canvas) =>
  canvas.getByRole('button', { name: 'Enviar link' })

const sentTitle = (canvas: Canvas) =>
  canvas.getByRole('heading', { level: 1, name: 'Verifique seu e-mail' })

const resendButton = (canvas: Canvas, name = 'Reenviar e-mail') =>
  canvas.getByRole('button', { name })

function SendingForgotPassword(props: Readonly<ForgotPasswordProps>) {
  const [sent, setSent] = useState(false)
  return (
    <ForgotPassword1
      {...props}
      onSubmit={(values) => {
        props.onSubmit(values)
        setSent(true)
      }}
      sent={sent}
    />
  )
}

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

export const Default: Story = {
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
    await expect(emailField(canvas)).toHaveAttribute('type', 'email')
    await expect(emailField(canvas)).toHaveAttribute('autocomplete', 'email')
    await expect(emailField(canvas)).toBeRequired()
    await expect(submitButton(canvas)).toHaveAttribute('type', 'submit')
    await expect(
      canvas.getByRole('link', { name: 'Voltar para entrar' }),
    ).toHaveAttribute('href', '/login')
  },
}

export const Minimal: Story = {
  args: {
    destination: undefined,
    loginHref: undefined,
    logo: undefined,
    onResend: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Only the required prop: no logo and no link. The card keeps the title, the e-mail field and the submit button.',
      },
    },
  },
}

export const Sent: Story = {
  args: { sent: true },
  parameters: {
    docs: {
      description: {
        story:
          'The app says the e-mail was sent: the form is replaced by the confirmation, with the resend and the way back to sign in.',
      },
    },
  },
}

export const SentWithCountdown: Story = {
  args: { resendIn: 30, sent: true },
  parameters: {
    docs: {
      description: {
        story:
          'The app counts down the next resend: the button is disabled and shows the seconds it passes in.',
      },
    },
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
  tags: interaction,
}

export const EnterSubmits: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(emailField(canvas), `${email}{Enter}`)
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ email })
  },
  tags: interaction,
}

export const Pending: Story = {
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
  tags: interaction,
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
  tags: interaction,
}

export const FieldErrors: Story = {
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
  tags: interaction,
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
  tags: interaction,
}

export const ErrorMessage: Story = {
  args: { error: 'Não foi possível enviar o link. Tente novamente.' },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveTextContent('Não foi possível continuar')
    await expect(alert).toHaveTextContent(
      'Não foi possível enviar o link. Tente novamente.',
    )
  },
  tags: interaction,
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
  tags: interaction,
}

export const SentReplacesTheForm: Story = {
  args: { sent: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(canvas.getByText(sentDescription)).toBeVisible()
    await expect(
      canvas.queryByRole('heading', { name: 'Esqueceu a senha?' }),
    ).toBeNull()
    await expect(
      canvas.queryByText(
        'Informe seu e-mail e enviaremos um link para redefinir a senha.',
      ),
    ).toBeNull()
    await expect(canvas.queryByLabelText('E-mail')).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Enviar link' }),
    ).toBeNull()
    await expect(canvasElement.querySelector('[data-slot="form"]')).toBeNull()
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(
      canvasElement.querySelectorAll('[data-slot="card"]'),
    ).toHaveLength(1)
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const SentFocusesTheTitleOnTransition: Story = {
  render: (args) => <SendingForgotPassword {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('Verifique seu e-mail')).toBeNull()
    await userEvent.type(emailField(canvas), email)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ email })
    const title = await canvas.findByRole('heading', {
      level: 1,
      name: 'Verifique seu e-mail',
    })
    await waitFor(() => expect(title).toHaveFocus())
    await expect(title).toHaveAttribute('tabindex', '-1')
    await expect(canvas.queryByLabelText('E-mail')).toBeNull()
    await expect(canvas.getByText(sentDescription)).toBeVisible()
  },
  tags: interaction,
}

export const SentOnMountDoesNotTakeFocus: Story = {
  args: { sent: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(sentTitle(canvas)).not.toHaveFocus()
  },
  tags: interaction,
}

export const DestinationInConfirmation: Story = {
  args: { destination: 'ana@acme.com', sent: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(sentDescription)).toBeVisible()
  },
  tags: interaction,
}

export const ConfirmationWithoutDestinationIsGeneric: Story = {
  args: { destination: undefined, sent: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText(
        'Enviamos um link para redefinir a senha para o seu e-mail.',
      ),
    ).toBeVisible()
    await expect(canvas.queryByText(/ana@acme\.com/)).toBeNull()
  },
  tags: interaction,
}

export const ResendCallsTheHandler: Story = {
  args: { sent: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Não recebeu o e-mail?')).toBeVisible()
    const resend = resendButton(canvas)
    await expect(resend).toBeEnabled()
    await expect(resend).toHaveAttribute('type', 'button')
    await userEvent.click(resend)
    await expect(args.onResend).toHaveBeenCalledOnce()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const ResendDisabledWhileCounting: Story = {
  args: { resendIn: 30, sent: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const resend = resendButton(canvas, 'Reenviar em 30s')
    await expect(resend).toBeDisabled()
    await expect(resend.closest('[aria-live]')).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Reenviar e-mail' }),
    ).toBe(null)
    await userEvent.click(resend, { pointerEventsCheck: 0 })
    await expect(args.onResend).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const ResendEnabledAtZero: Story = {
  args: { resendIn: 0, sent: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const resend = resendButton(canvas)
    await expect(resend).toBeEnabled()
    await userEvent.click(resend)
    await expect(args.onResend).toHaveBeenCalledOnce()
  },
  tags: interaction,
}

export const ResendOnlyWithHandler: Story = {
  args: { onResend: undefined, resendIn: 30, sent: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(canvas.queryByText('Não recebeu o e-mail?')).toBeNull()
    await expect(canvas.queryByText('Reenviar em 30s')).toBeNull()
    await expect(canvas.queryByText('Reenviar e-mail')).toBeNull()
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(
      canvas.getByRole('link', { name: 'Voltar para entrar' }),
    ).toBeVisible()
  },
  tags: interaction,
}

export const PendingBlocksResend: Story = {
  args: { pending: true, sent: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const resend = resendButton(canvas)
    await expect(resend).toBeDisabled()
    await userEvent.click(resend, { pointerEventsCheck: 0 })
    await expect(args.onResend).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const ErrorStaysInSentState: Story = {
  args: {
    error: 'Não foi possível reenviar o e-mail. Tente novamente.',
    sent: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Não foi possível reenviar o e-mail. Tente novamente.',
    )
  },
  tags: interaction,
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
  tags: interaction,
}

export const BackToLoginInTheConfirmation: Story = {
  args: { renderLink: fn(renderAnchor), sent: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Voltar para entrar' }),
    ).toHaveAttribute('href', '/login')
    await expect(args.renderLink).toHaveBeenCalledWith('/login')
  },
  tags: interaction,
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
  tags: interaction,
}

export const BackToLoginOnlyWithHrefWhenSent: Story = {
  args: { loginHref: undefined, renderLink: fn(renderAnchor), sent: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
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

export const PageFrameWhenSent: Story = {
  args: { sent: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    const logo = canvas.getByText('Acme')
    const card = canvasElement.querySelector('[data-slot="card"]')
    await expect(card).not.toBeNull()
    await expect(card?.contains(logo)).toBe(false)
    await expect(canvas.getByRole('main')).toContainElement(logo)
  },
  tags: interaction,
}
