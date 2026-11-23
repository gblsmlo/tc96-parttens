import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SignupControls,
  signupControlArgs,
  signupControlArgTypes,
} from './signup-1-controls.ts'
import { ComposedSignup } from './signup-1-layouts.tsx'

const meta = {
  args: signupControlArgs,
  argTypes: signupControlArgTypes,
  parameters: {
    controls: {
      exclude: [
        'emailError',
        'error',
        'nameError',
        'passwordError',
        'passwordMinLength',
        'pending',
        'suggestions',
      ],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedSignup {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Register/Register1/Stories',
} satisfies Meta<SignupControls>

export default meta

type Story = StoryObj<SignupControls>

export const Default: Story = {}

export const Pending: Story = {
  args: { pending: true },
}

export const ErrorMessage: Story = {
  args: { error: 'Não foi possível criar a conta. Tente novamente.' },
}

export const FieldErrors: Story = {
  args: {
    emailError: 'Este e-mail já está em uso.',
    nameError: 'Informe o nome completo.',
    passwordError: 'Escolha uma senha mais forte.',
  },
}

export const PasswordMinLength: Story = {
  args: { passwordMinLength: 12 },
}

export const SuggestionsNumberAndSymbol: Story = {
  args: { suggestions: 'numberAndSymbol' },
}

export const SuggestionsNone: Story = {
  args: { suggestions: 'none' },
}
