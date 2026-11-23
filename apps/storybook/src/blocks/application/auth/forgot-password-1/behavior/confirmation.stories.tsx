import type { Meta, StoryObj } from '@storybook/react-vite'
import { ForgotPassword1 } from '@tc96/blocks/application/auth/forgot-password-1'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo } from '../../fixtures/auth-data'
import { SendingForgotPassword } from '../forgot-password-1-layouts.tsx'
import {
  email,
  emailField,
  sentDescription,
  sentTitle,
  submitButton,
} from '../forgot-password-1-play.ts'

const meta = {
  args: {
    destination: 'ana@acme.com',
    loginHref: '/login',
    logo: authLogo,
    onResend: fn(),
    onSubmit: fn(),
    sent: true,
  },
  component: ForgotPassword1,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ForgotPassword1/Behavior',
} satisfies Meta<typeof ForgotPassword1>

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
}

export const SentOnMountDoesNotTakeFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(sentTitle(canvas)).not.toHaveFocus()
  },
}

export const DestinationInConfirmation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(sentDescription)).toBeVisible()
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
  args: { error: 'Não foi possível reenviar o e-mail. Tente novamente.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Não foi possível reenviar o e-mail. Tente novamente.',
    )
  },
}

export const BackToLoginInTheConfirmation: Story = {
  args: { renderLink: fn(renderAnchor) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Voltar para entrar' }),
    ).toHaveAttribute('href', '/login')
    await expect(args.renderLink).toHaveBeenCalledWith('/login')
  },
}

export const BackToLoginOnlyWithHrefWhenSent: Story = {
  args: { loginHref: undefined, renderLink: fn(renderAnchor) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.queryByText('Voltar para entrar')).toBeNull()
    await expect(args.renderLink).not.toHaveBeenCalled()
  },
}

export const PageFrameWhenSent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    const logo = canvas.getByText('Acme')
    const card = canvasElement.querySelector('[data-slot="card"]')
    await expect(card).not.toBeNull()
    await expect(card?.contains(logo)).toBe(false)
    await expect(canvas.getByRole('main')).toContainElement(logo)
  },
}
