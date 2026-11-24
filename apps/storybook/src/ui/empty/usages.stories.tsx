import {
  BookIcon,
  CalendarBlankIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  TrayIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@tc96/ui/empty'
import { Input } from '@tc96/ui/input'
import { expect, within } from 'storybook/test'
import { EmptyCanvas } from './empty-frame.tsx'

const meta = {
  decorators: [EmptyCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Empty/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const NoMeetings: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarBlankIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No upcoming meetings</EmptyTitle>
        <EmptyDescription>Create a meeting to get started.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button size="sm">Create meeting</Button>
          <Button size="sm" variant="outline">
            <BookIcon aria-hidden="true" />
            View docs
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('No upcoming meetings')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Create meeting' }),
    ).toBeVisible()
  },
}

export const NoSearchResults: Story = {
  render: () => (
    <Empty role="status">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MagnifyingGlassIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No results for “quarterly report”</EmptyTitle>
        <EmptyDescription>
          Check the spelling or search with fewer keywords.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          Clear search
        </Button>
      </EmptyContent>
    </Empty>
  ),
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveTextContent('No results for “quarterly report”')
  },
}

export const NoApiKeys: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <KeyIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No API keys</EmptyTitle>
        <EmptyDescription>
          Create a key to call the API from your server.{' '}
          <a href="#authentication">Read the authentication guide</a>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Create API key</Button>
      </EmptyContent>
    </Empty>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', {
        name: 'Read the authentication guide',
      }),
    ).toBeVisible()
  },
}

export const InviteTeam: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UsersIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No members yet</EmptyTitle>
        <EmptyDescription>
          Invite your team to share projects and reviews.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex w-full gap-2">
          <Input
            aria-label="Email address"
            placeholder="name@company.com"
            type="email"
          />
          <Button size="sm">Invite</Button>
        </div>
      </EmptyContent>
    </Empty>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Email address' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Invite' })).toBeVisible()
  },
}

export const AllCaughtUp: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <TrayIcon
            aria-hidden="true"
            className="size-10 text-muted-foreground"
          />
        </EmptyMedia>
        <EmptyTitle>You’re all caught up</EmptyTitle>
        <EmptyDescription>
          New notifications from your projects show up here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('You’re all caught up'),
    ).toBeVisible()
  },
}
