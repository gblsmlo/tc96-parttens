import type { Meta, StoryObj } from '@storybook/react-vite'
import { ForgotPassword2 } from '@tc96/blocks/auth/forgot-password-2'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { SendingForgotPassword2 } from '../forgot-password-2-layouts.tsx'
import {
  email,
  emailField,
  sentDescription,
  sentTitle,
  submitButton,
} from '../forgot-password-2-play.ts'

const meta = {
  args: { destination: 'ana@acme.com', onSubmit: fn(), sent: true },
  component: ForgotPassword2,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/ForgotPassword/ForgotPassword2/Behavior',
} satisfies Meta<typeof ForgotPassword2>

export default meta

type Story = StoryObj<typeof meta>

export const SentReplacesTheForm: Story = {
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
}

export const SentFocusesTheTitleOnTransition: Story = {
  args: { sent: false },
  render: (args) => <SendingForgotPassword2 {...args} />,
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
}

export const SentOnMountDoesNotTakeFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(sentTitle(canvas)).not.toHaveFocus()
  },
}

export const ConfirmationWithoutDestinationIsGeneric: Story = {
  args: { destination: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText(
        'Enviamos um link para redefinir a senha para o seu e-mail.',
      ),
    ).toBeVisible()
    await expect(canvas.queryByText(/ana@acme\.com/)).toBeNull()
  },
}

export const ErrorStaysInSentState: Story = {
  args: { error: 'Não foi possível enviar o e-mail. Tente novamente.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Não foi possível enviar o e-mail. Tente novamente.',
    )
  },
}

export const OnlyEssentialPartsWhenSent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}
