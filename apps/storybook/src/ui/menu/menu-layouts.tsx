import {
  ArchiveIcon,
  BookOpenIcon,
  ClockCounterClockwiseIcon,
  CopyIcon,
  DotsThreeIcon,
  EnvelopeIcon,
  FileTextIcon,
  FlagIcon,
  GlobeIcon,
  LinkIcon,
  LockIcon,
  PencilSimpleIcon,
  ShareNetworkIcon,
  TrashSimpleIcon,
  UsersIcon,
} from '@phosphor-icons/react'
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
import { type ReactNode, useState } from 'react'
import type { MenuControls } from './menu-controls.ts'

interface ComposedMenuProps extends MenuControls {
  children?: ReactNode
  closeOnClick?: boolean
  iconTrigger?: boolean
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
  children,
  closeOnClick,
  iconTrigger,
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
        {icons ? <PencilSimpleIcon aria-hidden="true" /> : null}
        Edit
        {shortcuts ? <MenuShortcut>⌘E</MenuShortcut> : null}
      </MenuItem>
      <MenuItem
        aria-keyshortcuts={shortcuts ? 'Meta+D' : undefined}
        closeOnClick={closeOnClick}
        onClick={() => onAction?.('duplicate')}
      >
        {icons ? <CopyIcon aria-hidden="true" /> : null}
        Duplicate
        {shortcuts ? <MenuShortcut>⌘D</MenuShortcut> : null}
      </MenuItem>
      <MenuItem
        disabled={disabledItem}
        inset={inset || undefined}
        onClick={() => onAction?.('archive')}
      >
        {icons && !inset ? <ArchiveIcon aria-hidden="true" /> : null}
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
            {icons ? <ShareNetworkIcon aria-hidden="true" /> : null}
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
      {iconTrigger ? (
        <MenuTrigger
          aria-label={trigger}
          openOnHover={openOnHover}
          render={<Button size="icon" variant="ghost" />}
        >
          <DotsThreeIcon aria-hidden="true" />
        </MenuTrigger>
      ) : (
        <MenuTrigger
          openOnHover={openOnHover}
          render={<Button variant="outline" />}
        >
          {trigger}
        </MenuTrigger>
      )}
      <MenuPopup align={align} side={side}>
        {children ?? (
          <>
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
                    <MenuRadioItem value="comfortable">
                      Comfortable
                    </MenuRadioItem>
                  </MenuRadioGroup>
                </MenuGroup>
              </>
            ) : null}
            {linkItem ? (
              <>
                <MenuSeparator />
                <MenuLinkItem href="#documentation">
                  {icons ? <BookOpenIcon aria-hidden="true" /> : null}
                  Documentation
                </MenuLinkItem>
              </>
            ) : null}
            <MenuSeparator />
            <MenuItem
              onClick={() => onAction?.('delete')}
              variant={destructiveItem ? 'destructive' : 'default'}
            >
              {icons ? <TrashSimpleIcon aria-hidden="true" /> : null}
              Delete
            </MenuItem>
          </>
        )}
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

export const LabelledGroupsBody = () => (
  <>
    <MenuGroup>
      <MenuGroupLabel>Edit</MenuGroupLabel>
      <MenuItem>
        <PencilSimpleIcon aria-hidden="true" />
        Rename
      </MenuItem>
      <MenuItem>
        <CopyIcon aria-hidden="true" />
        Duplicate
      </MenuItem>
    </MenuGroup>
    <MenuSeparator />
    <MenuGroup>
      <MenuGroupLabel>Share</MenuGroupLabel>
      <MenuItem>
        <LinkIcon aria-hidden="true" />
        Copy link
      </MenuItem>
      <MenuItem>
        <EnvelopeIcon aria-hidden="true" />
        Email
      </MenuItem>
    </MenuGroup>
    <MenuSeparator />
    <MenuItem variant="destructive">
      <TrashSimpleIcon aria-hidden="true" />
      Delete
    </MenuItem>
  </>
)

