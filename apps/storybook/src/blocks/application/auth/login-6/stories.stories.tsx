import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login6Controls,
  login6ControlArgs,
  login6ControlArgTypes,
} from './login-6-controls.ts'
import { ComposedLogin6 } from './login-6-layouts.tsx'

const meta = {
  args: login6ControlArgs,
  argTypes: login6ControlArgTypes,
  parameters: {
    controls: {
      exclude: ['emailError', 'error', 'media', 'passwordError', 'pending'],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedLogin6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login6/Stories',
} satisfies Meta<Login6Controls>

export default meta

type Story = StoryObj<Login6Controls>

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
