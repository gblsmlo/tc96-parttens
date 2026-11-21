import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  expect,
  fn,
  isInaccessible,
  screen,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import { drawerControlArgs } from './drawer-controls.ts'
import {
  ComposedDrawer,
  DetachedTriggerDrawer,
  MenuDrawer,
  menuLabel,
  menuMoveTitle,
  NestedDrawer,
  nestedTitle,
  nestedTrigger,
  ScrollingPanelDrawer,
  SnapPointsDrawer,
  SongActionsDrawer,
} from './drawer-layouts.tsx'

interface BehaviorArgs {
  onAction: () => void
  onDownload: () => void
  onOpenChange: (open: boolean) => void
  onSelect: (item: string) => void
}

const { actionLabel, cancelLabel, description, title, trigger } =
  drawerControlArgs

const desktop = { viewport: { isRotated: false, value: 'desktop' } }

const mobile = { viewport: { isRotated: false, value: 'mobile2' } }

const pageWidth = () => document.documentElement.clientWidth

const pageHeight = () => window.innerHeight

const popupOf = (drawer: HTMLElement) =>
  drawer.closest('[data-slot="drawer-popup"]') as HTMLElement

const openDrawer = async () => popupOf(await screen.findByRole('dialog'))

const closeDrawer = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
}

const centerOf = (element: Element) => {
  const box = element.getBoundingClientRect()
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 }
}

const dragDown = async (element: Element, distance: number) => {
  const { x, y } = centerOf(element)
  const steps = [0.25, 0.5, 0.75, 1]
  await userEvent.pointer([
    {
      coords: { clientX: x, clientY: y },
      keys: '[MouseLeft>]',
      target: element,
    },
    ...steps.map((step) => ({
      coords: { clientX: x, clientY: y + distance * step },
    })),
    { keys: '[/MouseLeft]' },
  ])
}

const meta = {
  args: {
    onAction: fn(),
    onDownload: fn(),
    onOpenChange: fn(),
    onSelect: fn(),
  },
  argTypes: {
    onAction: { control: false },
    onDownload: { control: false },
    onOpenChange: { control: false },
    onSelect: { control: false },
  },
  tags: ['!autodocs'],
  title: 'UI/Drawer/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const OpensFromTrigger: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDrawer
      {...drawerControlArgs}
      defaultOpen={false}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.click(button)
    const drawer = await screen.findByRole('dialog')
    await waitFor(() => expect(drawer).toBeVisible())
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    )
    await expect(button).toHaveAttribute('data-popup-open')
    await closeDrawer()
  },
}

export const NamedByTitle: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} />,
  play: async () => {
    const drawer = await screen.findByRole('dialog', { name: title })
    await expect(drawer).toHaveAccessibleDescription(description)
    await closeDrawer()
  },
}

export const FocusMovesToPopup: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} defaultOpen={false} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: trigger }),
    )
    const drawer = await screen.findByRole('dialog')
    await waitFor(() => expect(popupOf(drawer)).toHaveFocus())
    await expect(
      within(drawer).getByRole('button', { name: cancelLabel }),
    ).not.toHaveFocus()
    await closeDrawer()
  },
}

export const FocusStaysInside: Story = {
  render: () => (
    <ComposedDrawer
      {...drawerControlArgs}
      defaultOpen={false}
      showCloseButton
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: trigger }),
    )
    const drawer = await screen.findByRole('dialog')
    const cancel = within(drawer).getByRole('button', { name: cancelLabel })
    const action = within(drawer).getByRole('button', { name: actionLabel })
    const close = within(drawer).getByRole('button', { name: 'Close' })
    await waitFor(() => expect(popupOf(drawer)).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(cancel).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(action).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(close).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(cancel).toHaveFocus())
    await userEvent.tab({ shift: true })
    await waitFor(() => expect(close).toHaveFocus())
    await closeDrawer()
  },
}

export const ClosesOnOutsidePress: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDrawer {...drawerControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args }) => {
    await screen.findByRole('dialog')
    const viewport = document.querySelector(
      '[data-slot="drawer-viewport"]',
    ) as HTMLElement
    await userEvent.pointer({
      coords: { clientX: pageWidth() / 2, clientY: 40 },
      keys: '[MouseLeft]',
      target: viewport,
    })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'outside-press' }),
    )
  },
}

