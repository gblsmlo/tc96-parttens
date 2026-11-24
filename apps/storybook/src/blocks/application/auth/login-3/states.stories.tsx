import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login3Controls,
  login3ControlArgs,
  login3ControlArgTypes,
} from './login-3-controls.ts'
import { ComposedLogin3 } from './login-3-layouts.tsx'

const meta = {
  args: login3ControlArgs,
  argTypes: login3ControlArgTypes,
  parameters: {
    controls: {
      exclude: ['aside', 'emailError', 'error', 'passwordError', 'pending'],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedLogin3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login3/States',
} satisfies Meta<Login3Controls>

export default meta

type Story = StoryObj<Login3Controls>

export const Default: Story = {}

export const Pending: Story = {
  args: { pending: true },
}

export const ErrorMessage: Story = {
  args: { error: 'E-mail ou senha incorretos.' },
}
