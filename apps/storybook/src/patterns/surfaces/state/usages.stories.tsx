import { BellSlashIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { StateGuard, StateSurface } from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { StateCanvas } from './state-canvas.tsx'

type RegionState = 'data' | 'empty' | 'error' | 'loading'

const regionStates: readonly (readonly [RegionState, string])[] = [
  ['data', 'Loaded'],
  ['loading', 'Loading'],
  ['empty', 'Empty'],
  ['error', 'Failed'],
]

const contacts = [
  { name: 'Marina Costa', role: 'Head of operations' },
  { name: 'Rafael Nunes', role: 'Account executive' },
  { name: 'Beatriz Lima', role: 'Legal counsel' },
]

function ContactList() {
  return (
    <ul className="divide-y rounded-lg border text-sm">
      {contacts.map((contact) => (
        <li
          className="flex items-center justify-between px-4 py-3"
          key={contact.name}
        >
          <span className="font-medium">{contact.name}</span>
          <span className="text-muted-foreground">{contact.role}</span>
        </li>
      ))}
    </ul>
  )
}

function ContactsRegion() {
  const [state, setState] = useState<RegionState>('data')

  return (
    <section aria-label="Contacts" className="flex flex-col gap-4">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Status of the query</legend>
        {regionStates.map(([value, label]) => (
          <Button
            aria-pressed={state === value}
            key={value}
            onClick={() => setState(value)}
            size="sm"
            variant={state === value ? 'default' : 'outline'}
          >
            {label}
          </Button>
        ))}
      </fieldset>
      {state === 'data' ? (
        <StateGuard state="data">
          <ContactList />
        </StateGuard>
      ) : null}
      {state === 'loading' ? (
        <StateGuard
          state="loading"
          surface={{
            description: 'This takes a few seconds.',
            title: 'Loading contacts',
          }}
        >
          <ContactList />
        </StateGuard>
      ) : null}
      {state === 'empty' ? (
        <StateGuard
          state="empty"
          surface={{
            actions: <Button variant="outline">Add contact</Button>,
            description: 'Add a contact to start your list.',
            title: 'No contacts yet',
          }}
        >
          <ContactList />
        </StateGuard>
      ) : null}
      {state === 'error' ? (
        <StateGuard
          state="error"
          surface={{
            actions: <Button variant="outline">Try again</Button>,
            description: 'The contacts could not be loaded.',
            title: 'Something went wrong',
          }}
        >
          <ContactList />
        </StateGuard>
      ) : null}
    </section>
  )
}

const meta = {
  decorators: [StateCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/State/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const NoRecords: Story = {
  render: () => (
    <StateSurface
      actions={<Button variant="outline">Create record</Button>}
      description="There are no records to show in this view."
      kind="empty"
      title="No records"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('status')).toBeVisible()
    await expect(canvas.getByText('No records')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Create record' }),
    ).toBeVisible()
  },
}

export const NoResults: Story = {
  render: () => (
    <StateSurface
      actions={<Button variant="outline">Clear filters</Button>}
      description="Remove or adjust the filters to widen the search."
      kind="no-result"
      title="No results found"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('status')).toBeVisible()
    await expect(canvas.getByText('No results found')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Clear filters' }),
    ).toBeVisible()
  },
}

export const LoadFailed: Story = {
  render: () => (
    <StateSurface
      actions={<Button variant="outline">Try again</Button>}
      description="The records could not be loaded."
      kind="error"
      title="Something went wrong"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvas.getByText('Something went wrong')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Try again' }),
    ).toBeVisible()
  },
}

export const RestrictedAccess: Story = {
  render: () => (
    <StateSurface
      actions={<Button variant="outline">Request access</Button>}
      description="Ask an admin to grant you access to this resource."
      kind="permission"
      title="Restricted access"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvas.getByText('Restricted access')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Request access' }),
    ).toBeVisible()
  },
}

export const RecordNotFound: Story = {
  render: () => (
    <StateSurface
      description="The record may have been deleted or moved."
      kind="not-found"
      title="Record not found"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('status')).toBeVisible()
    await expect(canvas.getByText('Record not found')).toBeVisible()
  },
}

export const NoNotifications: Story = {
  render: () => (
    <StateSurface
      description="You will see new activity here."
      icon={<BellSlashIcon aria-hidden="true" />}
      kind="empty"
      title="No notifications"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('status')).toBeVisible()
    await expect(canvas.getByText('No notifications')).toBeVisible()
  },
}

export const LoadingRecords: Story = {
  render: () => (
    <StateGuard
      state="loading"
      surface={{
        description: 'Please wait while the records load.',
        title: 'Loading',
      }}
    >
      <p className="text-sm">Confidential record</p>
    </StateGuard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('status')).toBeVisible()
    await expect(canvas.getByText('Loading')).toBeVisible()
    await expect(canvas.queryByText('Confidential record')).toBeNull()
  },
}

export const ContactsList: Story = {
  render: () => <ContactsRegion />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('region', { name: 'Contacts' })).toBeVisible()
    await expect(canvas.getByText('Marina Costa')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Loaded' }),
    ).toHaveAttribute('aria-pressed', 'true')
  },
}
