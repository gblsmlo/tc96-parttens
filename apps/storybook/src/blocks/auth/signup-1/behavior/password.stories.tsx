import type { Meta, StoryObj } from '@storybook/react-vite'
import { Signup1 } from '@tc96/blocks/auth/signup-1'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo, authProviders } from '../../fixtures/auth-data'
import {
  confirmField,
  email,
  fillAccount,
  fillIdentity,
  name,
  password,
  passwordField,
  submitButton,
} from '../signup-1-play.ts'

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
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Register/Register1/Behavior',
} satisfies Meta<typeof Signup1>

export default meta

type Story = StoryObj<typeof meta>

const feedback = (canvasElement: HTMLElement) =>
  within(
    canvasElement.querySelector<HTMLElement>(
      '[data-slot="field-description"]',
    ) as HTMLElement,
  )

const announcement = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[aria-live="polite"]')

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
}

export const PasswordRulesApply: Story = {
  args: { passwordMinLength: 12, passwordSuggestions: ['number', 'symbol'] },
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
}
