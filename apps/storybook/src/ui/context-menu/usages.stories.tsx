import {
  ArrowBendUpLeftIcon,
  CopyIcon,
  DownloadSimpleIcon,
  FileTextIcon,
  FolderOpenIcon,
  PencilSimpleIcon,
  PushPinIcon,
  TrashSimpleIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuItem,
  ContextMenuLinkItem,
  ContextMenuPopup,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubPopup,
  ContextMenuSubTrigger,
} from '@tc96/ui/context-menu'
import { expect, screen } from 'storybook/test'
import { OpenOnMountTrigger } from './context-menu-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/ContextMenu/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const FileInList: Story = {
  render: () => (
    <ContextMenu>
      <OpenOnMountTrigger className="flex w-80 items-center gap-3 rounded-lg border p-3">
        <FileTextIcon aria-hidden="true" className="size-5 shrink-0" />
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-sm">Q3 roadmap.pdf</span>
          <span className="text-muted-foreground text-xs">
            2.4 MB · Edited yesterday by Ana Lima
          </span>
        </span>
      </OpenOnMountTrigger>
      <ContextMenuPopup>
        <ContextMenuItem aria-keyshortcuts="F2">
          <PencilSimpleIcon aria-hidden="true" />
          Rename
          <ContextMenuShortcut>F2</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <CopyIcon aria-hidden="true" />
          Make a copy
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <FolderOpenIcon aria-hidden="true" />
            Move to
          </ContextMenuSubTrigger>
          <ContextMenuSubPopup>
            <ContextMenuItem>Planning</ContextMenuItem>
            <ContextMenuItem>Shared with me</ContextMenuItem>
            <ContextMenuItem>Archive</ContextMenuItem>
          </ContextMenuSubPopup>
        </ContextMenuSub>
        <ContextMenuLinkItem download href="#q3-roadmap.pdf">
          <DownloadSimpleIcon aria-hidden="true" />
          Download
        </ContextMenuLinkItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <TrashSimpleIcon aria-hidden="true" />
          Move to trash
        </ContextMenuItem>
      </ContextMenuPopup>
    </ContextMenu>
  ),
  play: async () => {
    await expect(
      await screen.findByRole('menuitem', { name: 'Move to trash' }),
    ).toHaveAttribute('data-variant', 'destructive')
    await expect(
      screen.getByRole('menuitem', { name: 'Move to' }),
    ).toHaveAttribute('aria-haspopup', 'menu')
  },
}

export const BrowserPage: Story = {
  render: () => (
    <ContextMenu>
      <OpenOnMountTrigger className="flex h-48 w-96 items-center justify-center rounded-lg border bg-muted/40 p-6 text-center text-muted-foreground text-sm">
        Release notes · Version 4.2 adds offline drafts and faster search.
      </OpenOnMountTrigger>
      <ContextMenuPopup>
        <ContextMenuItem aria-keyshortcuts="Meta+[">
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <span className="ms-auto text-muted-foreground text-xs">
            No next page
          </span>
        </ContextMenuItem>
        <ContextMenuItem aria-keyshortcuts="Meta+R">
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem defaultChecked>
          Show bookmarks bar
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Always show full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuLinkItem href="#page-source">
          View page source
        </ContextMenuLinkItem>
      </ContextMenuPopup>
    </ContextMenu>
  ),
  play: async () => {
    await expect(
      await screen.findByRole('menuitem', { name: 'Forward No next page' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await expect(
      screen.getByRole('menuitemcheckbox', { name: 'Show bookmarks bar' }),
    ).toHaveAttribute('aria-checked', 'true')
  },
}

export const BoardCanvas: Story = {
  render: () => (
    <ContextMenu>
      <OpenOnMountTrigger className="grid h-56 w-[28rem] place-items-center rounded-lg border bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[16px_16px] text-muted-foreground text-sm">
        Sprint 14 board
      </OpenOnMountTrigger>
      <ContextMenuPopup className="w-56">
        <ContextMenuGroup>
          <ContextMenuGroupLabel>Edit</ContextMenuGroupLabel>
          <ContextMenuItem aria-keyshortcuts="Meta+V">
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem aria-keyshortcuts="Meta+A">
            Select all cards
            <ContextMenuShortcut>⌘A</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuGroupLabel>View</ContextMenuGroupLabel>
          <ContextMenuCheckboxItem defaultChecked variant="switch">
            Snap to grid
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem variant="switch">
            Show card ages
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuGroupLabel>Zoom</ContextMenuGroupLabel>
          <ContextMenuRadioGroup defaultValue="fit">
            <ContextMenuRadioItem value="fit">Fit board</ContextMenuRadioItem>
            <ContextMenuRadioItem value="100">100%</ContextMenuRadioItem>
            <ContextMenuRadioItem value="200">200%</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuPopup>
    </ContextMenu>
  ),
  play: async () => {
    await expect(
      await screen.findByRole('group', { name: 'Zoom' }),
    ).toBeVisible()
    await expect(
      screen.getByRole('menuitemradio', { name: 'Fit board' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      screen.getByRole('menuitemcheckbox', { name: 'Snap to grid' }),
    ).toHaveAttribute('aria-checked', 'true')
  },
}

export const ChatMessage: Story = {
  render: () => (
    <ContextMenu>
      <OpenOnMountTrigger className="flex w-80 flex-col gap-1 rounded-lg border p-3">
        <span className="font-medium text-sm">Ana Lima</span>
        <span className="text-sm">
          Can we move the design review to Thursday at 3 pm?
        </span>
      </OpenOnMountTrigger>
      <ContextMenuPopup>
        <ContextMenuItem>
          <ArrowBendUpLeftIcon aria-hidden="true" />
          Reply
        </ContextMenuItem>
        <ContextMenuItem aria-keyshortcuts="Meta+C">
          <CopyIcon aria-hidden="true" />
          Copy text
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <PushPinIcon aria-hidden="true" />
          Pin to channel
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Forward to</ContextMenuSubTrigger>
          <ContextMenuSubPopup>
            <ContextMenuItem>#design</ContextMenuItem>
            <ContextMenuItem>#product</ContextMenuItem>
            <ContextMenuItem>Bruno Costa</ContextMenuItem>
          </ContextMenuSubPopup>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <TrashSimpleIcon aria-hidden="true" />
          Delete message
        </ContextMenuItem>
      </ContextMenuPopup>
    </ContextMenu>
  ),
  play: async () => {
    await expect(
      await screen.findByRole('menuitem', { name: 'Copy text' }),
    ).toBeVisible()
    await expect(
      screen.getByRole('menuitem', { name: 'Delete message' }),
    ).toHaveAttribute('data-variant', 'destructive')
  },
}
