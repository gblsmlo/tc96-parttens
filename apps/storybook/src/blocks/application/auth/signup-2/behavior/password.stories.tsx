import type { Meta, StoryObj } from '@storybook/react-vite'
import { Signup2 } from '@tc96/ui/blocks/application/auth/signup-2'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import {
  confirmField,
  email,
  fillAccount,
  fillIdentity,
  name,
  password,
  passwordField,
  submitButton,
} from '../signup-2-play.ts'

const meta = {
  args: { onSubmit: fn() },
  component: Signup2,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register2/Behavior',
} satisfies Meta<typeof Signup2>

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
    await expect(feedback(canvasElement).getByText('número')).toBeVisible()
    await expect(feedback(canvasElement).getByText('símbolo')).toBeVisible()
    await expect(feedback(canvasElement).queryByText('minúscula')).toBeNull()
    await expect(feedback(canvasElement).queryByText('maiúscula')).toBeNull()
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
    const tops = new Set(
      [...feedback(canvasElement).getAllByRole('listitem')].map(
        (listItem) => listItem.offsetTop,
      ),
    )
    await expect(tops.size).toBe(1)
    const list = feedback(canvasElement).getByRole('list')
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth)
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
    await fillIdentity(canvas)
    await userEvent.type(passwordField(canvas), weak)
    await userEvent.type(confirmField(canvas), weak)
    await expect(
      feedback(canvasElement).getByText('minúscula').closest('li'),
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
