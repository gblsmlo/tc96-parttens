import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login2Controls,
  login2ControlArgs,
  login2ControlArgTypes,
} from './login-2-controls.ts'
import { ComposedLogin2 } from './login-2-layouts.tsx'

const meta = {
  args: login2ControlArgs,
  argTypes: login2ControlArgTypes,
  parameters: {
    controls: {
      exclude: ['emailError', 'error', 'passwordError', 'pending'],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedLogin2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Login/Login2/Stories',
} satisfies Meta<Login2Controls>

export default meta

type Story = StoryObj<Login2Controls>

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
