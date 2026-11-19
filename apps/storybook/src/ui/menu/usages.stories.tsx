import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from '@tc96/ui/dialog'
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from '@tc96/ui/menu'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { shortcutContrastException } from './menu-api.ts'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Menu/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Playback: Story = {
  parameters: {
    a11y: shortcutContrastException,
  },
  render: () => (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />}>Open menu</MenuTrigger>
      <MenuPopup align="start">
        <MenuGroup>
          <MenuGroupLabel>Playback</MenuGroupLabel>
          <MenuItem>
            Play
            <MenuShortcut>⌘P</MenuShortcut>
          </MenuItem>
          <MenuItem disabled>
            Pause
            <MenuShortcut>⇧⌘P</MenuShortcut>
          </MenuItem>
          <MenuItem>
            Next
            <MenuShortcut>⌘N</MenuShortcut>
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuCheckboxItem defaultChecked>Shuffle</MenuCheckboxItem>
        <MenuCheckboxItem>Repeat</MenuCheckboxItem>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Sort by</MenuGroupLabel>
          <MenuRadioGroup defaultValue="artist">
            <MenuRadioItem value="artist">Artist</MenuRadioItem>
            <MenuRadioItem value="album">Album</MenuRadioItem>
            <MenuRadioItem value="title">Title</MenuRadioItem>
          </MenuRadioGroup>
        </MenuGroup>
        <MenuSeparator />
        <MenuCheckboxItem defaultChecked variant="switch">
          Auto save
        </MenuCheckboxItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>Add to playlist</MenuSubTrigger>
          <MenuSubPopup>
            <MenuItem>Jazz</MenuItem>
            <MenuItem>Rock</MenuItem>
          </MenuSubPopup>
        </MenuSub>
        <MenuSeparator />
        <MenuItem variant="destructive">Delete</MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Open menu' }),
    )
    const menu = await screen.findByRole('menu')
    await expect(
      within(menu).getByRole('menuitemradio', { name: 'Artist' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      within(menu).getByRole('menuitem', { name: /Pause/ }),
    ).toHaveAttribute('aria-disabled', 'true')
  },
}

export const OpenADialog: Story = {
  render: function OpenADialog() {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Menu>
          <MenuTrigger render={<Button variant="outline" />}>
            Open menu
          </MenuTrigger>
          <MenuPopup>
            <MenuItem onClick={() => setOpen(true)}>Settings…</MenuItem>
          </MenuPopup>
        </Menu>
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogPopup>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Opened from a menu item, rendered outside the menu.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Done
              </DialogClose>
            </DialogFooter>
          </DialogPopup>
        </Dialog>
      </>
    )
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Open menu' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Settings…' }),
    )
    const dialog = await screen.findByRole('dialog', { name: 'Settings' })
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await userEvent.click(within(dialog).getByRole('button', { name: 'Done' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}
