import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Signup3Controls,
  signup3ControlArgs,
  signup3ControlArgTypes,
} from './signup-3-controls.ts'
import { ComposedSignup3 } from './signup-3-layouts.tsx'

const meta = {
  args: signup3ControlArgs,
  argTypes: signup3ControlArgTypes,
  parameters: {
    controls: {
      exclude: ['emailError', 'error', 'passwordError', 'pending'],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedSignup3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register3/Stories',
} satisfies Meta<Signup3Controls>

export default meta

type Story = StoryObj<Signup3Controls>

export const Pending: Story = {
  args: { pending: true },
}

export const ErrorMessage: Story = {
  args: { error: 'Não foi possível criar a conta. Tente novamente.' },
}

export const FieldErrors: Story = {
  args: {
    emailError: 'Este e-mail já tem uma conta.',
    passwordError: 'A senha precisa de pelo menos 8 caracteres.',
  },
}
