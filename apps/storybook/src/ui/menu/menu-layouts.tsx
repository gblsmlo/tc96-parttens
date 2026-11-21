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
  ArchiveIcon,
  BookOpenIcon,
  CopyIcon,
  PencilIcon,
  Share2Icon,
  TrashIcon,
} from 'lucide-react'
import { useState } from 'react'
import type { MenuControls } from './menu-controls.ts'

interface ComposedMenuProps extends MenuControls {
  closeOnClick?: boolean
  defaultOpen?: boolean
  onAction?: (action: string) => void
  onCheckedChange?: (checked: boolean, details: unknown) => void
  onOpenChange?: (open: boolean, details: unknown) => void
  onValueChange?: (value: unknown, details: unknown) => void
  openOnHover?: boolean
}

export const ComposedMenu = ({
  align,
  checkboxItems,
  checkboxVariant,
  closeOnClick,
  defaultOpen = true,
  destructiveItem,
  disabledItem,
  icons,
  inset,
  label,
  linkItem,
  onAction,
  onCheckedChange,
  onOpenChange,
  onValueChange,
  openOnHover,
  radioGroup,
  shortcuts,
  side,
  submenu,
  trigger,
}: Readonly<ComposedMenuProps>) => {
  const actions = (
    <>
      <MenuItem
        aria-keyshortcuts={shortcuts ? 'Meta+E' : undefined}
        closeOnClick={closeOnClick}
        onClick={() => onAction?.('edit')}
      >
        {icons ? <PencilIcon /> : null}
        Edit
        {shortcuts ? <MenuShortcut>⌘E</MenuShortcut> : null}
      </MenuItem>
      <MenuItem
        aria-keyshortcuts={shortcuts ? 'Meta+D' : undefined}
        closeOnClick={closeOnClick}
        onClick={() => onAction?.('duplicate')}
      >
        {icons ? <CopyIcon /> : null}
        Duplicate
        {shortcuts ? <MenuShortcut>⌘D</MenuShortcut> : null}
      </MenuItem>
      <MenuItem
        disabled={disabledItem}
        inset={inset || undefined}
        onClick={() => onAction?.('archive')}
      >
        {icons && !inset ? <ArchiveIcon /> : null}
        Archive
        {disabledItem ? (
          <span className="ms-auto text-muted-foreground text-xs">
            Already archived
          </span>
        ) : null}
      </MenuItem>
      {submenu ? (
        <MenuSub>
          <MenuSubTrigger>
            {icons ? <Share2Icon /> : null}
            Share
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuItem onClick={() => onAction?.('copy-link')}>
              Copy link
            </MenuItem>
            <MenuItem onClick={() => onAction?.('email')}>Email</MenuItem>
          </MenuSubPopup>
        </MenuSub>
      ) : null}
    </>
  )

  return (
    <Menu
      defaultOpen={defaultOpen}
      modal={!defaultOpen}
      onOpenChange={onOpenChange}
    >
      <MenuTrigger
        openOnHover={openOnHover}
        render={<Button variant="outline" />}
      >
        {trigger}
      </MenuTrigger>
      <MenuPopup align={align} side={side}>
        {label ? (
          <MenuGroup>
            <MenuGroupLabel>{label}</MenuGroupLabel>
            {actions}
          </MenuGroup>
        ) : (
          actions
        )}
        {checkboxItems ? (
          <>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel>Panels</MenuGroupLabel>
              <MenuCheckboxItem
                defaultChecked
                onCheckedChange={onCheckedChange}
                variant={checkboxVariant}
              >
                Toolbar
              </MenuCheckboxItem>
              <MenuCheckboxItem
                onCheckedChange={onCheckedChange}
                variant={checkboxVariant}
              >
                Sidebar
              </MenuCheckboxItem>
            </MenuGroup>
          </>
        ) : null}
        {radioGroup ? (
          <>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel>Density</MenuGroupLabel>
              <MenuRadioGroup
                defaultValue="comfortable"
                onValueChange={onValueChange}
              >
                <MenuRadioItem value="compact">Compact</MenuRadioItem>
                <MenuRadioItem value="comfortable">Comfortable</MenuRadioItem>
              </MenuRadioGroup>
            </MenuGroup>
          </>
        ) : null}
        {linkItem ? (
          <>
            <MenuSeparator />
            <MenuLinkItem href="#documentation">
              {icons ? <BookOpenIcon /> : null}
              Documentation
            </MenuLinkItem>
          </>
        ) : null}
        <MenuSeparator />
        <MenuItem
          onClick={() => onAction?.('delete')}
          variant={destructiveItem ? 'destructive' : 'default'}
        >
          {icons ? <TrashIcon /> : null}
          Delete
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}

export const DialogFromMenu = ({
  defaultOpen = true,
}: Readonly<{ defaultOpen?: boolean }>) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Menu defaultOpen={defaultOpen} modal={!defaultOpen}>
        <MenuTrigger render={<Button variant="outline" />}>Project</MenuTrigger>
        <MenuPopup>
          <MenuItem onClick={() => setOpen(true)}>Settings…</MenuItem>
        </MenuPopup>
      </Menu>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Project settings</DialogTitle>
            <DialogDescription>
              Rename the project, change who can see it or archive it.
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
}
