import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type LoginControls,
  loginControlArgs,
  loginControlArgTypes,
} from './login-1-controls.ts'
import { ComposedLogin } from './login-1-layouts.tsx'

const meta = {
  args: loginControlArgs,
  argTypes: loginControlArgTypes,
  parameters: {
    controls: {
      exclude: ['emailError', 'error', 'passwordError', 'pending'],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedLogin {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login1/Stories',
} satisfies Meta<LoginControls>

export default meta

type Story = StoryObj<LoginControls>

export const Default: Story = {}

export const Pending: Story = {
  args: { pending: true },
}

export const ErrorMessage: Story = {
  args: { error: 'E-mail ou senha incorretos.' },
}

export const FieldErrors: Story = {
  args: {
    emailError: 'Este e-mail não está cadastrado.',
    passwordError: 'A senha está incorreta.',
  },
}