export const EscapeRestoresFocus: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDrawer
      {...drawerControlArgs}
      defaultOpen={false}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await userEvent.click(button)
    await screen.findByRole('dialog')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'escape-key' }),
    )
    await waitFor(() => expect(button).toHaveFocus())
  },
}

export const CloseButtonIsOptIn: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} />,
  play: async () => {
    const drawer = await screen.findByRole('dialog', { name: title })
    await expect(
      within(drawer).queryByRole('button', { name: 'Close' }),
    ).toBeNull()
    await closeDrawer()
  },
}

export const CloseButtonRestoresFocus: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDrawer
      {...drawerControlArgs}
      defaultOpen={false}
      onOpenChange={onOpenChange}
      showCloseButton
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await userEvent.click(button)
    const drawer = await screen.findByRole('dialog')
    await userEvent.click(within(drawer).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    )
    await waitFor(() => expect(button).toHaveFocus())
  },
}

export const ActionKeepsOpen: Story = {
  render: ({ onAction, onOpenChange }) => (
    <ComposedDrawer
      {...drawerControlArgs}
      onAction={onAction}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args }) => {
    const drawer = await screen.findByRole('dialog')
    await userEvent.click(
      within(drawer).getByRole('button', { name: actionLabel }),
    )
    await expect(args.onAction).toHaveBeenCalledOnce()
    await expect(drawer).toBeVisible()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
    await closeDrawer()
  },
}

export const CancelCloses: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDrawer {...drawerControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args }) => {
    const drawer = await screen.findByRole('dialog')
    await userEvent.click(
      within(drawer).getByRole('button', { name: cancelLabel }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    )
  },
}

export const SwipeDownCloses: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDrawer {...drawerControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args }) => {
    const drawer = await screen.findByRole('dialog', { name: title })
    await waitFor(() =>
      expect(popupOf(drawer).getBoundingClientRect().bottom).toBeCloseTo(
        pageHeight(),
        0,
      ),
    )
    await dragDown(within(drawer).getByRole('heading', { name: title }), 300)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'swipe' }),
    )
  },
}

export const PanelDragDoesNotSwipe: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDrawer {...drawerControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args }) => {
    const drawer = await screen.findByRole('dialog', { name: title })
    await waitFor(() =>
      expect(popupOf(drawer).getBoundingClientRect().bottom).toBeCloseTo(
        pageHeight(),
        0,
      ),
    )
    await dragDown(within(drawer).getByText(drawerControlArgs.body), 300)
    await expect(screen.getByRole('dialog', { name: title })).toBeVisible()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
    await closeDrawer()
  },
}

export const PositionSetsSwipeDirection: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} position="right" />,
  play: async () => {
    const popup = await openDrawer()
    await expect(popup).toHaveAttribute('data-swipe-direction', 'right')
    await closeDrawer()
  },
}

export const BottomSpansWidth: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} />,
  play: async () => {
    const popup = await openDrawer()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().bottom).toBeCloseTo(pageHeight(), 0),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.left).toBeCloseTo(0, 0)
    await expect(box.width).toBeCloseTo(pageWidth(), 0)
    await expect(box.top).toBeGreaterThan(pageHeight() / 2)
    await expect(
      Number.parseFloat(getComputedStyle(popup).borderTopLeftRadius),
    ).toBeGreaterThan(0)
    await expect(getComputedStyle(popup).borderBottomLeftRadius).toBe('0px')
    await closeDrawer()
  },
}

export const TopSpansWidth: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} position="top" />,
  play: async () => {
    const popup = await openDrawer()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().top).toBeCloseTo(0, 0),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.left).toBeCloseTo(0, 0)
    await expect(box.width).toBeCloseTo(pageWidth(), 0)
    await expect(box.bottom).toBeLessThan(pageHeight() / 2)
    await closeDrawer()
  },
}

export const RightSpansHeight: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} position="right" />,
  play: async () => {
    const popup = await openDrawer()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().right).toBeCloseTo(pageWidth(), 0),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.top).toBeCloseTo(0, 0)
    await expect(box.bottom).toBeCloseTo(pageHeight(), 0)
    await expect(box.width).toBeCloseTo(448, 0)
    await closeDrawer()
  },
}

