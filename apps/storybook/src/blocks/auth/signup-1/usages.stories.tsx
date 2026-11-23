import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { signupControlArgs } from './signup-1-controls.ts'
import { ComposedSignup } from './signup-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Signup1/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const CreateAccount: Story = {
  render: () => <ComposedSignup {...signupControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Criar conta' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Termos de Uso' }),
    ).toBeVisible()
    await expect(canvas.getByRole('link', { name: 'Entrar' })).toBeVisible()
  },
}

export const EmailInUse: Story = {
  render: () => (
    <ComposedSignup
      {...signupControlArgs}
      emailError="Este e-mail já está em uso."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Este e-mail já está em uso.'),
    ).toBeVisible()
  },
}

export const WeakPassword: Story = {
  render: () => (
    <ComposedSignup
      {...signupControlArgs}
      passwordError="Escolha uma senha mais forte."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Escolha uma senha mais forte.'),
    ).toBeVisible()
  },
}

export const MissingName: Story = {
  render: () => (
    <ComposedSignup
      {...signupControlArgs}
      nameError="Informe o nome completo."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Informe o nome completo.'),
    ).toBeVisible()
  },
}

export const CreationFailed: Story = {
  render: () => (
    <ComposedSignup
      {...signupControlArgs}
      error="Não foi possível criar a conta. Tente novamente."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'Não foi possível criar a conta. Tente novamente.',
    )
  },
}

export const CreatingAccount: Story = {
  render: () => <ComposedSignup {...signupControlArgs} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Criando conta…' }),
    ).toBeDisabled()
  },
}

export const StrictPasswordPolicy: Story = {
  render: () => (
    <ComposedSignup
      {...signupControlArgs}
      passwordMinLength={12}
      suggestions="numberAndSymbol"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('0 de 12 caracteres'),
    ).toBeVisible()
  },
}
