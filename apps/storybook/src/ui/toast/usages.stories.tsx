import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Spinner } from '@tc96/ui/spinner'
import { anchoredToastManager, toastManager } from '@tc96/ui/toast'
import { useRef, useState } from 'react'
import { expect, screen } from 'storybook/test'
import {
  ArchiveWithUndo,
  SaveDraft,
  SaveSettings,
  ToastScene,
  UploadFiles,
} from './toast-layouts.tsx'

const createEvent = () =>
  toastManager.add({
    description: 'Monday, January 3rd at 6:00pm',
    title: 'Event has been created',
  })

const warnSessionExpiring = () => {
  const id = toastManager.add({
    actionProps: {
      children: 'Stay signed in',
      onClick: () => toastManager.close(id),
    },
    description: 'You will be signed out in 2 minutes.',
    timeout: 0,
    title: 'Your session is about to expire',
    type: 'warning',
  })
}

const reportPaymentFailed = () =>
  toastManager.add({
    description: 'The card on file was declined. Update it in Billing.',
    title: 'Payment failed',
    type: 'error',
  })

const SubmitForm = () => {
  const submitRef = useRef<HTMLButtonElement>(null)
  const toastId = useRef<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (toastId.current) anchoredToastManager.close(toastId.current)
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSubmitting(false)
    toastId.current = anchoredToastManager.add({
      description: 'The server did not respond. Try again in a moment.',
      positionerProps: { anchor: submitRef.current, sideOffset: 4 },
      title: 'Error submitting form',
      type: 'error',
    })
  }

  return (
    <ToastScene onMount={submit}>
      <Button disabled={submitting} onClick={submit} ref={submitRef}>
        {submitting && <Spinner />}
        {submitting ? 'Submitting…' : 'Submit'}
      </Button>
    </ToastScene>
  )
}

const meta = {
  tags: ['!autodocs'],
  title: 'UI/Toast/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const EventCreated: Story = {
  render: () => (
    <ToastScene onMount={createEvent}>
      <Button onClick={createEvent} variant="outline">
        Create event
      </Button>
    </ToastScene>
  ),
  play: async () => {
    await expect(
      await screen.findByText('Event has been created'),
    ).toBeInTheDocument()
    await expect(
      screen.getByText('Monday, January 3rd at 6:00pm'),
    ).toBeInTheDocument()
  },
}

export const MessageArchived: Story = {
  render: () => <ArchiveWithUndo />,
  play: async () => {
    const toast = await screen.findByRole('dialog', {
      name: 'Message archived',
    })
    await expect(toast).toHaveAttribute('data-type', 'success')
  },
}

export const SettingsSaved: Story = {
  render: () => <SaveSettings />,
  play: async () => {
    await expect(await screen.findByText('Settings saved')).toBeInTheDocument()
  },
}

export const FilesUploading: Story = {
  render: () => <UploadFiles />,
  play: async () => {
    await expect(await screen.findByText('Uploading…')).toBeInTheDocument()
  },
}

export const SessionExpiring: Story = {
  render: () => (
    <ToastScene onMount={warnSessionExpiring}>
      <Button onClick={warnSessionExpiring} variant="outline">
        Simulate idle session
      </Button>
    </ToastScene>
  ),
  play: async () => {
    await expect(
      await screen.findByRole('button', { name: 'Stay signed in' }),
    ).toBeInTheDocument()
  },
}

export const PaymentFailed: Story = {
  render: () => (
    <ToastScene onMount={reportPaymentFailed}>
      <Button onClick={reportPaymentFailed} variant="outline">
        Retry payment
      </Button>
    </ToastScene>
  ),
  play: async () => {
    const toast = await screen.findByRole('dialog', { name: 'Payment failed' })
    await expect(toast).toHaveAttribute('data-type', 'error')
  },
}

export const DraftSaved: Story = {
  render: () => <SaveDraft />,
  play: async () => {
    await expect(await screen.findByText('Draft saved')).toBeInTheDocument()
  },
}

export const SubmitFailed: Story = {
  render: () => <SubmitForm />,
  play: async () => {
    await expect(
      await screen.findByText('Error submitting form', {}, { timeout: 5000 }),
    ).toBeInTheDocument()
  },
}
