import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { CopyIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { expect, within } from 'storybook/test'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/Button/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const FormFooter: Story = {
  render: () => (
    <form
      className="flex justify-end gap-2"
      onSubmit={(event) => event.preventDefault()}
    >
      <Button variant="outline">Cancel</Button>
      <Button type="submit">Save changes</Button>
    </form>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Save changes' }),
    ).toHaveAttribute('type', 'submit')
  },
}

export const SavingChanges: Story = {
  render: () => (
    <div className="flex justify-end gap-2">
      <Button disabled variant="outline">
        Cancel
      </Button>
      <Button loading>Save changes</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: /^Save changes/ }),
    ).toBeDisabled()
  },
}

export const DeleteProject: Story = {
  render: () => (
    <div className="flex justify-end gap-2">
      <Button variant="ghost">Keep project</Button>
      <Button variant="destructive">
        <Trash2Icon aria-hidden="true" />
        Delete project
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Delete project' }),
    ).toBeVisible()
  },
}

export const RemoveMember: Story = {
  render: () => (
    <div className="flex w-80 items-center justify-between gap-3">
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium text-sm">Ana Souza</span>
        <span className="truncate text-muted-foreground text-xs">
          ana.souza@acme.com
        </span>
      </div>
      <Button className="text-destructive-foreground" size="sm" variant="ghost">
        Remove
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Remove' }),
    ).toBeVisible()
  },
}

export const RowActions: Story = {
  render: () => (
    <div className="flex items-center gap-1">
      <Button aria-label="Edit invoice" size="icon-sm" variant="ghost">
        <PencilIcon aria-hidden="true" />
      </Button>
      <Button aria-label="Duplicate invoice" size="icon-sm" variant="ghost">
        <CopyIcon aria-hidden="true" />
      </Button>
      <Button aria-label="Delete invoice" size="icon-sm" variant="ghost">
        <Trash2Icon aria-hidden="true" />
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('button')).toHaveLength(3)
  },
}

export const ManageBilling: Story = {
  render: () => (
    <div className="flex w-80 items-center justify-between gap-3">
      <div className="flex min-w-0 flex-col">
        <span className="font-medium text-sm">Pro plan</span>
        <span className="text-muted-foreground text-xs">
          Renews on December 1
        </span>
      </div>
      <Button
        render={(props) => <a {...props} href="#billing" />}
        size="sm"
        variant="link"
      >
        Manage billing
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Manage billing' }),
    ).toHaveAttribute('href', '#billing')
  },
}
