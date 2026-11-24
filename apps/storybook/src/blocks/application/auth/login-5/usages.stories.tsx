import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login5 } from '@tc96/ui/blocks/application/auth/login-5'
import { expect, userEvent, within } from 'storybook/test'
import { loginMethods, PickingLogin5 } from './login-5-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login5/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ChooseHowToSignIn: Story = {
  render: () => (
    <PickingLogin5 methods={loginMethods} onMethod={ignore} onSubmit={ignore} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Entrar com chave de acesso' }),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'E-mail e senha' }),
    )
    await expect(canvas.getByLabelText('E-mail')).toHaveFocus()
  },
}

export const OnlyPasskeyAndEmail: Story = {
  render: () => (
    <Login5
      methods={[loginMethods[0]]}
      onMethod={ignore}
      onSubmit={ignore}
      signupHref="/signup"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('button')).toHaveLength(2)
  },
}
