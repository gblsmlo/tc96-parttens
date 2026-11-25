import type { Meta, StoryObj } from '@storybook/react-vite'
import { signupControlArgs } from './signup-1-controls.ts'
import { ComposedSignup } from './signup-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register1/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const CreateAccount: Story = {
  render: () => <ComposedSignup {...signupControlArgs} />,
}

export const EmailInUse: Story = {
  render: () => (
    <ComposedSignup
      {...signupControlArgs}
      emailError="Este e-mail já está em uso."
    />
  ),
}

export const WeakPassword: Story = {
  render: () => (
    <ComposedSignup
      {...signupControlArgs}
      passwordError="Escolha uma senha mais forte."
    />
  ),
}

export const MissingName: Story = {
  render: () => (
    <ComposedSignup
      {...signupControlArgs}
      nameError="Informe o nome completo."
    />
  ),
}

export const CreationFailed: Story = {
  render: () => (
    <ComposedSignup
      {...signupControlArgs}
      error="Não foi possível criar a conta. Tente novamente."
    />
  ),
}

export const CreatingAccount: Story = {
  render: () => <ComposedSignup {...signupControlArgs} pending />,
}

export const StrictPasswordPolicy: Story = {
  render: () => (
    <ComposedSignup
      {...signupControlArgs}
      passwordMinLength={12}
      suggestions="numberAndSymbol"
    />
  ),
}
