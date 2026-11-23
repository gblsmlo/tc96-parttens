import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ResetPassword2,
  type ResetPassword2Props,
} from '@tc96/blocks/application/auth/reset-password-2'
import { Button } from '@tc96/ui/button'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { authLogo } from './fixtures/auth-data'

const usage = `
// npx @tc96/parttens add reset-password-2
import { ResetPassword2 } from '@acme/blocks/application/auth/reset-password-2'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

// the block runs no timer: the app counts and passes the seconds left
function useSecondsLeft(deadline: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return Math.max(0, Math.ceil((deadline - now) / 1000))
}

// the reset token and both deadlines come from the app, never from the block
const expiresIn = useSecondsLeft(link.expiresAt)
const requestNewLinkIn = useSecondsLeft(link.nextRequestAt)

<ResetPassword2
  error={error}
  expiresIn={expiresIn}
  fieldErrors={fieldErrors}
  loginHref="/login"
  logo={<Logo />}
  onRequestNewLink={() => requestNewLink()}
  onSubmit={({ password }) => resetPassword(token, password)}
  pending={isPending}
  renderLink={(href) => <Link to={href} />}
  requestNewLinkIn={requestNewLinkIn}
/>
`

const docs = {
  api: [
    {
      description:
        'Root component. The whole page: a `main` landmark that centers its content in the window height, the optional `logo` above a COSS `Card`, and inside it the title (an `h1`), the description, the form message, the form and the footer. Mount it on the route and do not wrap it in another `main`. It is `ResetPassword1` plus a validity timer for the reset link: without `expiresIn` it behaves exactly like it. The password change, the session and the redirect after it stay in the app: the block only calls `onSubmit` and `onRequestNewLink`.',
      name: 'ResetPassword2',
    },
    {
      description:
        '`number`, seconds left on the reset link. The app counts it down and passes the new value on every tick; the block runs no timer. While it is above zero, the block shows `labels.linkExpiresIn` with the time as `m:ss` (581 is `9:41`) above the form, as plain text outside any `aria-live` region, so a screen reader does not read it every second. When it reaches zero (or less) the form is replaced, inside the same card, by the expired state: the title `labels.expiredTitle` (an `h1`) takes focus, `labels.expiredDescription` explains it, and the back to login link stays. Missing means no timer and no expired state.',
      name: 'expiresIn',
    },
    {
      description:
        '`(() => void)`. The request button of the expired state, named by `labels.requestNewLink`. It renders only when passed and only in the expired state. It calls `onRequestNewLink()`, never while `pending` and never while `requestNewLinkIn` is above zero. What a new request does (send an e-mail, restart the timers) stays in the app.',
      name: 'onRequestNewLink',
    },
    {
      description:
        '`number`, seconds left before another request is allowed, counted by the app like `expiresIn`. While it is above zero the request button is disabled and reads `labels.requestNewLinkIn` with the time as `m:ss`, as plain text outside any `aria-live` region; at zero or when missing it is enabled.',
      name: 'requestNewLinkIn',
    },
    {
      description:
        '`(values: ResetPassword2Values) => void`, with `password` only. The confirmation adds nothing to the values. It runs only after the native constraints pass (`required` and `minLength`), only when the password and the confirmation match, never while `pending` and never in the expired state, where there is no form. The return value is ignored.',
      name: 'onSubmit',
    },
    {
      description:
        'There is no token prop, no token field and no token in the values. The reset token belongs to the app: it reads it from the route and sends it with the new password. The block neither reads, validates nor keeps it.',
      name: 'token',
    },
    {
      description:
        '`number`, default `8`. The minimum password length: the native `minLength` constraint and the `n of N characters` feedback under the new password field.',
      name: 'passwordMinLength',
    },
    {
      description:
        '`AuthPasswordSuggestion[]`, default `lowercase`, `uppercase`, `number` and `symbol`. The character types the feedback suggests; they are advice and never block the submit. An empty list hides them.',
      name: 'passwordSuggestions',
    },
    {
      description:
        '`boolean`. Disables the submit button and shows `labels.submitPending`, sets `aria-busy` on the form and disables the request button of the expired state. `onSubmit` and `onRequestNewLink` are not called while it is true. The app owns this state.',
      name: 'pending',
    },
    {
      description:
        '`string`. A message for the whole form, shown in a COSS `Alert` with `role="alert"` and the title `labels.errorTitle`, in the form and in the expired state. When it goes from empty to filled and no field is invalid, focus moves to the alert.',
      name: 'error',
    },
    {
      description:
        '`Partial<Record<keyof ResetPassword2Values, string>>`. A message for `password`, shown in `FieldError` and tied to the field with `aria-invalid`. When it goes from empty to filled, focus moves to the field.',
      name: 'fieldErrors',
    },
    {
      description:
        '`loginHref`. The footer link back to the sign in page, named by `labels.backToLogin`, in the form and in the expired state. It renders only when passed. `renderLink` is `(href) => ReactElement`: every link renders through it; the default is a plain `a` (`renderAnchor` from `@tc96/ui/render-anchor`).',
      name: 'loginHref',
    },
    {
      description:
        '`ReactNode`. Rendered above the card, outside it, centered. Nothing is rendered in its place when it is missing.',
      name: 'logo',
    },
    {
      description:
        "Partial `ResetPassword2Labels`. Every visible or accessible text the block owns, with pt-BR defaults, including the countdown texts (`linkExpiresIn`, `requestNewLinkIn`, which receive the time as `m:ss`), the expired state, the one-minute announcement (`expiringSoon`), the show and hide password texts and the password feedback texts. The messages of the native constraints are the browser's own.",
      name: 'labels',
    },
  ],
  description: {
    component:
      'A reset password page whose link has a validity timer the app controls: a new password with live feedback and a confirmation, the time left above the form, and an expired state with a request for a new link when the time runs out. The block runs no timer. Install it with `npx @tc96/parttens add reset-password-2`.',
  },
  story: { height: '48rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    expiresIn: 581,
    loginHref: '/login',
    logo: authLogo,
    onRequestNewLink: fn(),
    onSubmit: fn(),
  },
  component: ResetPassword2,
  parameters: { docs, layout: 'fullscreen' },
  title: 'Blocks/Application/Auth/ResetPassword2',
} satisfies Meta<typeof ResetPassword2>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!autodocs']

