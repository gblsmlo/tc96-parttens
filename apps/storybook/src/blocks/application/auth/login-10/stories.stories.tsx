import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login10Controls,
  login10ControlArgs,
  login10ControlArgTypes,
} from './login-10-controls.ts'
import { ComposedLogin10 } from './login-10-layouts.tsx'

const meta = {
  args: login10ControlArgs,
  argTypes: login10ControlArgTypes,
  parameters: {
    controls: {
      exclude: ['emailError', 'error', 'passwordError', 'pending'],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedLogin10 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login10/Stories',
} satisfies Meta<Login10Controls>

export default meta

type Story = StoryObj<Login10Controls>

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
