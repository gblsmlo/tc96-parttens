import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ResetPassword2,
  type ResetPassword2Props,
} from '@tc96/blocks/auth/reset-password-2'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo } from '../../fixtures/auth-data'
import {
  countdown,
  expiredTitle,
  expiringSoon,
  fillPasswords,
  password,
  requestButton,
  submitButton,
} from '../reset-password-2-play.ts'

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
  title: 'Blocks/Auth/ResetPassword2/Behavior',
} satisfies Meta<typeof ResetPassword2>

export default meta

type Story = StoryObj<typeof meta>

function ConsumerTimer(props: Readonly<ResetPassword2Props>) {
  const [expiresIn, setExpiresIn] = useState(props.expiresIn ?? 125)
  return (
    <>
      <ResetPassword2
        {...props}
        expiresIn={expiresIn}
        onRequestNewLink={() => {
          props.onRequestNewLink?.()
          setExpiresIn(125)
        }}
      />
      <section
        aria-label="Simulação do consumidor"
        className="fixed right-4 bottom-4 z-10"
      >
        <Button
          onClick={() => setExpiresIn((seconds) => Math.max(0, seconds - 30))}
          size="sm"
          type="button"
          variant="outline"
        >
          Avançar 30 s
        </Button>
      </section>
    </>
  )
}

export const CountdownIsFormatted: Story = {
  play: async ({ canvasElement }) => {
    await expect(countdown(within(canvasElement), '9:41')).toBeVisible()
  },
}

export const CountdownIsPlainText: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(countdown(canvas, '9:41').closest('[aria-live]')).toBeNull()
    await expect(canvas.queryByText(expiringSoon)).toBeNull()
  },
}

export const AnnouncesWhenOneMinuteIsLeft: Story = {
  args: { expiresIn: 59 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(countdown(canvas, '0:59').closest('[aria-live]')).toBeNull()
    await expect(
      canvas.getByText(expiringSoon).closest('[aria-live="polite"]'),
    ).not.toBeNull()
  },
}

export const WithoutExpiresInHasNoTimer: Story = {
  args: { expiresIn: undefined },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText(/Este link expira em/)).toBeNull()
    await expect(canvas.queryByText(expiringSoon)).toBeNull()
    await expect(canvas.queryByText('Link expirado')).toBeNull()
    await fillPasswords(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ password })
  },
}

export const ExpiredReplacesTheForm: Story = {
  args: { expiresIn: 0 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(expiredTitle(canvas)).toBeVisible()
    await expect(
      canvas.queryByRole('heading', { name: 'Redefinir senha' }),
    ).toBeNull()
    await expect(canvas.queryByLabelText('Nova senha')).toBeNull()
    await expect(canvas.queryByLabelText('Confirmar senha')).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Redefinir senha' }),
    ).toBeNull()
    await expect(canvasElement.querySelector('[data-slot="form"]')).toBeNull()
    await expect(canvas.queryByText(/Este link expira em/)).toBeNull()
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const ExpiredFromTheStartDoesNotTakeFocus: Story = {
  args: { expiresIn: 0 },
  play: async ({ canvasElement }) => {
    await expect(expiredTitle(within(canvasElement))).not.toHaveFocus()
  },
}

export const ErrorStaysInExpiredState: Story = {
  args: {
    error: 'Não foi possível enviar o link. Tente novamente.',
    expiresIn: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(expiredTitle(canvas)).toBeVisible()
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Não foi possível enviar o link. Tente novamente.',
    )
  },
}

export const FollowsTheConsumerCountdown: Story = {
  args: { expiresIn: 125 },
  render: (args) => <ConsumerTimer {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const tick = () =>
      userEvent.click(canvas.getByRole('button', { name: 'Avançar 30 s' }))
    await expect(countdown(canvas, '2:05')).toBeVisible()
    await tick()
    await expect(countdown(canvas, '1:35')).toBeVisible()
    await expect(canvas.queryByText(expiringSoon)).toBeNull()
    await tick()
    await expect(countdown(canvas, '1:05')).toBeVisible()
    await tick()
    await expect(countdown(canvas, '0:35')).toBeVisible()
    await expect(
      canvas.getByText(expiringSoon).closest('[aria-live="polite"]'),
    ).not.toBeNull()
    await tick()
    await expect(countdown(canvas, '0:05')).toBeVisible()
    await tick()
    const title = await canvas.findByRole('heading', {
      level: 1,
      name: 'Link expirado',
    })
    await waitFor(() => expect(title).toHaveFocus())
    await expect(title).toHaveAttribute('tabindex', '-1')
    await expect(canvas.queryByLabelText('Nova senha')).toBeNull()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const FormReturnsWhenExpiresInRisesAgain: Story = {
  args: { expiresIn: 0 },
  render: (args) => <ConsumerTimer {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(requestButton(canvas))
    await expect(args.onRequestNewLink).toHaveBeenCalledOnce()
    await expect(
      await canvas.findByRole('heading', { level: 1, name: 'Redefinir senha' }),
    ).toBeVisible()
    await expect(countdown(canvas, '2:05')).toBeVisible()
    await expect(canvas.queryByText('Link expirado')).toBeNull()
  },
}
