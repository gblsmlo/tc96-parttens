import {
  ArchiveIcon,
  BookOpenIcon,
  CopyIcon,
  PencilSimpleIcon,
  ShareNetworkIcon,
  TrashSimpleIcon,
} from '@phosphor-icons/react'
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
  ContextMenuTrigger,
} from '@tc96/ui/context-menu'
import { type ComponentProps, useEffect, useRef } from 'react'
import type { ContextMenuControls } from './context-menu-controls.ts'

export const triggerAreaClassName =
  'flex h-40 w-72 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm'

export const rightClickAt = (area: HTMLElement, x?: number, y?: number) => {
  const { height, left, top, width } = area.getBoundingClientRect()
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    button: 2,
    cancelable: true,
    clientX: x ?? left + width / 2,
    clientY: y ?? top + height / 2,
  })
  area.dispatchEvent(event)
  return event
}

type OpenOnMountTriggerProps = ComponentProps<typeof ContextMenuTrigger> & {
  openOnMount?: boolean
}

export const OpenOnMountTrigger = ({
  openOnMount = true,
  ...props
}: Readonly<OpenOnMountTriggerProps>) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (openOnMount && ref.current) rightClickAt(ref.current)
  }, [openOnMount])

  return <ContextMenuTrigger ref={ref} {...props} />
}

interface ComposedContextMenuProps extends ContextMenuControls {
  closeOnClick?: boolean
  disabled?: boolean
  onAction?: (action: string) => void
  onCheckedChange?: (checked: boolean, details: unknown) => void
  onOpenChange?: (open: boolean, details: unknown) => void
  onValueChange?: (value: unknown, details: unknown) => void
  openOnMount?: boolean
}

export const ComposedContextMenu = ({
  align,
  checkboxItems,
  checkboxVariant,
  closeOnClick,
  destructiveItem,
  disabled,
  disabledItem,
  icons,
  inset,
  label,
  linkItem,
  onAction,
  onCheckedChange,
  onOpenChange,
  onValueChange,
  openOnMount = true,
  radioGroup,
  shortcuts,
  side,
  submenu,
  trigger,
}: Readonly<ComposedContextMenuProps>) => {
  const actions = (
    <>
      <ContextMenuItem
        aria-keyshortcuts={shortcuts ? 'Meta+E' : undefined}
        closeOnClick={closeOnClick}
        onClick={() => onAction?.('edit')}
      >
        {icons ? <PencilSimpleIcon aria-hidden="true" /> : null}
        Edit
        {shortcuts ? <ContextMenuShortcut>⌘E</ContextMenuShortcut> : null}
      </ContextMenuItem>
      <ContextMenuItem
        aria-keyshortcuts={shortcuts ? 'Meta+D' : undefined}
        closeOnClick={closeOnClick}
        onClick={() => onAction?.('duplicate')}
      >
        {icons ? <CopyIcon aria-hidden="true" /> : null}
        Duplicate
        {shortcuts ? <ContextMenuShortcut>⌘D</ContextMenuShortcut> : null}
      </ContextMenuItem>
      <ContextMenuItem
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
      </ContextMenuItem>
      {submenu ? (
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            {icons ? <ShareNetworkIcon aria-hidden="true" /> : null}
            Share
          </ContextMenuSubTrigger>
          <ContextMenuSubPopup>
            <ContextMenuItem onClick={() => onAction?.('copy-link')}>
              Copy link
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAction?.('email')}>
              Email
            </ContextMenuItem>
          </ContextMenuSubPopup>
        </ContextMenuSub>
      ) : null}
    </>
  )

  return (
    <ContextMenu disabled={disabled} onOpenChange={onOpenChange}>
      <OpenOnMountTrigger
        className={triggerAreaClassName}
        openOnMount={openOnMount}
      >
        {trigger}
      </OpenOnMountTrigger>
      <ContextMenuPopup align={align} side={side}>
        {label ? (
          <ContextMenuGroup>
            <ContextMenuGroupLabel>{label}</ContextMenuGroupLabel>
            {actions}
          </ContextMenuGroup>
        ) : (
          actions
        )}
        {checkboxItems ? (
          <>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuGroupLabel>Panels</ContextMenuGroupLabel>
              <ContextMenuCheckboxItem
                defaultChecked
                onCheckedChange={onCheckedChange}
                variant={checkboxVariant}
              >
                Toolbar
              </ContextMenuCheckboxItem>
              <ContextMenuCheckboxItem
                onCheckedChange={onCheckedChange}
                variant={checkboxVariant}
              >
                Sidebar
              </ContextMenuCheckboxItem>
            </ContextMenuGroup>
          </>
        ) : null}
        {radioGroup ? (
          <>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuGroupLabel>Density</ContextMenuGroupLabel>
              <ContextMenuRadioGroup
                defaultValue="comfortable"
                onValueChange={onValueChange}
              >
                <ContextMenuRadioItem value="compact">
                  Compact
                </ContextMenuRadioItem>
                <ContextMenuRadioItem value="comfortable">
                  Comfortable
                </ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuGroup>
          </>
        ) : null}
        {linkItem ? (
          <>
            <ContextMenuSeparator />
            <ContextMenuLinkItem href="#documentation">
              {icons ? <BookOpenIcon aria-hidden="true" /> : null}
              Documentation
            </ContextMenuLinkItem>
          </>
        ) : null}
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => onAction?.('delete')}
          variant={destructiveItem ? 'destructive' : 'default'}
        >
          {icons ? <TrashSimpleIcon aria-hidden="true" /> : null}
          Delete
        </ContextMenuItem>
      </ContextMenuPopup>
    </ContextMenu>
  )
}
