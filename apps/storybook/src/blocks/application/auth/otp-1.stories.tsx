import type { Meta, StoryObj } from '@storybook/react-vite'
import { Otp1, type OtpProps } from '@tc96/blocks/application/auth/otp-1'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { authLogo } from './fixtures/auth-data'

const usage = `
// npx @tc96/parttens add otp-1
import { Otp1 } from '@acme/blocks/application/auth/otp-1'

<Otp1
  destination="ana@acme.com"
  error={error}
  fieldErrors={fieldErrors}
  logo={<Logo />}
  onComplete={(code) => console.log('complete', code.length)}
  onResend={() => resendCode()}
  onSubmit={({ code }) => verifyCode(code)}
  pending={isVerifying}
  resendIn={secondsLeft}
/>
`

const docs = {
  api: [
    {
      description:
        'Root component. The whole page: a `main` landmark that centers its content in the window height, the optional `logo` above a COSS `Card`, and inside it the title (an `h1`), the description, the form message, the code field, the Verificar button and the resend footer. Mount it on the route and do not wrap it in another `main`. Verifying the code, the session and the redirect stay in the app: the block only calls `onSubmit`, `onComplete` and `onResend`.',
      name: 'Otp1',
    },
    {
      description:
        '`(values: OtpValues) => void`, with the `code` string. It runs only from the Verificar button or Enter, only with a complete code and never while `pending`. Completing the code does not send it: there is no auto-submit. The return value is ignored.',
      name: 'onSubmit',
    },
    {
      description:
        '`(code: string) => void`. Optional. A notification that the code reached `length` digits, once each time it becomes complete (typing, autofill or paste). It does not submit the form; use it to enable something else or to track progress.',
      name: 'onComplete',
    },
    {
      description:
        '`number`, default `6`. The number of digits. Each one is its own input named by `labels.digit(position, length)`, the first one included. The first input carries `autocomplete="one-time-code"`, so the browser and the password manager can fill the whole code.',
      name: 'length',
    },
    {
      description:
        '`onResend` and `resendIn`. The resend button renders only when `onResend` is passed. `resendIn` is the number of seconds the app counts down: while it is above zero the button is disabled and shows `labels.resendIn(seconds)`; at zero or when missing it shows `labels.resend` and calls `onResend()`. The block runs no timer and the countdown is plain text, outside any `aria-live` region.',
      name: 'onResend',
    },
    {
      description:
        '`string`. Optional. Where the code was sent (an e-mail or a phone), shown in the description through `labels.description(length, destination)`. Without it the description does not mention the destination.',
      name: 'destination',
    },
    {
      description:
        '`boolean`. Disables the Verificar button and shows `labels.submitPending`, sets `aria-busy` on the form and disables the resend button. `onSubmit` and `onResend` are not called while it is true, Enter included. The app owns this state.',
      name: 'pending',
    },
    {
      description:
        '`string`. A message for the whole form, shown in a COSS `Alert` with `role="alert"` and the title `labels.errorTitle`. When it goes from empty to filled and no field is invalid, focus moves to the alert. The text is rendered as text, never as HTML.',
      name: 'error',
    },
    {
      description:
        '`Partial<Record<keyof OtpValues, string>>`, that is `code`. The message is shown in `FieldError`, every digit is marked `aria-invalid` and the group is described by it. When it goes from empty to filled, focus moves to the first digit. The message clears when the user edits the code.',
      name: 'fieldErrors',
    },
    {
      description:
        '`ReactNode`. Rendered above the card, outside it, centered. Nothing is rendered in its place when it is missing.',
      name: 'logo',
    },
    {
      description:
        "Partial `OtpLabels`. Every visible or accessible text the block owns, with pt-BR defaults, including `digit(position, total)`. The messages of the native constraints (`required`, the digits pattern) are the browser's own. `renderLink` is accepted for the shared contract, and this block renders no link.",
      name: 'labels',
    },
  ],
  description: {
    component:
      'A verification page: one input per digit, a Verificar button that is the only way to send the code, and an optional resend with a countdown the app controls, inside a centered card. Install it with `npx @tc96/parttens add otp-1`.',
  },
  story: { height: '40rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    destination: 'ana@acme.com',
    logo: authLogo,
    onComplete: fn(),
    onResend: fn(),
    onSubmit: fn(),
  },
  component: Otp1,
  parameters: { docs, layout: 'fullscreen' },
  title: 'Blocks/Application/Auth/Otp1',
} satisfies Meta<typeof Otp1>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!autodocs']

