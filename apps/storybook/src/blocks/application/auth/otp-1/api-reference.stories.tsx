import type { Meta, StoryObj } from '@storybook/react-vite'
import { Otp1 } from '@tc96/blocks/application/auth/otp-1'
import { authLogo } from '../fixtures/auth-data'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '760px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/Otp1/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Otp1
      destination="ana@acme.com"
      error="Não foi possível verificar o código. Tente novamente."
      logo={authLogo}
      onResend={ignore}
      onSubmit={ignore}
    />
  ),
}
