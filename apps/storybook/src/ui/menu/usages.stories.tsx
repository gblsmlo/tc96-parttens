import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
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
import {
  CopyIcon,
  CreditCardIcon,
  EllipsisIcon,
  FolderInputIcon,
  LifeBuoyIcon,
  LogOutIcon,
  PencilIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
} from 'lucide-react'
import { expect, screen } from 'storybook/test'
import { DialogFromMenu } from './menu-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Menu/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Playback: Story = {
  render: () => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger render={<Button variant="outline" />}>Playback</MenuTrigger>
      <MenuPopup align="start">
        <MenuGroup>
          <MenuGroupLabel>Playback</MenuGroupLabel>
          <MenuItem aria-keyshortcuts="Meta+P">
            Play
            <MenuShortcut>⌘P</MenuShortcut>
          </MenuItem>
          <MenuItem disabled>
            Pause
            <span className="ms-auto text-muted-foreground text-xs">
              Nothing playing
            </span>
          </MenuItem>
          <MenuItem aria-keyshortcuts="Meta+N">
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
  play: async () => {
    const menu = await screen.findByRole('menu')
    await expect(
      await screen.findByRole('menuitemradio', { name: 'Artist' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      screen.getByRole('menuitem', { name: 'Pause Nothing playing' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await expect(menu).toBeVisible()
  },
}

export const AccountMenu: Story = {
  render: () => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger render={<Button variant="ghost" />}>Ana Lima</MenuTrigger>
      <MenuPopup align="end" className="w-56">
        <MenuGroup>
          <MenuGroupLabel>ana.lima@acme.com</MenuGroupLabel>
          <MenuItem>
            <UserIcon />
            Profile
          </MenuItem>
          <MenuItem>
            <CreditCardIcon />
            Billing
          </MenuItem>
          <MenuItem aria-keyshortcuts="Meta+,">
            <SettingsIcon />
            Settings
            <MenuShortcut>⌘,</MenuShortcut>
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuLinkItem href="#help-center">
          <LifeBuoyIcon />
          Help center
        </MenuLinkItem>
        <MenuSeparator />
        <MenuItem>
          <LogOutIcon />
          Log out
        </MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async () => {
    const account = await screen.findByRole('group', {
      name: 'ana.lima@acme.com',
    })
    await expect(account).toBeVisible()
    await expect(
      screen.getByRole('menuitem', { name: 'Help center' }),
    ).toHaveAttribute('href', '#help-center')
  },
}

export const RowActions: Story = {
  render: () => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger
        aria-label="More actions for Q3 roadmap"
        render={<Button size="icon" variant="ghost" />}
      >
        <EllipsisIcon />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem>
          <PencilIcon />
          Rename
        </MenuItem>
        <MenuItem>
          <CopyIcon />
          Duplicate
        </MenuItem>
        <MenuSub>
          <MenuSubTrigger>
            <FolderInputIcon />
            Move to
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuItem>Backlog</MenuItem>
            <MenuItem>In progress</MenuItem>
            <MenuItem>Done</MenuItem>
          </MenuSubPopup>
        </MenuSub>
        <MenuSeparator />
        <MenuItem variant="destructive">
          <TrashIcon />
          Delete document
        </MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async () => {
    await expect(
      await screen.findByRole('menuitem', { name: 'Delete document' }),
    ).toHaveAttribute('data-variant', 'destructive')
    await expect(
      screen.getByRole('menuitem', { name: 'Move to' }),
    ).toHaveAttribute('aria-haspopup', 'menu')
  },
}

export const ViewSettings: Story = {
  render: () => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger render={<Button variant="outline" />}>View</MenuTrigger>
      <MenuPopup align="start" className="w-56">
        <MenuGroup>
          <MenuGroupLabel>Group by</MenuGroupLabel>
          <MenuRadioGroup defaultValue="status">
            <MenuRadioItem value="status">Status</MenuRadioItem>
            <MenuRadioItem value="owner">Owner</MenuRadioItem>
            <MenuRadioItem value="none">No grouping</MenuRadioItem>
          </MenuRadioGroup>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Columns</MenuGroupLabel>
          <MenuCheckboxItem defaultChecked>Title</MenuCheckboxItem>
          <MenuCheckboxItem defaultChecked>Owner</MenuCheckboxItem>
          <MenuCheckboxItem>Due date</MenuCheckboxItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuCheckboxItem variant="switch">Show empty groups</MenuCheckboxItem>
      </MenuPopup>
    </Menu>
  ),
  play: async () => {
    await expect(
      await screen.findByRole('menuitemradio', { name: 'Status' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      screen.getByRole('menuitemcheckbox', { name: 'Due date' }),
    ).toHaveAttribute('aria-checked', 'false')
  },
}

export const OpenADialog: Story = {
  render: () => <DialogFromMenu />,
  play: async () => {
    await expect(
      await screen.findByRole('menuitem', { name: 'Settings…' }),
    ).toBeVisible()
  },
}