export const LeftSpansHeight: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} position="left" />,
  play: async () => {
    const popup = await openDrawer()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().left).toBeCloseTo(0, 0),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.top).toBeCloseTo(0, 0)
    await expect(box.bottom).toBeCloseTo(pageHeight(), 0)
    await expect(box.width).toBeCloseTo(448, 0)
    await closeDrawer()
  },
}

export const LeavesPageVisibleOnMobile: Story = {
  globals: mobile,
  render: () => <ComposedDrawer {...drawerControlArgs} position="right" />,
  play: async () => {
    const popup = await openDrawer()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().right).toBeCloseTo(pageWidth(), 0),
    )
    await expect(popup.getBoundingClientRect().left).toBeCloseTo(48, 0)
    await closeDrawer()
  },
}

export const StraightHasNoRadius: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} variant="straight" />,
  play: async () => {
    const popup = await openDrawer()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().bottom).toBeCloseTo(pageHeight(), 0),
    )
    await expect(getComputedStyle(popup).borderTopLeftRadius).toBe('0px')
    await closeDrawer()
  },
}

export const InsetFloatsOnWideScreens: Story = {
  globals: desktop,
  render: () => <ComposedDrawer {...drawerControlArgs} variant="inset" />,
  play: async () => {
    const popup = await openDrawer()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().bottom).toBeCloseTo(
        pageHeight() - 16,
        0,
      ),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.left).toBeCloseTo(16, 0)
    await expect(box.right).toBeCloseTo(pageWidth() - 16, 0)
    await expect(
      Number.parseFloat(getComputedStyle(popup).borderBottomLeftRadius),
    ).toBeGreaterThan(0)
    await closeDrawer()
  },
}

export const InsetFlushOnMobile: Story = {
  globals: mobile,
  render: () => <ComposedDrawer {...drawerControlArgs} variant="inset" />,
  play: async () => {
    const popup = await openDrawer()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().bottom).toBeCloseTo(pageHeight(), 0),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.left).toBeCloseTo(0, 0)
    await expect(box.width).toBeCloseTo(pageWidth(), 0)
    await expect(getComputedStyle(popup).borderBottomLeftRadius).toBe('0px')
    await closeDrawer()
  },
}

export const BarHiddenFromAssistiveTech: Story = {
  render: () => <ComposedDrawer {...drawerControlArgs} />,
  play: async () => {
    const popup = await openDrawer()
    const bar = popup.querySelector('[data-slot="drawer-bar"]') as HTMLElement
    await expect(bar).toBeInTheDocument()
    await expect(isInaccessible(bar)).toBe(true)
    await closeDrawer()
  },
}

export const PanelScrollsInside: Story = {
  render: () => <ScrollingPanelDrawer />,
  play: async () => {
    const drawer = await screen.findByRole('dialog', { name: title })
    const viewport = drawer.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement
    await waitFor(() =>
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight),
    )
    const box = popupOf(drawer).getBoundingClientRect()
    await expect(box.bottom).toBeLessThanOrEqual(pageHeight())
    await expect(
      within(drawer).getByRole('button', { name: actionLabel }),
    ).toBeVisible()
    await expect(
      within(drawer).getByRole('heading', { name: title }),
    ).toBeVisible()
    await closeDrawer()
  },
}

export const NotScrollableHasNoScrollArea: Story = {
  render: () => <ScrollingPanelDrawer scrollable={false} />,
  play: async () => {
    const drawer = await screen.findByRole('dialog', { name: title })
    await expect(drawer.querySelector('[data-slot="drawer-panel"]')).not.toBe(
      null,
    )
    await expect(
      drawer.querySelector('[data-slot="scroll-area-viewport"]'),
    ).toBeNull()
    await closeDrawer()
  },
}

export const OpensAtFirstSnapPoint: Story = {
  render: () => <SnapPointsDrawer />,
  play: async () => {
    const popup = await openDrawer()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().top).toBeCloseTo(
        pageHeight() - 300,
        0,
      ),
    )
    await expect(popup.getBoundingClientRect().height).toBeGreaterThan(300)
    await closeDrawer()
  },
}

export const DetachedTriggerOpens: Story = {
  render: () => <DetachedTriggerDrawer />,
  play: async ({ canvasElement }) => {
    await screen.findByRole('dialog', { name: title })
    await closeDrawer()
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await userEvent.click(button)
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: title })).toBeVisible(),
    )
    await expect(button).toHaveAttribute('data-popup-open')
    await closeDrawer()
  },
}

