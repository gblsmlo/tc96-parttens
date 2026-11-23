import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetPassword2 } from '@tc96/blocks/auth/reset-password-2'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'
import {
  confirmField,
  fillPasswords,
  password,
  passwordField,
  submitButton,
} from './reset-password-2-play.ts'

const meta = {
  args: {
    expiresIn: 581,
    loginHref: '/login',
    logo: authLogo,
    onRequestNewLink: fn(),
    onSubmit: fn(),
  },
  component: ResetPassword2,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/ResetPassword/ResetPassword2/Behavior',
} satisfies Meta<typeof ResetPassword2>

export default meta

type Story = StoryObj<typeof meta>

export const TitleIsLevelOneHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Redefinir senha' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Escolha uma nova senha para a sua conta.'),
    ).toBeVisible()
  },
}

export const FieldsAreNewPasswords: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
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

export const OneMainLandmark: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('main')).toHaveLength(1)
  },
}

export const LogoSitsAboveTheCard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
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

export const SubmitSendsOnlyPassword: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillPasswords(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ password })
  },
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
}
