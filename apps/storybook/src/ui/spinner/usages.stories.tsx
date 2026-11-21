import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@tc96/ui/input-group'
import { Label } from '@tc96/ui/label'
import { Spinner } from '@tc96/ui/spinner'
import { expect, within } from 'storybook/test'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Spinner/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SubmittingForm: Story = {
  render: () => (
    <form
      aria-label="Profile"
      className="flex w-80 flex-col gap-3"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-name">Display name</Label>
        <Input defaultValue="Marina Duarte" id="profile-name" />
      </div>
      <Button className="self-end" loading type="submit">
        Save changes
      </Button>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: /^Save changes/,
    })
    await expect(button).toBeDisabled()
    await expect(
      within(button).getByRole('status', { name: 'Loading' }),
    ).toBeVisible()
  },
}

export const SearchingContacts: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput
          aria-label="Search contacts"
          defaultValue="Marina"
          type="search"
        />
        <InputGroupAddon align="inline-end">
          <Spinner aria-label="Searching contacts" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('searchbox', { name: 'Search contacts' }),
    ).toBeEnabled()
    await expect(
      canvas.getByRole('status', { name: 'Searching contacts' }),
    ).toBeVisible()
  },
}

export const LoadingInvoices: Story = {
  render: () => (
    <section
      aria-labelledby="invoices-heading"
      className="flex w-80 flex-col gap-3"
    >
      <h2 className="font-medium text-sm" id="invoices-heading">
        Invoices
      </h2>
      <div className="flex h-40 items-center justify-center rounded-lg border">
        <Spinner
          aria-label="Loading invoices"
          className="size-5 text-muted-foreground"
        />
      </div>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', {
      name: 'Invoices',
    })
    await expect(
      within(section).getByRole('status', { name: 'Loading invoices' }),
    ).toBeVisible()
  },
}

export const GeneratingReply: Story = {
  render: () => (
    <p className="flex items-center gap-2 text-muted-foreground text-sm">
      <Spinner aria-hidden="true" className="size-4" />
      Generating a reply…
    </p>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('p')).toHaveTextContent(
      'Generating a reply…',
    )
  },
}
