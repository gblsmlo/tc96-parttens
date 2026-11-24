import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetPassword1 } from '@tc96/blocks/auth/reset-password-1'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'
import {
  confirmField,
  fillPasswords,
  password,
  passwordField,
  submitButton,
} from './reset-password-1-play.ts'

const meta = {
  args: {
    loginHref: '/login',
    logo: authLogo,
    onSubmit: fn(),
  },
  component: ResetPassword1,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/ResetPassword/ResetPassword1/Behavior',
} satisfies Meta<typeof ResetPassword1>

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

export const LogoSitsAboveTheTitle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const logo = canvas.getByText('Acme')
    const card = canvasElement.querySelector('[data-slot="card"]')
    await expect(card).not.toBeNull()
    await expect(card).toContainElement(logo)
    await expect(
      logo.compareDocumentPosition(canvas.getByRole('heading', { level: 1 })) &
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

export const EnterSubmits: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(passwordField(canvas), password)
    await userEvent.type(confirmField(canvas), `${password}{Enter}`)
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ password })
  },
}

export const NoTokenField: Story = {
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector<HTMLFormElement>(
      '[data-slot="form"]',
    ) as HTMLFormElement
    const names = Array.from(form.elements)
      .map((element) => element.getAttribute('name'))
      .filter(Boolean)
    await expect(names).toEqual(['password', 'confirmPassword'])
    await expect(canvasElement.querySelector('input[type="hidden"]')).toBeNull()
    await expect(canvasElement.querySelector('[name*="token" i]')).toBeNull()
  },
}

export const PendingBlocksSubmit: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: /^Redefinir senha/ })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('data-loading')
    await expect(submit).toHaveAttribute('type', 'submit')
    await expect(
      canvasElement.querySelector('[data-slot="form"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await userEvent.type(passwordField(canvas), password)
    await userEvent.type(confirmField(canvas), `${password}{Enter}`)
    await userEvent.click(submit, { pointerEventsCheck: 0 })
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
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
}

export const LinkOnlyWithHref: Story = {
  args: { loginHref: undefined, renderLink: fn(renderAnchor) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.queryByText('Voltar para entrar')).toBeNull()
    await expect(args.renderLink).not.toHaveBeenCalled()
  },
}
