import type { Meta, StoryObj } from '@storybook/react-vite'
import { signup2ControlArgs } from './signup-2-controls.ts'
import { ComposedSignup2 } from './signup-2-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register2/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const CreateAccount: Story = {
  render: () => <ComposedSignup2 {...signup2ControlArgs} />,
}

export const EmailInUse: Story = {
  render: () => (
    <ComposedSignup2
      {...signup2ControlArgs}
      emailError="Este e-mail já está em uso."
    />
  ),
}

export const WeakPassword: Story = {
  render: () => (
    <ComposedSignup2
      {...signup2ControlArgs}
      passwordError="Escolha uma senha mais forte."
    />
  ),
}

export const MissingName: Story = {
  render: () => (
    <ComposedSignup2
      {...signup2ControlArgs}
      nameError="Informe o nome completo."
    />
  ),
}

export const CreationFailed: Story = {
  render: () => (
    <ComposedSignup2
      {...signup2ControlArgs}
      error="Não foi possível criar a conta. Tente novamente."
    />
  ),
}

export const CreatingAccount: Story = {
  render: () => <ComposedSignup2 {...signup2ControlArgs} pending />,
}

export const StrictPasswordPolicy: Story = {
  render: () => (
    <ComposedSignup2
      {...signup2ControlArgs}
      passwordMinLength={12}
      suggestions="numberAndSymbol"
    />
  ),
}
