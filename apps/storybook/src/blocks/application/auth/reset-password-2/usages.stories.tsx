import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ResetPassword2,
  type ResetPassword2Props,
} from '@tc96/ui/blocks/application/auth/reset-password-2'
import { useEffect, useState } from 'react'
import { expect, fn, within } from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'
import { expiredTitle, requestButton } from './reset-password-2-play.ts'

const meta = {
  args: {
    expiresIn: 581,
    loginHref: '/login',
    logo: authLogo,
    onRequestNewLink: fn(),
    onSubmit: fn(),
  },
  component: ResetPassword2,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ResetPassword/ResetPassword2/Usages',
} satisfies Meta<typeof ResetPassword2>

export default meta

type Story = StoryObj<typeof meta>

function useSecondsLeft(deadline: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return Math.max(0, Math.ceil((deadline - now) / 1000))
}

function LinkCountedByTheClock(props: Readonly<ResetPassword2Props>) {
  const [deadline] = useState(() => Date.now() + 15 * 60 * 1000)
  const expiresIn = useSecondsLeft(deadline)
  return <ResetPassword2 {...props} expiresIn={expiresIn} />
}

export const ResetFromEmailLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Este link expira em 9:41')).toBeVisible()
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Redefinir senha' }),
    ).toBeVisible()
  },
}

export const LinkAboutToExpire: Story = {
  args: { expiresIn: 59 },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Este link expira em 0:59'),
    ).toBeVisible()
  },
}

export const LinkExpired: Story = {
  args: { expiresIn: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(expiredTitle(canvas)).toBeVisible()
    await expect(requestButton(canvas)).toBeEnabled()
  },
}

export const RequestCooldown: Story = {
  args: { expiresIn: 0, requestNewLinkIn: 45 },
  play: async ({ canvasElement }) => {
    await expect(
      requestButton(within(canvasElement), 'Solicitar novamente em 0:45'),
    ).toBeDisabled()
  },
}

export const CountingWithTheClock: Story = {
  render: (args) => <LinkCountedByTheClock {...args} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(/^Este link expira em \d+:\d{2}$/),
    ).toBeVisible()
  },
}
