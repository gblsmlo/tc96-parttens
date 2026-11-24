import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login10 } from '@tc96/blocks/application/auth/login-10'
import { authLogo } from '../fixtures/auth-data'
import {
  login10FooterLinks,
  login10Rating,
  login10Testimonials,
} from './login-10-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '760px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/Login/Login10/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Login10
      copyright="© 2026 Acme"
      error="E-mail ou senha incorretos."
      footerLinks={login10FooterLinks}
      logo={authLogo}
      onSubmit={ignore}
      proof="Mais de 2.000 times confiam na Acme"
      rating={login10Rating}
      testimonials={login10Testimonials}
    />
  ),
}
