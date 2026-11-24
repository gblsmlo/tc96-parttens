import { CaretDownIcon, TrashIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@tc96/ui/alert-dialog'
import { Button } from '@tc96/ui/button'
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from '@tc96/ui/dialog'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Textarea } from '@tc96/ui/textarea'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/AlertDialog/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const DeleteAccount: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogTrigger render={<Button variant="destructive-outline" />}>
        Delete account
      </AlertDialogTrigger>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes your account and removes your data from our
            servers. It cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            Cancel
          </AlertDialogClose>
          <AlertDialogClose render={<Button variant="destructive" />}>
            Delete account
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  ),
  play: async () => {
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Delete your account?',
    })
    await expect(
      within(dialog).getByRole('button', { name: 'Delete account' }),
    ).toBeVisible()
  },
}

export const DiscardCampaign: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogTrigger
        render={
          <Button
            aria-label="Discard campaign"
            size="icon-sm"
            variant="ghost"
          />
        }
      >
        <TrashIcon aria-hidden="true" />
      </AlertDialogTrigger>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard this campaign?</AlertDialogTitle>
          <AlertDialogDescription>
            Everything you filled in on this browser will be erased. It cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            Keep editing
          </AlertDialogClose>
          <AlertDialogClose render={<Button variant="destructive" />}>
            Discard campaign
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  ),
  play: async () => {
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Discard this campaign?',
    })
    await expect(
      within(dialog).getByRole('button', { name: 'Keep editing' }),
    ).toBeVisible()
  },
}

export const SessionExpired: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Your session expired</AlertDialogTitle>
          <AlertDialogDescription>
            Sign in again to keep working. Your unsaved changes stay in this
            browser.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter variant="bare">
          <AlertDialogClose render={<Button />}>Sign in</AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  ),
  play: async () => {
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Your session expired',
    })
    await expect(within(dialog).getAllByRole('button')).toHaveLength(1)
  },
}

function PlaylistMenu() {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <Menu>
        <MenuTrigger render={<Button variant="outline" />}>
          Road trip
          <CaretDownIcon aria-hidden="true" />
        </MenuTrigger>
        <MenuPopup align="start">
          <MenuItem>Play</MenuItem>
          <MenuItem>Share</MenuItem>
          <MenuSeparator />
          <MenuItem onClick={() => setConfirmOpen(true)} variant="destructive">
            Delete playlist…
          </MenuItem>
        </MenuPopup>
      </Menu>
      <AlertDialog onOpenChange={setConfirmOpen} open={confirmOpen}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “Road trip”?</AlertDialogTitle>
            <AlertDialogDescription>
              The playlist and its 24 songs leave your library. It cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="ghost" />}>
              Cancel
            </AlertDialogClose>
            <AlertDialogClose render={<Button variant="destructive" />}>
              Delete playlist
            </AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </>
  )
}

export const DeleteFromMenu: Story = {
  render: () => <PlaylistMenu />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Road trip' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Delete playlist…' }),
    )
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Delete “Road trip”?',
    })
    await waitFor(() => expect(dialog).toBeVisible())
  },
}

const draft =
  'Hi Ana, the Q4 numbers are ready. Can we review them on Thursday at 10?'

function MessageComposer() {
  const [open, setOpen] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [message, setMessage] = useState(draft)

  const handleOpenChange = (next: boolean) => {
    if (!next && message.trim()) {
      setConfirmOpen(true)
      return
    }
    setOpen(next)
  }

  const closeAndClear = () => {
    setConfirmOpen(false)
    setOpen(false)
    setMessage('')
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger render={<Button variant="outline" />}>
        Compose
      </DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>
        <DialogPanel>
          <Textarea
            aria-label="Message"
            onChange={(event) => setMessage(event.target.value)}
            value={message}
          />
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <Button onClick={closeAndClear}>Send</Button>
        </DialogFooter>
        <AlertDialog onOpenChange={setConfirmOpen} open={confirmOpen}>
          <AlertDialogPopup>
            <AlertDialogHeader>
              <AlertDialogTitle>Discard changes?</AlertDialogTitle>
              <AlertDialogDescription>
                Your message will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogClose render={<Button variant="ghost" />}>
                Go back
              </AlertDialogClose>
              <Button onClick={closeAndClear} variant="destructive">
                Discard
              </Button>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialog>
      </DialogPopup>
    </Dialog>
  )
}

export const DiscardUnsentMessage: Story = {
  render: () => <MessageComposer />,
  play: async () => {
    const composer = await screen.findByRole('dialog', { name: 'New message' })
    await userEvent.click(
      within(composer).getByRole('button', { name: 'Cancel' }),
    )
    const confirm = await screen.findByRole('alertdialog', {
      name: 'Discard changes?',
    })
    await expect(confirm).toHaveAccessibleDescription(
      'Your message will be lost.',
    )
    await userEvent.click(
      within(confirm).getByRole('button', { name: 'Go back' }),
    )
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    await expect(composer).toBeVisible()
  },
}
