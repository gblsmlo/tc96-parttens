import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login9 } from '@tc96/ui/blocks/application/auth/login-9'
import { authLogo, authProviders } from '../fixtures/auth-data'
import {
  login9Brands,
  login9BrandsLabel,
  login9Testimonial,
} from './login-9-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '600px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/Login/Login9/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Login9
      brands={login9Brands}
      brandsLabel={login9BrandsLabel}
      logo={authLogo}
      onSubmit={ignore}
      providers={authProviders}
      testimonial={login9Testimonial}
    />
  ),
}
