import {
  CopyIcon,
  DownloadSimpleIcon,
  ListPlusIcon,
  PencilSimpleIcon,
  ShareNetworkIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerCreateHandle,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerMenu,
  DrawerMenuCheckboxItem,
  DrawerMenuGroup,
  DrawerMenuGroupLabel,
  DrawerMenuItem,
  DrawerMenuRadioGroup,
  DrawerMenuRadioItem,
  DrawerMenuSeparator,
  DrawerMenuTrigger,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from '@tc96/ui/drawer'
import { useState } from 'react'
import { type DrawerControls, drawerControlArgs } from './drawer-controls.ts'

interface ComposedDrawerProps extends DrawerControls {
  defaultOpen?: boolean
  onAction?: () => void
  onOpenChange?: (open: boolean) => void
}

export const ComposedDrawer = ({
  actionLabel,
  body,
  cancelLabel,
  defaultOpen = true,
  description,
  footer,
  footerVariant,
  onAction,
  onOpenChange,
  position,
  showBar,
  showCloseButton,
  title,
  trigger,
  variant,
}: Readonly<ComposedDrawerProps>) => (
  <Drawer
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    position={position}
  >
    <DrawerTrigger render={<Button variant="outline" />}>
      {trigger}
    </DrawerTrigger>
    <DrawerPopup
      showBar={showBar}
      showCloseButton={showCloseButton}
      variant={variant}
    >
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        {description ? (
          <DrawerDescription>{description}</DrawerDescription>
        ) : null}
      </DrawerHeader>
      {body ? (
        <DrawerPanel>
          <p className="text-sm">{body}</p>
        </DrawerPanel>
      ) : null}
      {footer ? (
        <DrawerFooter variant={footerVariant}>
          <DrawerClose render={<Button variant="ghost" />}>
            {cancelLabel}
          </DrawerClose>
          <Button onClick={onAction}>{actionLabel}</Button>
        </DrawerFooter>
      ) : null}
    </DrawerPopup>
  </Drawer>
)

const sections = Array.from({ length: 30 }, (_, index) => index + 1)

const LongContent = () => (
  <div className="flex flex-col gap-4 text-sm">
    {sections.map((section) => (
      <p key={section}>
        Section {section} of a long content. The panel scrolls while the header
        and the footer stay in place.
      </p>
    ))}
  </div>
)

interface ScrollingPanelDrawerProps {
  scrollable?: boolean
}

export const ScrollingPanelDrawer = ({
  scrollable = true,
}: Readonly<ScrollingPanelDrawerProps>) => (
  <Drawer defaultOpen>
    <DrawerTrigger render={<Button variant="outline" />}>
      {drawerControlArgs.trigger}
    </DrawerTrigger>
    <DrawerPopup showBar>
      <DrawerHeader>
        <DrawerTitle>{drawerControlArgs.title}</DrawerTitle>
        <DrawerDescription>{drawerControlArgs.description}</DrawerDescription>
      </DrawerHeader>
      <DrawerPanel scrollable={scrollable}>
        <LongContent />
      </DrawerPanel>
      <DrawerFooter>
        <DrawerClose render={<Button variant="ghost" />}>
          {drawerControlArgs.cancelLabel}
        </DrawerClose>
        <Button>{drawerControlArgs.actionLabel}</Button>
      </DrawerFooter>
    </DrawerPopup>
  </Drawer>
)

export const snapPoints = ['300px', 1]

export const SnapPointsDrawer = () => (
  <Drawer defaultOpen snapPoints={snapPoints}>
    <DrawerTrigger render={<Button variant="outline" />}>
      {drawerControlArgs.trigger}
    </DrawerTrigger>
    <DrawerPopup showBar>
      <DrawerHeader>
        <DrawerTitle>{drawerControlArgs.title}</DrawerTitle>
        <DrawerDescription>{drawerControlArgs.description}</DrawerDescription>
      </DrawerHeader>
      <DrawerPanel>
        <LongContent />
      </DrawerPanel>
    </DrawerPopup>
  </Drawer>
)

export const DetachedTriggerDrawer = () => {
  const [handle] = useState(() => DrawerCreateHandle())

  return (
    <div className="flex flex-col items-center gap-3">
      <DrawerTrigger handle={handle} render={<Button variant="outline" />}>
        {drawerControlArgs.trigger}
      </DrawerTrigger>
      <Drawer defaultOpen handle={handle}>
        <DrawerPopup showBar>
          <DrawerHeader>
            <DrawerTitle>{drawerControlArgs.title}</DrawerTitle>
            <DrawerDescription>
              {drawerControlArgs.description}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerPanel>
            <p className="text-sm">{drawerControlArgs.body}</p>
          </DrawerPanel>
          <DrawerFooter>
            <DrawerClose render={<Button variant="ghost" />}>
              {drawerControlArgs.cancelLabel}
            </DrawerClose>
            <Button>{drawerControlArgs.actionLabel}</Button>
          </DrawerFooter>
        </DrawerPopup>
      </Drawer>
    </div>
  )
}

export const nestedTitle = 'Confirm details'

export const nestedTrigger = 'Continue'

export const NestedDrawer = () => (
  <Drawer defaultOpen>
    <DrawerTrigger render={<Button variant="outline" />}>
      {drawerControlArgs.trigger}
    </DrawerTrigger>
    <DrawerPopup showBar>
      <DrawerHeader>
        <DrawerTitle>{drawerControlArgs.title}</DrawerTitle>
        <DrawerDescription>{drawerControlArgs.description}</DrawerDescription>
      </DrawerHeader>
      <DrawerPanel>
        <p className="text-sm">{drawerControlArgs.body}</p>
      </DrawerPanel>
      <DrawerFooter>
        <DrawerClose render={<Button variant="ghost" />}>
          {drawerControlArgs.cancelLabel}
        </DrawerClose>
        <Drawer>
          <DrawerTrigger render={<Button />}>{nestedTrigger}</DrawerTrigger>
          <DrawerPopup showBar>
            <DrawerHeader>
              <DrawerTitle>{nestedTitle}</DrawerTitle>
              <DrawerDescription>
                Opens over the first drawer, which steps back behind it.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose render={<Button variant="ghost" />}>
                Back
              </DrawerClose>
              <Button>{drawerControlArgs.actionLabel}</Button>
            </DrawerFooter>
          </DrawerPopup>
        </Drawer>
      </DrawerFooter>
    </DrawerPopup>
  </Drawer>
)

export const menuLabel = 'Item actions'

export const menuMoveTitle = 'Move to'

const folders = ['Inbox', 'Archive', 'Shared']

interface MenuDrawerProps {
  onOpenChange?: (open: boolean) => void
  onSelect?: (item: string) => void
}

export const MenuDrawer = ({
  onOpenChange,
  onSelect,
}: Readonly<MenuDrawerProps>) => (
  <Drawer defaultOpen onOpenChange={onOpenChange}>
    <DrawerTrigger render={<Button variant="outline" />}>
      {drawerControlArgs.trigger}
    </DrawerTrigger>
    <DrawerPopup aria-label={menuLabel} showBar>
      <DrawerPanel>
        <DrawerMenu>
          <DrawerMenuGroup>
            <DrawerMenuGroupLabel>Actions</DrawerMenuGroupLabel>
            <DrawerMenuItem onClick={() => onSelect?.('Rename')}>
              Rename
            </DrawerMenuItem>
            <DrawerClose
              render={
                <DrawerMenuItem onClick={() => onSelect?.('Duplicate')} />
              }
            >
              Duplicate
            </DrawerClose>
          </DrawerMenuGroup>
          <DrawerMenuSeparator />
          <DrawerMenuCheckboxItem defaultChecked>
            Show details
          </DrawerMenuCheckboxItem>
          <DrawerMenuSeparator />
          <DrawerMenuGroup>
            <DrawerMenuGroupLabel>Sort by</DrawerMenuGroupLabel>
            <DrawerMenuRadioGroup defaultValue="name">
              <DrawerMenuRadioItem value="name">Name</DrawerMenuRadioItem>
              <DrawerMenuRadioItem value="date">Date</DrawerMenuRadioItem>
            </DrawerMenuRadioGroup>
          </DrawerMenuGroup>
          <DrawerMenuSeparator />
          <Drawer>
            <DrawerMenuTrigger>{menuMoveTitle}</DrawerMenuTrigger>
            <DrawerPopup aria-label={menuMoveTitle} showBar>
              <DrawerPanel>
                <DrawerMenu>
                  <DrawerMenuGroup>
                    <DrawerMenuGroupLabel>{menuMoveTitle}</DrawerMenuGroupLabel>
                    {folders.map((folder) => (
                      <DrawerMenuItem key={folder}>{folder}</DrawerMenuItem>
                    ))}
                  </DrawerMenuGroup>
                </DrawerMenu>
              </DrawerPanel>
            </DrawerPopup>
          </Drawer>
        </DrawerMenu>
      </DrawerPanel>
    </DrawerPopup>
  </Drawer>
)

const playlists = ['Morning run', 'Focus', 'Road trip']

interface SongActionsDrawerProps {
  onDownload?: () => void
}

export const SongActionsDrawer = ({
  onDownload,
}: Readonly<SongActionsDrawerProps>) => {
  const [quality, setQuality] = useState('high')

  return (
    <Drawer defaultOpen>
      <DrawerTrigger render={<Button variant="outline" />}>
        Song options
      </DrawerTrigger>
      <DrawerPopup aria-label="Options for Harbor Lights" showBar>
        <DrawerPanel>
          <DrawerMenu>
            <DrawerMenuGroup>
              <DrawerMenuGroupLabel>
                Harbor Lights · Nora Vale
              </DrawerMenuGroupLabel>
              <DrawerClose render={<DrawerMenuItem />}>
                <ShareNetworkIcon aria-hidden="true" />
                Share
              </DrawerClose>
              <DrawerClose render={<DrawerMenuItem />}>
                <CopyIcon aria-hidden="true" />
                Copy song link
              </DrawerClose>
              <Drawer>
                <DrawerMenuTrigger>
                  <ListPlusIcon aria-hidden="true" />
                  Add to playlist
                </DrawerMenuTrigger>
                <DrawerPopup aria-label="Add to playlist" showBar>
                  <DrawerPanel>
                    <DrawerMenu>
                      <DrawerMenuGroup>
                        <DrawerMenuGroupLabel>
                          Your playlists
                        </DrawerMenuGroupLabel>
                        {playlists.map((playlist) => (
                          <DrawerMenuItem key={playlist}>
                            {playlist}
                          </DrawerMenuItem>
                        ))}
                      </DrawerMenuGroup>
                    </DrawerMenu>
                  </DrawerPanel>
                </DrawerPopup>
              </Drawer>
              <DrawerMenuItem disabled onClick={onDownload}>
                <DownloadSimpleIcon aria-hidden="true" />
                Download for offline
              </DrawerMenuItem>
            </DrawerMenuGroup>
            <DrawerMenuSeparator />
            <DrawerMenuCheckboxItem defaultChecked variant="switch">
              Autoplay similar songs
            </DrawerMenuCheckboxItem>
            <DrawerMenuSeparator />
            <DrawerMenuGroup>
              <DrawerMenuGroupLabel>Streaming quality</DrawerMenuGroupLabel>
              <DrawerMenuRadioGroup onValueChange={setQuality} value={quality}>
                <DrawerMenuRadioItem value="normal">
                  Normal, 96 kbps
                </DrawerMenuRadioItem>
                <DrawerMenuRadioItem value="high">
                  High, 160 kbps
                </DrawerMenuRadioItem>
                <DrawerMenuRadioItem value="very-high">
                  Very high, 320 kbps
                </DrawerMenuRadioItem>
              </DrawerMenuRadioGroup>
            </DrawerMenuGroup>
            <DrawerMenuSeparator />
            <DrawerMenuItem>
              <PencilSimpleIcon aria-hidden="true" />
              Edit song details
            </DrawerMenuItem>
            <DrawerClose render={<DrawerMenuItem variant="destructive" />}>
              <TrashIcon aria-hidden="true" />
              Remove from library
            </DrawerClose>
          </DrawerMenu>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  )
}
