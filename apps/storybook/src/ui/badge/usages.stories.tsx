import { BellIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { expect, within } from 'storybook/test'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Badge/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const releases = [
  { name: 'Billing export', status: 'Shipped', variant: 'success' },
  { name: 'Audit log', status: 'In review', variant: 'info' },
  { name: 'SSO settings', status: 'Blocked', variant: 'warning' },
  { name: 'Legacy import', status: 'Failed', variant: 'error' },
] as const

export const StatusList: Story = {
  render: () => (
    <ul className="flex w-72 flex-col divide-y rounded-lg border">
      {releases.map(({ name, status, variant }) => (
        <li
          className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
          key={name}
        >
          {name}
          <Badge variant={variant}>{status}</Badge>
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const rows = within(canvasElement).getAllByRole('listitem')
    await expect(rows).toHaveLength(releases.length)
    await expect(
      within(rows[0] as HTMLElement).getByText('Shipped'),
    ).toBeVisible()
  },
}

export const NotificationCount: Story = {
  render: () => (
    <Button aria-label="Notifications, 3 unread" size="icon" variant="outline">
      <BellIcon aria-hidden="true" />
      <Badge
        aria-hidden="true"
        className="absolute -end-1.5 -top-1.5 rounded-full"
      >
        3
      </Badge>
    </Button>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Notifications, 3 unread',
      }),
    ).toBeVisible()
  },
}

export const PlanLabel: Story = {
  render: () => (
    <p className="flex items-center gap-2 text-sm">
      Workspace plan
      <Badge
        render={(props) => <a {...props} href="#pricing" />}
        size="large"
        variant="outline"
      >
        Pro
      </Badge>
    </p>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Pro' }),
    ).toHaveAttribute('href', '#pricing')
  },
}
