import type { Meta, StoryObj } from '@storybook/react-vite'
import { Otp1, type OtpProps } from '@tc96/blocks/auth/otp-1'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'

const meta = {
  args: {
    destination: 'ana@acme.com',
    logo: authLogo,
    onComplete: fn(),
    onResend: fn(),
    onSubmit: fn(),
  },
  component: Otp1,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Otp1/Behavior',
} satisfies Meta<typeof Otp1>

export default meta

type Story = StoryObj<typeof meta>

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

export const PageHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Verifique seu código' }),
    ).toBeVisible()
  },
}

export const DescriptionNamesDestination: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Enviamos um código de 6 dígitos para ana@acme.com.',
      ),
    ).toBeVisible()
  },
}

export const DescriptionWithoutDestination: Story = {
  args: { destination: undefined },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Enviamos um código de 6 dígitos.'),
    ).toBeVisible()
  },
}

export const OneInputPerDigit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('textbox')).toHaveLength(6)
    await expect(digitField(canvas, 1)).toHaveAttribute(
      'autocomplete',
      'one-time-code',
    )
    await expect(
      canvas.getByRole('group', { name: 'Código de verificação' }),
    ).toBeVisible()
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
}

export const LabelsOverrideDefaults: Story = {
  args: { labels: { submit: 'Confirmar', title: 'Confirme seu código' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Confirme seu código' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Confirmar' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Verificar' })).toBeNull()
  },
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
}

export const SubmitSendsCode: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await typeCode(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ code })
  },
}

export const EnterSubmits: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await typeCode(canvas, `${code}{Enter}`)
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ code })
  },
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
}

export const PendingBlocksActions: Story = {
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
}

export const ResendOnlyWithHandler: Story = {
  args: { onResend: undefined, resendIn: 30 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('Não recebeu o código?')).toBeNull()
    await expect(canvas.queryByText('Reenviar em 30s')).toBeNull()
    await expect(canvas.getAllByRole('button')).toHaveLength(1)
  },
}

export const FieldErrorsMarkDigits: Story = {
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
}

export const ErrorShowsAlert: Story = {
  args: { error: 'Não foi possível verificar o código. Tente novamente.' },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveTextContent('Não foi possível continuar')
    await expect(alert).toHaveTextContent(
      'Não foi possível verificar o código. Tente novamente.',
    )
  },
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
}
