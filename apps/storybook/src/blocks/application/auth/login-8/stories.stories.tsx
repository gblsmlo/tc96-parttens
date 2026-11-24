import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login8Controls,
  login8ControlArgs,
  login8ControlArgTypes,
} from './login-8-controls.ts'
import { ComposedLogin8 } from './login-8-layouts.tsx'

const meta = {
  args: login8ControlArgs,
  argTypes: login8ControlArgTypes,
  parameters: {
    controls: {
      exclude: ['emailError', 'error', 'media', 'pending', 'providers'],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedLogin8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login8/Stories',
} satisfies Meta<Login8Controls>

export default meta

type Story = StoryObj<Login8Controls>

export const Pending: Story = {
  args: { pending: true },
}

export const ErrorMessage: Story = {
  args: { error: 'Não foi possível enviar o link. Tente novamente.' },
}

export const EmailFieldError: Story = {
  args: { emailError: 'Este e-mail não está cadastrado.' },
}

export const WithoutMedia: Story = {
  args: { media: false },
}

export const WithoutProviders: Story = {
  args: { providers: false },
}
