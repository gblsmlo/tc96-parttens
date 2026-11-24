import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login7Controls,
  login7ControlArgs,
  login7ControlArgTypes,
} from './login-7-controls.ts'
import { ComposedLogin7 } from './login-7-layouts.tsx'

const meta = {
  args: login7ControlArgs,
  argTypes: login7ControlArgTypes,
  parameters: {
    controls: {
      exclude: [
        'emailError',
        'error',
        'footerLinks',
        'passwordError',
        'pending',
      ],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedLogin7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login7/Stories',
} satisfies Meta<Login7Controls>

export default meta

type Story = StoryObj<Login7Controls>

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