const password = 'segredo123'

const expiringSoon = 'Falta menos de um minuto para este link expirar.'

type Canvas = ReturnType<typeof within>

const passwordField = (canvas: Canvas) => canvas.getByLabelText('Nova senha')

const confirmField = (canvas: Canvas) =>
  canvas.getByLabelText('Confirmar senha')

const submitButton = (canvas: Canvas) =>
  canvas.getByRole('button', { name: 'Redefinir senha' })

const countdown = (canvas: Canvas, time: string) =>
  canvas.getByText(`Este link expira em ${time}`)

const expiredTitle = (canvas: Canvas) =>
  canvas.getByRole('heading', { level: 1, name: 'Link expirado' })

const requestButton = (canvas: Canvas, name = 'Solicitar novo link') =>
  canvas.getByRole('button', { name })

async function fillPasswords(canvas: Canvas, confirmation = password) {
  await userEvent.type(passwordField(canvas), password)
  await userEvent.type(confirmField(canvas), confirmation)
}

function ConsumerTimer(props: Readonly<ResetPassword2Props>) {
  const [expiresIn, setExpiresIn] = useState(props.expiresIn ?? 125)
  return (
    <>
      <ResetPassword2
        {...props}
        expiresIn={expiresIn}
        onRequestNewLink={() => {
          props.onRequestNewLink?.()
          setExpiresIn(125)
        }}
      />
      <section
        aria-label="Simulação do consumidor"
        className="fixed right-4 bottom-4 z-10"
      >
        <Button
          onClick={() => setExpiresIn((seconds) => Math.max(0, seconds - 30))}
          size="sm"
          type="button"
          variant="outline"
        >
          Avançar 30 s
        </Button>
      </section>
    </>
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
    await expect(countdown(canvas, '9:41')).toBeVisible()
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
  args: {
    expiresIn: undefined,
    loginHref: undefined,
    logo: undefined,
    onRequestNewLink: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Only the required prop: no timer, no logo and no link. The block is the same page as `ResetPassword1`.',
      },
    },
  },
}

