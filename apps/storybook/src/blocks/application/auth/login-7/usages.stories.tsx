import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { login7ControlArgs } from './login-7-controls.ts'
import { ComposedLogin7 } from './login-7-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login7/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SignIn: Story = {
  render: () => <ComposedLogin7 {...login7ControlArgs} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', { level: 1, name: 'Entrar' }),
    ).toBeVisible()
  },
}

export const WrongCredentials: Story = {
  render: () => (
    <ComposedLogin7
      {...login7ControlArgs}
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
  render: () => <ComposedLogin7 {...login7ControlArgs} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: /^Entrar/ }),
    ).toBeDisabled()
  },
}
