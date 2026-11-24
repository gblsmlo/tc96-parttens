import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login9Controls,
  login9ControlArgs,
  login9ControlArgTypes,
} from './login-9-controls.ts'
import { ComposedLogin9 } from './login-9-layouts.tsx'

const meta = {
  args: login9ControlArgs,
  argTypes: login9ControlArgTypes,
  parameters: {
    controls: {
      exclude: [
        'brands',
        'emailError',
        'error',
        'pending',
        'providers',
        'rating',
      ],
    },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedLogin9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login9/Stories',
} satisfies Meta<Login9Controls>

export default meta

type Story = StoryObj<Login9Controls>

export const Pending: Story = {
  args: { pending: true },
}

export const ErrorMessage: Story = {
  args: { error: 'Não foi possível enviar o link. Tente novamente.' },
}

export const EmailFieldError: Story = {
  args: { emailError: 'Este e-mail não está cadastrado.' },
}

export const WithoutRating: Story = {
  args: { rating: 0 },
}

export const WithoutBrands: Story = {
  args: { brands: false },
}

export const WithoutProviders: Story = {
  args: { providers: false },
}
