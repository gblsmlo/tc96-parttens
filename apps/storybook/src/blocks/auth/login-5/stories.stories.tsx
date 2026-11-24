import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login5Controls,
  login5ControlArgs,
  login5ControlArgTypes,
} from './login-5-controls.ts'
import { ComposedLogin5 } from './login-5-layouts.tsx'

const meta = {
  args: login5ControlArgs,
  argTypes: login5ControlArgTypes,
  parameters: {
    controls: {
      exclude: ['emailError', 'error', 'method', 'passwordError', 'pending'],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedLogin5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Login/Login5/Stories',
} satisfies Meta<Login5Controls>

export default meta

type Story = StoryObj<Login5Controls>

export const EmailForm: Story = {
  args: { method: 'email' },
}

export const FieldErrors: Story = {
  args: {
    emailError: 'Este e-mail não está cadastrado.',
    method: 'email',
    passwordError: 'A senha está incorreta.',
  },
}
