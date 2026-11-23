import type { Meta, StoryObj } from '@storybook/react-vite'
import { loginControlArgs } from './login-1-controls.ts'
import { ComposedLogin } from './login-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Login/Login1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutProviders: Story = {
  render: () => <ComposedLogin {...loginControlArgs} providers={false} />,
}

export const WithoutLinks: Story = {
  render: () => (
    <ComposedLogin
      {...loginControlArgs}
      forgotPassword={false}
      signup={false}
    />
  ),
}
