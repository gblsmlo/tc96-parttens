import type { Meta, StoryObj } from '@storybook/react-vite'
import { Signup2 } from '@tc96/blocks/application/auth/signup-2'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '900px', inline: false } },
    layout: 'fullscreen',
  },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Auth/Register/Register2/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <Signup2
      error="Não foi possível criar a conta. Tente novamente."
      onSubmit={ignore}
    />
  ),
}