export const NestedStepsBack: Story = {
  render: () => <NestedDrawer />,
  play: async () => {
    const parent = await screen.findByRole('dialog', { name: title })
    await userEvent.click(
      within(parent).getByRole('button', { name: nestedTrigger }),
    )
    const nested = await screen.findByRole('dialog', { name: nestedTitle })
    await waitFor(() => expect(nested).toBeVisible())
    await waitFor(() =>
      expect(popupOf(parent)).toHaveAttribute('data-nested-drawer-open'),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: nestedTitle })).toBeNull(),
    )
    await expect(screen.getByRole('dialog', { name: title })).toBeVisible()
    await waitFor(() =>
      expect(popupOf(parent)).not.toHaveAttribute('data-nested-drawer-open'),
    )
    await closeDrawer()
  },
}

export const MenuItemKeepsOpen: Story = {
  render: ({ onOpenChange, onSelect }) => (
    <MenuDrawer onOpenChange={onOpenChange} onSelect={onSelect} />
  ),
  play: async ({ args }) => {
    const drawer = await screen.findByRole('dialog', { name: menuLabel })
    await userEvent.click(
      within(drawer).getByRole('button', { name: 'Rename' }),
    )
    await expect(args.onSelect).toHaveBeenLastCalledWith('Rename')
    await expect(args.onOpenChange).not.toHaveBeenCalled()
    await expect(drawer).toHaveAttribute('data-open')
    await closeDrawer()
  },
}

export const MenuItemInCloseCloses: Story = {
  render: ({ onOpenChange, onSelect }) => (
    <MenuDrawer onOpenChange={onOpenChange} onSelect={onSelect} />
  ),
  play: async ({ args }) => {
    const drawer = await screen.findByRole('dialog', { name: menuLabel })
    await userEvent.click(
      within(drawer).getByRole('button', { name: 'Duplicate' }),
    )
    await expect(args.onSelect).toHaveBeenLastCalledWith('Duplicate')
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const CheckboxItemToggles: Story = {
  render: ({ onOpenChange }) => <MenuDrawer onOpenChange={onOpenChange} />,
  play: async ({ args }) => {
    const drawer = await screen.findByRole('dialog', { name: menuLabel })
    const item = within(drawer).getByRole('checkbox', { name: 'Show details' })
    await expect(item).toBeChecked()
    await userEvent.click(item)
    await expect(item).not.toBeChecked()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
    await expect(drawer).toHaveAttribute('data-open')
    await closeDrawer()
  },
}

export const RadioItemSelectsOne: Story = {
  render: ({ onOpenChange }) => <MenuDrawer onOpenChange={onOpenChange} />,
  play: async ({ args }) => {
    const drawer = await screen.findByRole('dialog', { name: menuLabel })
    const name = within(drawer).getByRole('radio', { name: 'Name' })
    const date = within(drawer).getByRole('radio', { name: 'Date' })
    await expect(name).toBeChecked()
    await userEvent.click(date)
    await expect(date).toBeChecked()
    await expect(name).not.toBeChecked()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
    await closeDrawer()
  },
}

export const MenuTriggerOpensNested: Story = {
  render: () => <MenuDrawer />,
  play: async () => {
    const drawer = await screen.findByRole('dialog', { name: menuLabel })
    await userEvent.click(
      within(drawer).getByRole('button', { name: menuMoveTitle }),
    )
    const nested = await screen.findByRole('dialog', { name: menuMoveTitle })
    await waitFor(() => expect(nested).toBeVisible())
    await expect(
      within(nested).getByRole('button', { name: 'Archive' }),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: menuMoveTitle })).toBeNull(),
    )
    await closeDrawer()
  },
}

export const DisabledItemIgnoresClicks: Story = {
  render: ({ onDownload }) => <SongActionsDrawer onDownload={onDownload} />,
  play: async ({ args }) => {
    const drawer = await screen.findByRole('dialog')
    const item = within(drawer).getByRole('button', {
      name: 'Download for offline',
    })
    await expect(item).toBeDisabled()
    await expect(getComputedStyle(item).pointerEvents).toBe('none')
    item.click()
    await expect(args.onDownload).not.toHaveBeenCalled()
    await closeDrawer()
  },
}
