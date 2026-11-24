import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetPassword6 } from '@tc96/ui/blocks/application/auth/reset-password-6'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { gradientMedia } from '../login-6/login-6-layouts.tsx'

const meta = {
  args: { onSubmit: fn() },
  component: ResetPassword6,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ResetPassword/ResetPassword6/Behavior',
} satisfies Meta<typeof ResetPassword6>

export default meta

type Story = StoryObj<typeof meta>

export const PageHeading: Story = {
  args: { media: gradientMedia },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Redefinir senha' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('complementary', { name: 'Apresentação do produto' }),
    ).not.toBeNull()
  },
}

export const SubmitSendsPassword: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Nova senha'), 'Segredo#123')
    await userEvent.type(
      canvas.getByLabelText('Confirmar senha'),
      'Segredo#123{Enter}',
    )
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({
      password: 'Segredo#123',
    })
  },
}

export const MismatchBlocksSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Nova senha'), 'Segredo#123')
    await userEvent.type(
      canvas.getByLabelText('Confirmar senha'),
      'Outra#123{Enter}',
    )
    await waitFor(() =>
      expect(canvas.getByLabelText('Confirmar senha')).toHaveAttribute(
        'aria-invalid',
        'true',
      ),
    )
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const BackToLoginLink: Story = {
  args: { loginHref: '/login' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Voltar para entrar' }),
    ).toHaveAttribute('href', '/login')
  },
}
