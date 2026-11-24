import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { login4ControlArgs } from './login-4-controls.ts'
import { ComposedLogin4 } from './login-4-layouts.tsx'
import { sentTitle } from './login-4-play.ts'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login4/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const RequestLink: Story = {
  render: () => <ComposedLogin4 {...login4ControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Entrar com link' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Entrar com senha' }),
    ).toBeVisible()
  },
}

export const LinkSent: Story = {
  render: () => <ComposedLogin4 {...login4ControlArgs} sent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(sentTitle(canvas)).toBeVisible()
    await expect(
      canvas.getByText('Enviamos um link para entrar para ana@acme.com.'),
    ).toBeVisible()
  },
}

export const ResendCountdown: Story = {
  render: () => <ComposedLogin4 {...login4ControlArgs} resendIn={30} sent />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Reenviar em 30s' }),
    ).toBeDisabled()
  },
}
