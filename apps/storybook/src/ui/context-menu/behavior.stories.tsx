import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { contextMenuControlArgs } from './context-menu-controls.ts'
import { ComposedContextMenu, rightClickAt } from './context-menu-layouts.tsx'

interface BehaviorArgs {
  onAction: (action: string) => void
  onCheckedChange: (checked: boolean, details: unknown) => void
  onOpenChange: (open: boolean, details: unknown) => void
  onValueChange: (value: unknown, details: unknown) => void
}

const closed = { ...contextMenuControlArgs, openOnMount: false }

const getArea = (canvasElement: HTMLElement) =>
  within(canvasElement).getByText(contextMenuControlArgs.trigger)

const openContextMenu = async (canvasElement: HTMLElement) => {
  await userEvent.pointer({
    keys: '[MouseRight]',
    target: getArea(canvasElement),
  })
  return screen.findByRole('menu')
}

const closeMenus = async () => {
  const open = screen.queryAllByRole('menu').length
  for (let index = 0; index < open; index++)
    await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
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

const touch = (type: string, target: HTMLElement, x: number, y: number) => {
  const point = new Touch({ clientX: x, clientY: y, identifier: 1, target })
  const touches = type === 'touchend' ? [] : [point]
  target.dispatchEvent(
    new TouchEvent(type, {
      bubbles: true,
      cancelable: true,
      changedTouches: [point],
      targetTouches: touches,
      touches,
    }),
  )
}

const meta = {
  args: {
    onAction: fn(),
    onCheckedChange: fn(),
    onOpenChange: fn(),
    onValueChange: fn(),
  },
  argTypes: {
    onAction: { control: false },
    onCheckedChange: { control: false },
    onOpenChange: { control: false },
    onValueChange: { control: false },
  },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/ContextMenu/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const OpensOnRightClick: Story = {
  render: ({ onOpenChange }) => (
    <ComposedContextMenu {...closed} onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const area = getArea(canvasElement)
    await expect(area).not.toHaveAttribute('data-popup-open')
    const menu = await openContextMenu(canvasElement)
    await expect(area).toHaveAttribute('data-popup-open')
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.anything(),
    )
    await expect(within(menu).getAllByRole('menuitem')).toHaveLength(4)
    await closeMenus()
  },
}

export const ReplacesBrowserMenu: Story = {
  render: () => <ComposedContextMenu {...closed} />,
  play: async ({ canvasElement }) => {
    const event = rightClickAt(getArea(canvasElement))
    await expect(event.defaultPrevented).toBe(true)
    await expect(await screen.findByRole('menu')).toBeVisible()
    await closeMenus()
  },
}

export const OpensAtPointer: Story = {
  decorators: [
    (Story) => (
      <div className="p-16">
        <Story />
      </div>
    ),
  ],
  render: () => <ComposedContextMenu {...closed} />,
  play: async ({ canvasElement }) => {
    const area = getArea(canvasElement)
    const { left, top, width } = area.getBoundingClientRect()
    const x = Math.round(left + width / 2)
    const y = Math.round(top + 24)
    await userEvent.pointer({
      coords: { clientX: x, clientY: y },
      keys: '[MouseRight]',
      target: area,
    })
    const menu = await screen.findByRole('menu')
    await expect(menu).toHaveAttribute('data-side', 'bottom')
    await expect(menu).toHaveAttribute('data-align', 'center')
    await waitFor(() => {
      const popup = menu.getBoundingClientRect()
      expect(Math.abs(popup.top - (y + 4))).toBeLessThan(2)
      expect(Math.abs(popup.left + popup.width / 2 - x)).toBeLessThan(2)
    })
    await closeMenus()
  },
}

export const OpensOnLongPress: Story = {
  render: () => <ComposedContextMenu {...closed} />,
  play: async ({ canvasElement }) => {
    const area = getArea(canvasElement)
    const { height, left, top, width } = area.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    touch('touchstart', area, x, y)
    await expect(
      await screen.findByRole('menu', undefined, { timeout: 3000 }),
    ).toBeVisible()
    touch('touchend', area, x, y)
    await closeMenus()
  },
}

export const DisabledKeepsBrowserMenu: Story = {
  render: () => <ComposedContextMenu {...closed} disabled />,
  play: async ({ canvasElement }) => {
    const area = getArea(canvasElement)
    const event = rightClickAt(area)
    await expect(event.defaultPrevented).toBe(false)
    await userEvent.pointer({ keys: '[MouseRight]', target: area })
    await expect(screen.queryByRole('menu')).toBeNull()
    await expect(area).not.toHaveAttribute('data-popup-open')
  },
}

export const PopupMinimumWidth: Story = {
  render: () => <ComposedContextMenu {...closed} icons={false} />,
  play: async ({ canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    await expect(menu.getBoundingClientRect().width).toBeGreaterThanOrEqual(160)
    await closeMenus()
  },
}

export const FocusOutlineOnKeyboard: Story = {
  render: () => <ComposedContextMenu {...closed} />,
  play: async ({ canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    const edit = within(menu).getByRole('menuitem', { name: 'Edit' })
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(edit).toHaveFocus())
    await expect(getComputedStyle(edit).outlineStyle).toBe('solid')
    await closeMenus()
  },
}

export const ClosesOnEscape: Story = {
  render: ({ onOpenChange }) => (
    <ComposedContextMenu {...closed} onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    await openContextMenu(canvasElement)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.anything(),
    )
  },
}

export const ClosesOnSelect: Story = {
  render: ({ onAction }) => (
    <ComposedContextMenu {...closed} onAction={onAction} />
  ),
  play: async ({ args, canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Duplicate' }),
    )
    await expect(args.onAction).toHaveBeenCalledWith('duplicate')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const KeepOpenOnClick: Story = {
  render: ({ onAction }) => (
    <ComposedContextMenu {...closed} closeOnClick={false} onAction={onAction} />
  ),
  play: async ({ args, canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Edit' }))
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Edit' }))
    await expect(args.onAction).toHaveBeenCalledTimes(2)
    await expect(screen.getByRole('menu')).toBeVisible()
    await closeMenus()
  },
}

export const CheckboxToggles: Story = {
  render: ({ onCheckedChange }) => (
    <ComposedContextMenu
      {...closed}
      checkboxItems
      onCheckedChange={onCheckedChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    const toolbar = within(menu).getByRole('menuitemcheckbox', {
      name: 'Toolbar',
    })
    const sidebar = within(menu).getByRole('menuitemcheckbox', {
      name: 'Sidebar',
    })
    await expect(toolbar).toHaveAttribute('aria-checked', 'true')
    await expect(sidebar).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(sidebar)
    await expect(sidebar).toHaveAttribute('aria-checked', 'true')
    await expect(args.onCheckedChange).toHaveBeenCalledWith(
      true,
      expect.anything(),
    )
    await expect(screen.getByRole('menu')).toBeVisible()
    await closeMenus()
  },
}

export const SwitchToggles: Story = {
  render: ({ onCheckedChange }) => (
    <ComposedContextMenu
      {...closed}
      checkboxItems
      checkboxVariant="switch"
      onCheckedChange={onCheckedChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    const toolbar = within(menu).getByRole('menuitemcheckbox', {
      name: 'Toolbar',
    })
    await userEvent.click(toolbar)
    await expect(toolbar).toHaveAttribute('aria-checked', 'false')
    await expect(args.onCheckedChange).toHaveBeenCalledWith(
      false,
      expect.anything(),
    )
    await closeMenus()
  },
}

export const RadioSelects: Story = {
  render: ({ onValueChange }) => (
    <ComposedContextMenu {...closed} onValueChange={onValueChange} radioGroup />
  ),
  play: async ({ args, canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    const comfortable = within(menu).getByRole('menuitemradio', {
      name: 'Comfortable',
    })
    await expect(comfortable).toHaveAttribute('aria-checked', 'true')
    const compact = within(menu).getByRole('menuitemradio', {
      name: 'Compact',
    })
    await userEvent.click(compact)
    await expect(compact).toHaveAttribute('aria-checked', 'true')
    await expect(comfortable).toHaveAttribute('aria-checked', 'false')
    await expect(args.onValueChange).toHaveBeenCalledWith(
      'compact',
      expect.anything(),
    )
    await closeMenus()
  },
}

export const CheckAfterLabel: Story = {
  render: () => <ComposedContextMenu {...closed} checkboxItems radioGroup />,
  play: async ({ canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    await expectIndicatorAfterLabel(
      within(menu).getByRole('menuitemcheckbox', { name: 'Toolbar' }),
    )
    await expectIndicatorAfterLabel(
      within(menu).getByRole('menuitemradio', { name: 'Comfortable' }),
    )
    await closeMenus()
  },
}

export const GroupsNamedByLabel: Story = {
  render: () => (
    <ComposedContextMenu {...closed} checkboxItems label="Actions" />
  ),
  play: async ({ canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    await expect(
      within(menu).getByRole('group', { name: 'Actions' }),
    ).toBeVisible()
    await expect(
      within(menu).getByRole('group', { name: 'Panels' }),
    ).toBeVisible()
    await closeMenus()
  },
}

export const InsetAlignsLabels: Story = {
  render: () => <ComposedContextMenu {...closed} inset />,
  play: async ({ canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    const archive = within(menu).getByRole('menuitem', { name: 'Archive' })
    const edit = within(menu).getByRole('menuitem', { name: 'Edit' })
    await expect(archive).toHaveAttribute('data-inset', 'true')
    await expect(textStart(archive)).toBeCloseTo(textStart(edit), 0)
    await closeMenus()
  },
}

export const ShortcutOutOfName: Story = {
  render: () => <ComposedContextMenu {...closed} shortcuts />,
  play: async ({ canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    const edit = within(menu).getByRole('menuitem', { name: 'Edit' })
    await expect(edit).toHaveTextContent('⌘E')
    await closeMenus()
  },
}

export const DisabledItemIgnoresClick: Story = {
  render: ({ onAction }) => (
    <ComposedContextMenu {...closed} disabledItem onAction={onAction} />
  ),
  play: async ({ args, canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    const archive = within(menu).getByRole('menuitem', {
      name: 'Archive Already archived',
    })
    await expect(archive).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(archive, { pointerEventsCheck: 0 })
    await expect(args.onAction).not.toHaveBeenCalled()
    await closeMenus()
  },
}

export const DestructiveItemRuns: Story = {
  render: ({ onAction }) => (
    <ComposedContextMenu {...closed} destructiveItem onAction={onAction} />
  ),
  play: async ({ args, canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    const remove = within(menu).getByRole('menuitem', { name: 'Delete' })
    await expect(remove).toHaveAttribute('data-variant', 'destructive')
    await userEvent.click(remove)
    await expect(args.onAction).toHaveBeenCalledWith('delete')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const LinkItemIsAnchor: Story = {
  render: () => <ComposedContextMenu {...closed} linkItem />,
  play: async ({ canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    const link = within(menu).getByRole('menuitem', { name: 'Documentation' })
    await expect(link.tagName).toBe('A')
    await closeMenus()
  },
}

const openSubmenu = async (canvasElement: HTMLElement) => {
  const menu = await openContextMenu(canvasElement)
  const share = within(menu).getByRole('menuitem', { name: 'Share' })
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}')
  await waitFor(() => expect(share).toHaveFocus())
  await userEvent.keyboard('{ArrowRight}')
  await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(2))
  return share
}

export const SubmenuOpensWithKeyboard: Story = {
  render: () => <ComposedContextMenu {...closed} submenu />,
  play: async ({ canvasElement }) => {
    const share = await openSubmenu(canvasElement)
    await expect(share).toHaveAttribute('aria-haspopup', 'menu')
    await expect(share).toHaveAttribute('data-popup-open')
    await closeMenus()
  },
}

export const SubmenuItemClosesAll: Story = {
  render: ({ onAction }) => (
    <ComposedContextMenu {...closed} onAction={onAction} submenu />
  ),
  play: async ({ args, canvasElement }) => {
    await openSubmenu(canvasElement)
    await userEvent.click(screen.getByRole('menuitem', { name: 'Copy link' }))
    await expect(args.onAction).toHaveBeenCalledWith('copy-link')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}