export const Expired: Story = {
  args: { expiresIn: 0 },
  parameters: {
    docs: {
      description: {
        story:
          'The link ran out: the form is replaced by the expired state, with the request for a new link and the way back to sign in.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(expiredTitle(canvas)).toBeVisible()
    await expect(
      canvas.getByText(
        'Este link de redefinição expirou. Solicite um novo para continuar.',
      ),
    ).toBeVisible()
    await expect(requestButton(canvas)).toBeEnabled()
  },
}

export const RequestCooldown: Story = {
  args: { expiresIn: 0, requestNewLinkIn: 45 },
  parameters: {
    docs: {
      description: {
        story:
          'Another request is not allowed yet: the button is disabled and shows the time the app counts down.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      requestButton(canvas, 'Solicitar novamente em 0:45'),
    ).toBeDisabled()
  },
}

export const CountdownIsFormatted: Story = {
  args: { expiresIn: 581 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(countdown(canvas, '9:41')).toBeVisible()
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
  },
  tags: interaction,
}

export const CountdownIsPlainText: Story = {
  args: { expiresIn: 581 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(countdown(canvas, '9:41').closest('[aria-live]')).toBeNull()
    await expect(canvas.queryByText(expiringSoon)).toBeNull()
  },
  tags: interaction,
}

export const AnnouncesWhenOneMinuteIsLeft: Story = {
  args: { expiresIn: 59 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(countdown(canvas, '0:59').closest('[aria-live]')).toBeNull()
    await expect(
      canvas.getByText(expiringSoon).closest('[aria-live="polite"]'),
    ).not.toBeNull()
  },
  tags: interaction,
}

export const WithoutExpiresInItBehavesLikeResetPassword1: Story = {
  args: { expiresIn: undefined },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText(/Este link expira em/)).toBeNull()
    await expect(canvas.queryByText(expiringSoon)).toBeNull()
    await expect(canvas.queryByText('Link expirado')).toBeNull()
    await fillPasswords(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ password })
  },
  tags: interaction,
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

export const MismatchBlocksSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillPasswords(canvas, `${password}x`)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(confirmField(canvas)).toHaveFocus())
    await expect(canvas.getByText('As senhas não coincidem.')).toBeVisible()
    await expect(confirmField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(args.onSubmit).not.toHaveBeenCalled()
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
    await userEvent.click(showPassword)
    await expect(passwordField(canvas)).toHaveAttribute('type', 'text')
    await expect(confirmField(canvas)).toHaveAttribute('type', 'password')
    await userEvent.click(showConfirmation)
    await expect(confirmField(canvas)).toHaveAttribute('type', 'text')
    await expect(
      canvas.getAllByRole('button', { name: 'Ocultar senha' }),
    ).toHaveLength(2)
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const ExpiredReplacesTheForm: Story = {
  args: { expiresIn: 0 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(expiredTitle(canvas)).toBeVisible()
    await expect(
      canvas.queryByRole('heading', { name: 'Redefinir senha' }),
    ).toBeNull()
    await expect(canvas.queryByLabelText('Nova senha')).toBeNull()
    await expect(canvas.queryByLabelText('Confirmar senha')).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Redefinir senha' }),
    ).toBeNull()
    await expect(canvasElement.querySelector('[data-slot="form"]')).toBeNull()
    await expect(canvas.queryByText(/Este link expira em/)).toBeNull()
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const ConsumerCountsDownToExpiry: Story = {
  args: { expiresIn: 125 },
  render: (args) => <ConsumerTimer {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const tick = () =>
      userEvent.click(canvas.getByRole('button', { name: 'Avançar 30 s' }))
    await expect(countdown(canvas, '2:05')).toBeVisible()
    await tick()
    await expect(countdown(canvas, '1:35')).toBeVisible()
    await expect(canvas.queryByText(expiringSoon)).toBeNull()
    await tick()
    await expect(countdown(canvas, '1:05')).toBeVisible()
    await tick()
    await expect(countdown(canvas, '0:35')).toBeVisible()
    await expect(
      canvas.getByText(expiringSoon).closest('[aria-live="polite"]'),
    ).not.toBeNull()
    await tick()
    await expect(countdown(canvas, '0:05')).toBeVisible()
    await tick()
    const title = await canvas.findByRole('heading', {
      level: 1,
      name: 'Link expirado',
    })
    await waitFor(() => expect(title).toHaveFocus())
    await expect(title).toHaveAttribute('tabindex', '-1')
    await expect(canvas.queryByLabelText('Nova senha')).toBeNull()
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await userEvent.click(requestButton(canvas))
    await expect(args.onRequestNewLink).toHaveBeenCalledOnce()
    await expect(
      await canvas.findByRole('heading', { level: 1, name: 'Redefinir senha' }),
    ).toBeVisible()
    await expect(countdown(canvas, '2:05')).toBeVisible()
  },
  tags: interaction,
}

export const RequestNewLinkCallsTheHandler: Story = {
  args: { expiresIn: 0 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(requestButton(canvas))
    await expect(args.onRequestNewLink).toHaveBeenCalledOnce()
  },
  tags: interaction,
}

export const RequestNewLinkDisabledWhileCounting: Story = {
  args: { expiresIn: 0, requestNewLinkIn: 45 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const request = requestButton(canvas, 'Solicitar novamente em 0:45')
    await expect(request).toBeDisabled()
    await expect(request.closest('[aria-live]')).toBeNull()
    await expect(canvas.queryByText('Solicitar novo link')).toBeNull()
    await userEvent.click(request, { pointerEventsCheck: 0 })
    await expect(args.onRequestNewLink).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const RequestNewLinkEnabledAtZero: Story = {
  args: { expiresIn: 0, requestNewLinkIn: 0 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const request = requestButton(canvas)
    await expect(request).toBeEnabled()
    await userEvent.click(request)
    await expect(args.onRequestNewLink).toHaveBeenCalledOnce()
  },
  tags: interaction,
}

export const RequestNewLinkOnlyWithHandler: Story = {
  args: { expiresIn: 0, onRequestNewLink: undefined, requestNewLinkIn: 45 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(expiredTitle(canvas)).toBeVisible()
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(
      canvas.getByRole('link', { name: 'Voltar para entrar' }),
    ).toBeVisible()
  },
  tags: interaction,
}

export const PendingBlocksRequestNewLink: Story = {
  args: { expiresIn: 0, pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const request = requestButton(canvas)
    await expect(request).toBeDisabled()
    await userEvent.click(request, { pointerEventsCheck: 0 })
    await expect(args.onRequestNewLink).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const ErrorStaysInExpiredState: Story = {
  args: {
    error: 'Não foi possível enviar o link. Tente novamente.',
    expiresIn: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(expiredTitle(canvas)).toBeVisible()
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Não foi possível enviar o link. Tente novamente.',
    )
  },
  tags: interaction,
}

export const BackToLoginWhileCounting: Story = {
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

export const BackToLoginWhenExpired: Story = {
  args: { expiresIn: 0, renderLink: fn(renderAnchor) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Voltar para entrar' }),
    ).toHaveAttribute('href', '/login')
    await expect(args.renderLink).toHaveBeenCalledWith('/login')
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
    await expect(canvas.getByRole('main')).toContainElement(logo)
  },
  tags: interaction,
}