const code = '123456'

type Canvas = ReturnType<typeof within>

const digitField = (canvas: Canvas, position: number, total = 6) =>
  canvas.getByRole('textbox', { name: `Dígito ${position} de ${total}` })

const submitButton = (canvas: Canvas) =>
  canvas.getByRole('button', { name: 'Verificar' })

async function typeCode(canvas: Canvas, value = code, total = 6) {
  await userEvent.type(digitField(canvas, 1, total), value)
}

function FailingOtp(props: Readonly<OtpProps>) {
  const [error, setError] = useState<string>()
  return (
    <Otp1
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('Não foi possível verificar o código. Tente novamente.')
      }}
    />
  )
}

function RejectedOtp(props: Readonly<OtpProps>) {
  const [fieldErrors, setFieldErrors] = useState<OtpProps['fieldErrors']>()
  return (
    <Otp1
      {...props}
      fieldErrors={fieldErrors}
      onSubmit={(values) => {
        props.onSubmit(values)
        setFieldErrors({ code: 'O código está incorreto ou expirou.' })
      }}
    />
  )
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Verifique seu código' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Enviamos um código de 6 dígitos para ana@acme.com.'),
    ).toBeVisible()
    await expect(canvas.getAllByRole('textbox')).toHaveLength(6)
    await expect(digitField(canvas, 1)).toHaveAttribute(
      'autocomplete',
      'one-time-code',
    )
    await expect(
      canvas.getByRole('group', { name: 'Código de verificação' }),
    ).toBeVisible()
    await expect(submitButton(canvas)).toHaveAttribute('type', 'submit')
  },
}

export const Minimal: Story = {
  args: {
    destination: undefined,
    logo: undefined,
    onComplete: undefined,
    onResend: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Enviamos um código de 6 dígitos.'),
    ).toBeVisible()
    await expect(submitButton(canvas)).toBeVisible()
  },
  parameters: {
    docs: {
      description: {
        story:
          'Only the required prop: no logo, destination, resend or completion callback. The card keeps the title, the digits and the Verificar button.',
      },
    },
  },
}

export const CustomLength: Story = {
  args: { length: 4 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('textbox')).toHaveLength(4)
    await expect(digitField(canvas, 4, 4)).toBeVisible()
    await expect(
      canvas.getByText('Enviamos um código de 4 dígitos para ana@acme.com.'),
    ).toBeVisible()
    await typeCode(canvas, '1234{Enter}', 4)
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ code: '1234' })
  },
  tags: interaction,
}

export const DigitLabels: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const inputs = canvas.getAllByRole('textbox')
    await expect(inputs).toHaveLength(6)
    for (const [index, input] of inputs.entries()) {
      await expect(input).toHaveAccessibleName(`Dígito ${index + 1} de 6`)
    }
  },
  tags: interaction,
}

export const CompleteNotifiesWithoutSubmitting: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await typeCode(canvas, '12345')
    await expect(args.onComplete).not.toHaveBeenCalled()
    await userEvent.keyboard('6')
    await waitFor(() => expect(args.onComplete).toHaveBeenCalledOnce())
    await expect(args.onComplete).toHaveBeenCalledWith(code)
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const SubmitSendsCode: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await typeCode(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ code })
  },
  tags: interaction,
}

export const EnterSubmits: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await typeCode(canvas, `${code}{Enter}`)
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ code })
  },
  tags: interaction,
}

export const IncompleteCodeDoesNotSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const fieldError = () =>
      canvasElement.querySelector<HTMLElement>('[data-slot="field-error"]')
    await expect(fieldError()).toBeNull()
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(digitField(canvas, 1)).toHaveFocus())
    await waitFor(() => expect(fieldError()).toBeVisible())
    await expect(fieldError()?.textContent).not.toBe('')
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await userEvent.type(digitField(canvas, 1), '123')
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(digitField(canvas, 1)).toHaveFocus())
    await waitFor(() => expect(fieldError()).toBeVisible())
    await expect(fieldError()?.textContent).not.toBe('')
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(digitField(canvas, 1)).toHaveFocus())
    await expect(fieldError()).toBeVisible()
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await expect(args.onComplete).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const Pending: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Verificando…' })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('type', 'submit')
    await expect(
      canvasElement.querySelector('[data-slot="form"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getByRole('button', { name: 'Reenviar código' }),
    ).toBeDisabled()
    await typeCode(canvas, `${code}{Enter}`)
    await userEvent.click(submit, { pointerEventsCheck: 0 })
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await expect(args.onResend).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const ResendCountdown: Story = {
  args: { resendIn: 30 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const resend = canvas.getByRole('button', { name: 'Reenviar em 30s' })
    await expect(resend).toBeDisabled()
    await expect(resend.closest('[aria-live]')).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Reenviar código' }),
    ).toBe(null)
    await userEvent.click(resend, { pointerEventsCheck: 0 })
    await expect(args.onResend).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const ResendEnabled: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Não recebeu o código?')).toBeVisible()
    const resend = canvas.getByRole('button', { name: 'Reenviar código' })
    await expect(resend).toBeEnabled()
    await userEvent.click(resend)
    await expect(args.onResend).toHaveBeenCalledOnce()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
  tags: interaction,
}

export const ResendAtZero: Story = {
  args: { resendIn: 0 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const resend = canvas.getByRole('button', { name: 'Reenviar código' })
    await expect(resend).toBeEnabled()
    await userEvent.click(resend)
    await expect(args.onResend).toHaveBeenCalledOnce()
  },
  tags: interaction,
}

export const ResendOnlyWithHandler: Story = {
  args: { onResend: undefined, resendIn: 30 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('Não recebeu o código?')).toBeNull()
    await expect(canvas.queryByText('Reenviar em 30s')).toBeNull()
    await expect(canvas.getAllByRole('button')).toHaveLength(1)
  },
  tags: interaction,
}

export const FieldErrors: Story = {
  args: { fieldErrors: { code: 'O código está incorreto ou expirou.' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const input of canvas.getAllByRole('textbox'))
      await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(
      canvas.getByText('O código está incorreto ou expirou.'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('group', { name: 'Código de verificação' }),
    ).toHaveAccessibleDescription('O código está incorreto ou expirou.')
  },
  tags: interaction,
}

export const FieldErrorsFocusFirstDigit: Story = {
  render: (args) => <RejectedOtp {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await typeCode(canvas)
    await userEvent.click(submitButton(canvas))
    await canvas.findByText('O código está incorreto ou expirou.')
    await waitFor(() => expect(digitField(canvas, 1)).toHaveFocus())
    await expect(digitField(canvas, 1)).toHaveAttribute('aria-invalid', 'true')
  },
  tags: interaction,
}

export const ErrorMessage: Story = {
  args: { error: 'Não foi possível verificar o código. Tente novamente.' },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveTextContent('Não foi possível continuar')
    await expect(alert).toHaveTextContent(
      'Não foi possível verificar o código. Tente novamente.',
    )
  },
  tags: interaction,
}

export const ErrorFocusesAlert: Story = {
  render: (args) => <FailingOtp {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('alert')).toBeNull()
    await typeCode(canvas)
    await userEvent.click(submitButton(canvas))
    const alert = await canvas.findByRole('alert')
    await waitFor(() => expect(alert).toHaveFocus())
    await expect(alert).toHaveTextContent(
      'Não foi possível verificar o código. Tente novamente.',
    )
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
