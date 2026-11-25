import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login5 } from '@tc96/ui/blocks/application/auth/login-5'
import { loginMethods, PickingLogin5 } from './login-5-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login5/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ChooseHowToSignIn: Story = {
  render: () => (
    <PickingLogin5 methods={loginMethods} onMethod={ignore} onSubmit={ignore} />
  ),
}

export const OnlyPasskeyAndEmail: Story = {
  render: () => (
    <Login5
      methods={[loginMethods[0]]}
      onMethod={ignore}
      onSubmit={ignore}
      signupHref="/signup"
    />
  ),
}
