import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetPassword2 } from '@tc96/blocks/auth/reset-password-2'
import { expect, fn, userEvent, within } from 'storybook/test'
import { authLogo } from '../../fixtures/auth-data'
import { expiredTitle, requestButton } from '../reset-password-2-play.ts'

const meta = {
  args: {
    expiresIn: 0,
    loginHref: '/login',
    logo: authLogo,
    onRequestNewLink: fn(),
    onSubmit: fn(),
  },
  component: ResetPassword2,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/ResetPassword/ResetPassword2/Behavior',
} satisfies Meta<typeof ResetPassword2>

export default meta

type Story = StoryObj<typeof meta>

export const RequestNewLinkCallsTheHandler: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(requestButton(canvas))
    await expect(args.onRequestNewLink).toHaveBeenCalledOnce()
  },
}

export const RequestNewLinkDisabledWhileCounting: Story = {
  args: { requestNewLinkIn: 45 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const request = requestButton(canvas, 'Solicitar novamente em 0:45')
    await expect(request).toBeDisabled()
    await expect(request.closest('[aria-live]')).toBeNull()
    await expect(canvas.queryByText('Solicitar novo link')).toBeNull()
    await userEvent.click(request, { pointerEventsCheck: 0 })
    await expect(args.onRequestNewLink).not.toHaveBeenCalled()
  },
}

export const RequestNewLinkEnabledAtZero: Story = {
  args: { requestNewLinkIn: 0 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const request = requestButton(canvas)
    await expect(request).toBeEnabled()
    await userEvent.click(request)
    await expect(args.onRequestNewLink).toHaveBeenCalledOnce()
  },
}

export const RequestNewLinkOnlyWithHandler: Story = {
  args: { onRequestNewLink: undefined, requestNewLinkIn: 45 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(expiredTitle(canvas)).toBeVisible()
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(
      canvas.getByRole('link', { name: 'Voltar para entrar' }),
    ).toBeVisible()
  },
}

export const PendingBlocksRequestNewLink: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const request = requestButton(canvas)
    await expect(request).toBeDisabled()
    await userEvent.click(request, { pointerEventsCheck: 0 })
    await expect(args.onRequestNewLink).not.toHaveBeenCalled()
  },
}
