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
import { CopyIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

interface BehaviorArgs {
  onSelect: (value: unknown) => void
}

function openMenu(canvasElement: HTMLElement) {
  return userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Open menu' }),
  )
}

async function expectIndicatorAfterLabel(item: HTMLElement) {
  const label = item.querySelector<HTMLElement>(':scope > span:first-child')
  const indicator = item.querySelector<HTMLElement>(':scope > span:last-child')
  if (!label || !indicator || label === indicator)
    throw new Error('The item did not render its label and indicator.')
  await expect(indicator.getBoundingClientRect().left).toBeGreaterThanOrEqual(
    label.getBoundingClientRect().right,
  )
}

function textStart(item: HTMLElement) {
  const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT)
  const text = walker.nextNode()
  if (!text) throw new Error('The item has no text.')
  const range = document.createRange()
  range.selectNodeContents(text)
  return range.getBoundingClientRect().left
}

const trigger = (
  <MenuTrigger render={<Button variant="outline" />}>Open menu</MenuTrigger>
)

const meta = {
  args: { onSelect: fn() },
  argTypes: { onSelect: { control: false } },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Menu/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const OpenOnHover: Story = {
  render: () => (
    <Menu>
      <MenuTrigger openOnHover render={<Button variant="outline" />}>
        Open menu
      </MenuTrigger>
      <MenuPopup>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.hover(
      within(canvasElement).getByRole('button', { name: 'Open menu' }),
    )
    await expect(await screen.findByRole('menu')).toBeVisible()
  },
}

export const CheckboxItems: Story = {
  render: ({ onSelect }) => (
    <Menu>
      {trigger}
      <MenuPopup>
        <MenuCheckboxItem defaultChecked onCheckedChange={onSelect}>
          Auto save
        </MenuCheckboxItem>
        <MenuCheckboxItem onCheckedChange={onSelect}>
          Notifications
        </MenuCheckboxItem>
      </MenuPopup>
    </Menu>
  ),
  play: async ({ args, canvasElement }) => {
    await openMenu(canvasElement)
    const menu = await screen.findByRole('menu')
    const notifications = within(menu).getByRole('menuitemcheckbox', {
      name: 'Notifications',
    })
    const autoSave = within(menu).getByRole('menuitemcheckbox', {
      name: 'Auto save',
    })
    await expect(autoSave).toHaveAttribute('aria-checked', 'true')
    await expectIndicatorAfterLabel(autoSave)

    await userEvent.click(notifications)
    await expect(notifications).toHaveAttribute('aria-checked', 'true')
    await expect(args.onSelect).toHaveBeenCalledWith(true, expect.anything())
    await expect(screen.getByRole('menu')).toBeVisible()
  },
}

export const SwitchItems: Story = {
  render: ({ onSelect }) => (
    <Menu>
      {trigger}
      <MenuPopup>
        <MenuCheckboxItem
          defaultChecked
          onCheckedChange={onSelect}
          variant="switch"
        >
          Auto save
        </MenuCheckboxItem>
        <MenuCheckboxItem onCheckedChange={onSelect} variant="switch">
          Notifications
        </MenuCheckboxItem>
      </MenuPopup>
    </Menu>
  ),
  play: async ({ args, canvasElement }) => {
    await openMenu(canvasElement)
    const menu = await screen.findByRole('menu')
    const autoSave = within(menu).getByRole('menuitemcheckbox', {
      name: 'Auto save',
    })
    await userEvent.click(autoSave)
    await expect(autoSave).toHaveAttribute('aria-checked', 'false')
    await expect(args.onSelect).toHaveBeenCalledWith(false, expect.anything())
  },
}

export const RadioGroup: Story = {
  render: ({ onSelect }) => (
    <Menu>
      {trigger}
      <MenuPopup>
        <MenuRadioGroup defaultValue="system" onValueChange={onSelect}>
          <MenuRadioItem value="light">Light</MenuRadioItem>
          <MenuRadioItem value="dark">Dark</MenuRadioItem>
          <MenuRadioItem value="system">System</MenuRadioItem>
        </MenuRadioGroup>
      </MenuPopup>
    </Menu>
  ),
  play: async ({ args, canvasElement }) => {
    await openMenu(canvasElement)
    const menu = await screen.findByRole('menu')
    const system = within(menu).getByRole('menuitemradio', { name: 'System' })
    await expect(system).toHaveAttribute('aria-checked', 'true')
    await expectIndicatorAfterLabel(system)

    const dark = within(menu).getByRole('menuitemradio', { name: 'Dark' })
    await userEvent.click(dark)
    await expect(dark).toHaveAttribute('aria-checked', 'true')
    await expect(args.onSelect).toHaveBeenCalledWith('dark', expect.anything())
  },
}

export const GroupLabels: Story = {
  render: () => (
    <Menu>
      {trigger}
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel>Account</MenuGroupLabel>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Billing</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Support</MenuGroupLabel>
          <MenuItem>Docs</MenuItem>
          <MenuItem>Contact</MenuItem>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  ),
  play: async ({ canvasElement }) => {
    await openMenu(canvasElement)
    const menu = await screen.findByRole('menu')
    await expect(
      within(menu).getByRole('group', { name: 'Account' }),
    ).toBeVisible()
    await expect(
      within(menu).getByRole('group', { name: 'Support' }),
    ).toBeVisible()
    await expect(within(menu).getByRole('separator')).toBeVisible()
  },
}

export const InsetAndShortcuts: Story = {
  render: () => (
    <Menu>
      {trigger}
      <MenuPopup>
        <MenuItem aria-keyshortcuts="Meta+E">
          <PencilIcon />
          Edit
          <MenuShortcut>⌘E</MenuShortcut>
        </MenuItem>
        <MenuItem aria-keyshortcuts="Meta+D">
          <CopyIcon />
          Duplicate
          <MenuShortcut>⌘D</MenuShortcut>
        </MenuItem>
        <MenuItem inset>Move to…</MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async ({ canvasElement }) => {
    await openMenu(canvasElement)
    const menu = await screen.findByRole('menu')
    const moveTo = within(menu).getByRole('menuitem', { name: 'Move to…' })
    const edit = within(menu).getByRole('menuitem', { name: 'Edit' })
    await expect(moveTo).toHaveAttribute('data-inset', 'true')
    await expect(textStart(moveTo)).toBeCloseTo(textStart(edit), 0)
    await expect(edit).toHaveAttribute('aria-keyshortcuts', 'Meta+E')
    await expect(edit).toHaveTextContent('⌘E')
  },
}

export const DisabledItem: Story = {
  render: ({ onSelect }) => (
    <Menu>
      {trigger}
      <MenuPopup>
        <MenuItem onClick={() => onSelect('play')}>Play</MenuItem>
        <MenuItem disabled onClick={() => onSelect('pause')}>
          Pause
          <span className="ms-auto text-muted-foreground text-xs">
            Nothing is playing
          </span>
        </MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async ({ args, canvasElement }) => {
    await openMenu(canvasElement)
    const menu = await screen.findByRole('menu')
    const pause = within(menu).getByRole('menuitem', {
      name: 'Pause Nothing is playing',
    })
    await expect(pause).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(pause, { pointerEventsCheck: 0 })
    await expect(args.onSelect).not.toHaveBeenCalled()
  },
}

export const DestructiveItem: Story = {
  render: ({ onSelect }) => (
    <Menu>
      {trigger}
      <MenuPopup>
        <MenuItem onClick={() => onSelect('rename')}>Rename</MenuItem>
        <MenuSeparator />
        <MenuItem onClick={() => onSelect('delete')} variant="destructive">
          <TrashIcon />
          Delete
        </MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async ({ args, canvasElement }) => {
    await openMenu(canvasElement)
    const menu = await screen.findByRole('menu')
    const remove = within(menu).getByRole('menuitem', { name: 'Delete' })
    await expect(remove).toHaveAttribute('data-variant', 'destructive')
    await userEvent.click(remove)
    await expect(args.onSelect).toHaveBeenCalledWith('delete')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const KeepOpenOnClick: Story = {
  render: ({ onSelect }) => (
    <Menu>
      {trigger}
      <MenuPopup>
        <MenuItem closeOnClick={false} onClick={() => onSelect('zoom-in')}>
          Zoom in
        </MenuItem>
        <MenuItem closeOnClick={false} onClick={() => onSelect('zoom-out')}>
          Zoom out
        </MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async ({ args, canvasElement }) => {
    await openMenu(canvasElement)
    const menu = await screen.findByRole('menu')
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Zoom in' }),
    )
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Zoom in' }),
    )
    await expect(args.onSelect).toHaveBeenCalledTimes(2)
    await expect(screen.getByRole('menu')).toBeVisible()
  },
}

export const LinkItems: Story = {
  render: () => (
    <Menu>
      {trigger}
      <MenuPopup>
        <MenuLinkItem href="#docs">Docs</MenuLinkItem>
        <MenuLinkItem href="#particles">Particles</MenuLinkItem>
      </MenuPopup>
    </Menu>
  ),
  play: async ({ canvasElement }) => {
    await openMenu(canvasElement)
    const menu = await screen.findByRole('menu')
    const docs = within(menu).getByRole('menuitem', { name: 'Docs' })
    await expect(docs.tagName).toBe('A')
    await expect(docs).toHaveAttribute('href', '#docs')
  },
}

export const NestedMenu: Story = {
  render: ({ onSelect }) => (
    <Menu>
      {trigger}
      <MenuPopup>
        <MenuItem>Profile</MenuItem>
        <MenuSub>
          <MenuSubTrigger>More</MenuSubTrigger>
          <MenuSubPopup>
            <MenuItem onClick={() => onSelect('archive')}>Archive</MenuItem>
            <MenuItem>Export</MenuItem>
          </MenuSubPopup>
        </MenuSub>
        <MenuItem>Settings</MenuItem>
      </MenuPopup>
    </Menu>
  ),
  play: async ({ args, canvasElement }) => {
    await openMenu(canvasElement)
    const menu = await screen.findByRole('menu')
    const more = within(menu).getByRole('menuitem', { name: 'More' })
    await expect(more).toHaveAttribute('aria-haspopup', 'menu')

    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}')
    await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(2))
    await expect(more).toHaveAttribute('data-popup-open')

    await userEvent.click(screen.getByRole('menuitem', { name: 'Archive' }))
    await expect(args.onSelect).toHaveBeenCalledWith('archive')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}
