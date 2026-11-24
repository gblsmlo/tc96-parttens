import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetPassword1 } from '@tc96/ui/blocks/application/auth/reset-password-1'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo } from '../../fixtures/auth-data'
import {
  announcement,
  confirmField,
  feedback,
  fillPasswords,
  password,
  passwordField,
  submitButton,
} from '../reset-password-1-play.ts'

const meta = {
  args: {
    loginHref: '/login',
    logo: authLogo,
    onSubmit: fn(),
  },
  component: ResetPassword1,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ResetPassword/ResetPassword1/Behavior',
} satisfies Meta<typeof ResetPassword1>

export default meta

type Story = StoryObj<typeof meta>

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
}

export const MinLengthSetsConstraintAndFeedback: Story = {
  args: { passwordMinLength: 12 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(passwordField(canvas)).toHaveAttribute('minlength', '12')
  },
}

export const SuggestionsCanBeNarrowed: Story = {
  args: { passwordSuggestions: ['number', 'symbol'] },
  play: async ({ canvasElement }) => {
    await expect(feedback(canvasElement).getByText('número')).toBeVisible()
    await expect(feedback(canvasElement).getByText('símbolo')).toBeVisible()
    await expect(feedback(canvasElement).queryByText('minúscula')).toBeNull()
    await expect(feedback(canvasElement).queryByText('maiúscula')).toBeNull()
  },
}

export const EmptySuggestionsHideTheList: Story = {
  args: { passwordSuggestions: [] },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="field-description"] li'),
    ).toBeNull()
  },
}

export const FeedbackUpdatesWhileTyping: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const item = (text: string) =>
      feedback(canvasElement).getByText(text).closest('li') as HTMLElement
    for (const text of ['minúscula', 'maiúscula', 'número', 'símbolo']) {
      await expect(item(text)).toHaveTextContent('faltando')
      await expect(item(text)).not.toHaveAttribute('data-met')
    }
    await expect(passwordField(canvas)).toHaveAccessibleDescription(/minúscula/)
    await userEvent.type(passwordField(canvas), 'abc')
    await expect(item('minúscula')).toHaveTextContent('atendida')
    await expect(item('minúscula')).toHaveAttribute('data-met')
    await expect(item('maiúscula')).toHaveTextContent('faltando')
    await userEvent.type(passwordField(canvas), 'D1!')
    for (const text of ['maiúscula', 'número', 'símbolo']) {
      await expect(item(text)).toHaveTextContent('atendida')
    }
    await userEvent.type(passwordField(canvas), 'efgh')
    await userEvent.clear(passwordField(canvas))
    await expect(item('minúscula')).toHaveTextContent('faltando')
  },
}

export const FeedbackAnnouncesOnlyChanges: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(announcement(canvasElement)).toBeEmptyDOMElement()
    await userEvent.type(passwordField(canvas), 'abc')
    await expect(announcement(canvasElement)).toHaveTextContent(
      /^minúscula: atendida$/,
    )
    await userEvent.type(passwordField(canvas), 'D')
    await expect(announcement(canvasElement)).toHaveTextContent(
      /^maiúscula: atendida$/,
    )
    await userEvent.type(passwordField(canvas), 'EF')
    await expect(announcement(canvasElement)).toHaveTextContent(
      /^maiúscula: atendida$/,
    )
  },
}

export const FeedbackDoesNotBlockSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const weak = '12345678'
    await userEvent.type(passwordField(canvas), weak)
    await userEvent.type(confirmField(canvas), weak)
    await expect(
      feedback(canvasElement).getByText('minúscula').closest('li'),
    ).toHaveTextContent('faltando')
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ password: weak })
  },
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
}
