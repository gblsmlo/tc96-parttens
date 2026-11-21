import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from '@tc96/ui/dialog'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { CopyIcon } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { expect, screen, within } from 'storybook/test'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/Dialog/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function ProfileDialog() {
  const [open, setOpen] = useState(true)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOpen(false)
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit profile
      </DialogTrigger>
      <DialogPopup>
        <form className="contents" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Your name and username show on your posts and comments.
            </DialogDescription>
          </DialogHeader>
          <DialogPanel className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input defaultValue="Ana Souza" name="name" />
            </Field>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input defaultValue="anasouza" name="username" />
            </Field>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  )
}

export const EditProfile: Story = {
  render: () => <ProfileDialog />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Edit profile' })
    await expect(within(dialog).getByLabelText('Name')).toHaveValue('Ana Souza')
    await expect(within(dialog).getByLabelText('Username')).toHaveValue(
      'anasouza',
    )
    await expect(
      within(dialog).getByRole('button', { name: 'Save changes' }),
    ).toHaveAttribute('type', 'submit')
  },
}

const terms = [
  {
    heading: 'Using the service',
    text: 'You may use the service for your own work and for the work of the organization that invited you. You may not resell access or use it to send unsolicited messages.',
  },
  {
    heading: 'Your content',
    text: 'You keep the rights to everything you upload. You let us store, copy and display it only as far as running the service requires.',
  },
  {
    heading: 'Payments',
    text: 'Paid plans are billed in advance each month or each year. You can cancel at any time, and the plan stays active until the end of the period you paid for.',
  },
  {
    heading: 'Privacy',
    text: 'We collect only the data the service needs to work and never sell it. The privacy policy lists every kind of data we keep and for how long.',
  },
  {
    heading: 'Availability',
    text: 'We aim to keep the service available at all times, but maintenance or events outside our control may interrupt it. Planned maintenance is announced a week ahead.',
  },
  {
    heading: 'Ending the agreement',
    text: 'You can close your account from the settings page. We may suspend an account that breaks these terms, after a notice by email.',
  },
  {
    heading: 'Changes to these terms',
    text: 'When these terms change, we email you thirty days before the new version applies. Keeping your account after that date means you accept it.',
  },
]

export const TermsOfService: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />}>
        Read the terms
      </DialogTrigger>
      <DialogPopup showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>Last updated on March 4, 2026.</DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <div className="flex flex-col gap-4 text-sm">
            {terms.map(({ heading, text }) => (
              <section className="flex flex-col gap-1" key={heading}>
                <h3 className="font-medium">{heading}</h3>
                <p className="text-muted-foreground">{text}</p>
              </section>
            ))}
          </div>
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Decline</DialogClose>
          <DialogClose render={<Button />}>Accept</DialogClose>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog', {
      name: 'Terms of Service',
    })
    await expect(
      within(dialog).getByRole('heading', { name: 'Payments' }),
    ).toBeInTheDocument()
    await expect(
      within(dialog).getByRole('button', { name: 'Accept' }),
    ).toBeVisible()
  },
}

const shareLink = 'https://app.example.com/invite/q4-planning'

export const ShareProject: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />}>Share</DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Share “Q4 planning”</DialogTitle>
          <DialogDescription>
            Anyone with the link can view the project. Only members can edit it.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="flex gap-2">
          <Input aria-label="Project link" defaultValue={shareLink} readOnly />
          <Button variant="outline">
            <CopyIcon aria-hidden="true" />
            Copy link
          </Button>
        </DialogPanel>
      </DialogPopup>
    </Dialog>
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog', {
      name: 'Share “Q4 planning”',
    })
    await expect(within(dialog).getByLabelText('Project link')).toHaveValue(
      shareLink,
    )
    await expect(
      within(dialog).getByRole('button', { name: 'Copy link' }),
    ).toBeVisible()
  },
}