export const HeaderOverGroupsBody = () => (
  <>
    <MenuGroup>
      <MenuGroupLabel>
        <span className="flex items-center gap-2">
          <FileTextIcon aria-hidden="true" className="size-8 shrink-0" />
          <span className="grid">
            <span className="text-foreground text-sm">Document</span>
            <span className="font-normal">Edited 2 hours ago</span>
          </span>
        </span>
      </MenuGroupLabel>
      <MenuItem>
        <PencilSimpleIcon aria-hidden="true" />
        Edit
      </MenuItem>
      <MenuItem>
        <CopyIcon aria-hidden="true" />
        Duplicate
      </MenuItem>
    </MenuGroup>
    <MenuSeparator />
    <MenuItem>
      <ArchiveIcon aria-hidden="true" />
      Archive
    </MenuItem>
    <MenuSeparator />
    <MenuItem variant="destructive">
      <TrashSimpleIcon aria-hidden="true" />
      Delete
    </MenuItem>
  </>
)

const versions = [
  { author: 'Edited 2 hours ago', name: 'Version 3' },
  { author: 'Edited yesterday', name: 'Version 2' },
  { author: 'Edited last week', name: 'Version 1' },
]

export const TwoLineItemsBody = () => (
  <>
    <MenuGroup>
      <MenuGroupLabel>Versions</MenuGroupLabel>
      {versions.map((version) => (
        <MenuItem key={version.name}>
          <ClockCounterClockwiseIcon aria-hidden="true" />
          <span className="grid">
            <span>{version.name}</span>
            <span className="text-muted-foreground text-xs">
              {version.author}
            </span>
          </span>
        </MenuItem>
      ))}
    </MenuGroup>
    <MenuSeparator />
    <MenuItem className="justify-center">All versions</MenuItem>
  </>
)

const visibilities = [
  {
    description: 'Only you',
    icon: LockIcon,
    label: 'Private',
    value: 'private',
  },
  {
    description: 'Everyone in the team',
    icon: UsersIcon,
    label: 'Team',
    value: 'team',
  },
  {
    description: 'Anyone with the link',
    icon: GlobeIcon,
    label: 'Public',
    value: 'public',
  },
]

export const TwoLineRadioItemsBody = ({
  onValueChange,
}: Readonly<{
  onValueChange?: (value: unknown, details: unknown) => void
}>) => (
  <MenuGroup>
    <MenuGroupLabel>Visibility</MenuGroupLabel>
    <MenuRadioGroup defaultValue="team" onValueChange={onValueChange}>
      {visibilities.map(({ description, icon: Icon, label, value }) => (
        <MenuRadioItem key={value} value={value}>
          <Icon aria-hidden="true" />
          <span className="grid">
            <span>{label}</span>
            <span className="text-muted-foreground text-xs">{description}</span>
          </span>
        </MenuRadioItem>
      ))}
    </MenuRadioGroup>
  </MenuGroup>
)

const statuses = ['Draft', 'In review', 'Published']

export const RadioGroupInSubmenuBody = ({
  onValueChange,
}: Readonly<{
  onValueChange?: (value: unknown, details: unknown) => void
}>) => {
  const [status, setStatus] = useState('Draft')

  return (
    <>
      <MenuItem>
        <PencilSimpleIcon aria-hidden="true" />
        Edit
      </MenuItem>
      <MenuItem>
        <CopyIcon aria-hidden="true" />
        Duplicate
      </MenuItem>
      <MenuSub>
        <MenuSubTrigger>
          <FlagIcon aria-hidden="true" />
          Status
          <span className="ms-auto text-muted-foreground text-xs">
            {status}
          </span>
        </MenuSubTrigger>
        <MenuSubPopup>
          <MenuRadioGroup
            onValueChange={(value, details) => {
              setStatus(String(value))
              onValueChange?.(value, details)
            }}
            value={status}
          >
            {statuses.map((value) => (
              <MenuRadioItem key={value} value={value}>
                {value}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuSubPopup>
      </MenuSub>
      <MenuSeparator />
      <MenuItem variant="destructive">
        <TrashSimpleIcon aria-hidden="true" />
        Delete
      </MenuItem>
    </>
  )
}
