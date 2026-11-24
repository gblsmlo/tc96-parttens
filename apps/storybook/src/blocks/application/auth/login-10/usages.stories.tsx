import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { login10ControlArgs } from './login-10-controls.ts'
import { ComposedLogin10 } from './login-10-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login10/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SignInWithSocialProof: Story = {
  render: () => <ComposedLogin10 {...login10ControlArgs} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', {
        level: 1,
        name: 'Bem-vindo de volta',
      }),
    ).toBeVisible()
  },
}

export const WrongCredentials: Story = {
  render: () => (
    <ComposedLogin10
      {...login10ControlArgs}
      error="E-mail ou senha incorretos."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'E-mail ou senha incorretos.',
    )
  },
}

export const SigningIn: Story = {
  render: () => <ComposedLogin10 {...login10ControlArgs} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: /^Entrar/ }),
    ).toBeDisabled()
  },
}
