import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@tc96/ui/alert'
import { Button } from '@tc96/ui/button'
import { expect, within } from 'storybook/test'
import { AlertCanvas } from './alert-frame.tsx'

const meta = {
  decorators: [AlertCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Alert/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const NewVersion: Story = {
  render: () => (
    <Alert variant="info">
      <InfoIcon aria-label="Information" role="img" />
      <AlertTitle>A new version is available</AlertTitle>
      <AlertDescription>
        Reload the page to get the latest changes.
      </AlertDescription>
      <AlertAction>
        <Button size="sm">Reload</Button>
      </AlertAction>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(
      within(alert).getByRole('button', { name: 'Reload' }),
    ).toBeVisible()
  },
}

export const ChangesSaved: Story = {
  render: () => (
    <Alert variant="success">
      <CheckCircleIcon aria-label="Success" role="img" />
      <AlertTitle>Changes saved</AlertTitle>
      <AlertDescription>
        Everyone in the workspace sees the new settings.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', { name: 'Success' }),
    ).toBeVisible()
  },
}

export const TrialEnding: Story = {
  render: () => (
    <Alert variant="warning">
      <WarningIcon aria-label="Warning" role="img" />
      <AlertTitle>Your trial ends in 3 days</AlertTitle>
      <AlertDescription>
        Choose a plan to keep your projects and members.
      </AlertDescription>
      <AlertAction>
        <Button size="sm" variant="ghost">
          Later
        </Button>
        <Button size="sm">Choose plan</Button>
      </AlertAction>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(within(alert).getAllByRole('button')).toHaveLength(2)
  },
}

export const PaymentFailed: Story = {
  render: () => (
    <Alert variant="error">
      <WarningCircleIcon aria-label="Error" role="img" />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        <p>The card on file was declined.</p>
        <p>Update the payment method to retry the charge.</p>
      </AlertDescription>
      <AlertAction>
        <Button size="sm">Update payment</Button>
      </AlertAction>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(within(alert).getByText('Payment failed')).toBeVisible()
  },
}
