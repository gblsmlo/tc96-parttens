import type { Meta, StoryObj } from '@storybook/react-vite'
import { Signup3 } from '@tc96/ui/blocks/application/auth/signup-3'
import { authLogo, authProviders } from '../fixtures/auth-data'
import { signup3Brands, signup3Heading } from './signup-3-layouts.tsx'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '900px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/Register/Register3/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Signup3
      badge="Novo: relatórios com IA"
      brands={signup3Brands}
      brandsLabel="Times que já vendem mais com a Acme"
      labels={{ heading: signup3Heading }}
      loginHref="/login"
      logo={authLogo}
      onSubmit={ignore}
      privacyHref="/privacy"
      providers={authProviders}
      termsHref="/terms"
    />
  ),
}
