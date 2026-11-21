import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { scrollAreaControlArgs } from './scroll-area-controls.ts'
import {
  BothAxesScrollArea,
  ComposedScrollArea,
  FillScrollArea,
  longFileName,
  NestedScrollArea,
} from './scroll-area-layouts.tsx'

const viewportOf = (element: Element) =>
  element.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement

const rootOf = (canvasElement: HTMLElement) =>
  viewportOf(canvasElement).parentElement as HTMLElement

const scrollbarsOf = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<HTMLElement>(
      ':scope > [data-slot="scroll-area-scrollbar"]',
    ),
  )

const verticalScrollbarOf = (root: HTMLElement) =>
  root.querySelector(
    ':scope > [data-slot="scroll-area-scrollbar"][data-orientation="vertical"]',
  ) as HTMLElement

const opaqueStopOf = (maskImage: string, direction: string) =>
  maskImage.match(
    new RegExp(`linear-gradient\\(${direction}rgb\\(0, 0, 0\\) ([^,]+),`),
  )?.[1]

const fadeOf = (viewport: HTMLElement) => {
  const { maskImage } = getComputedStyle(viewport)
  return {
    bottom: opaqueStopOf(maskImage, ''),
    top: opaqueStopOf(maskImage, 'to top, '),
  }
}

const waitForOverflow = async (root: HTMLElement) =>
  waitFor(() => expect(root).toHaveAttribute('data-has-overflow-y'))

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/ScrollArea/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ClassNameOnRoot: Story = {
  render: () => <ComposedScrollArea {...scrollAreaControlArgs} />,
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement)
    const viewport = viewportOf(canvasElement)
    await expect(root).toHaveClass('h-72', 'rounded-lg', 'border')
    await expect(viewport).not.toHaveClass('h-72')
    const box = viewport.getBoundingClientRect()
    await expect(box.height).toBe(root.clientHeight)
    await expect(box.width).toBe(root.clientWidth)
  },
}

export const ScrollbarPerOverflowingAxis: Story = {
  render: () => <ComposedScrollArea {...scrollAreaControlArgs} />,
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement)
    await waitForOverflow(root)
    await expect(root).not.toHaveAttribute('data-has-overflow-x')
    const scrollbars = scrollbarsOf(root)
    await expect(scrollbars).toHaveLength(1)
    await expect(scrollbars[0]).toHaveAttribute('data-orientation', 'vertical')
    await expect(
      root.querySelector('[data-slot="scroll-area-corner"]'),
    ).toBeNull()
  },
}

export const BothScrollbarsAndCorner: Story = {
  render: () => <BothAxesScrollArea />,
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement)
    await waitFor(() => expect(root).toHaveAttribute('data-has-overflow-x'))
    await expect(root).toHaveAttribute('data-has-overflow-y')
    const orientations = scrollbarsOf(root).map((scrollbar) =>
      scrollbar.getAttribute('data-orientation'),
    )
    await expect(orientations).toEqual(['vertical', 'horizontal'])
    await expect(
      root.querySelector('[data-slot="scroll-area-corner"]'),
    ).not.toBeNull()
  },
}

export const ScrollbarsHiddenFromAssistiveTech: Story = {
  render: () => <BothAxesScrollArea />,
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement)
    await waitFor(() => expect(scrollbarsOf(root)).toHaveLength(2))
    for (const scrollbar of scrollbarsOf(root))
      await expect(scrollbar).toHaveAttribute('aria-hidden', 'true')
    await expect(
      root.querySelector('[data-slot="scroll-area-corner"]'),
    ).toHaveAttribute('aria-hidden', 'true')
  },
}

export const NoScrollbarWithoutOverflow: Story = {
  render: () => <ComposedScrollArea {...scrollAreaControlArgs} rows={3} />,
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement)
    await expect(within(canvasElement).getAllByRole('listitem')).toHaveLength(3)
    await expect(root).not.toHaveAttribute('data-has-overflow-y')
    await expect(scrollbarsOf(root)).toHaveLength(0)
  },
}

export const OutOfTabOrderWithoutOverflow: Story = {
  render: () => <ComposedScrollArea {...scrollAreaControlArgs} rows={3} />,
  play: async ({ canvasElement }) => {
    const viewport = viewportOf(canvasElement)
    await expect(viewport).toHaveAttribute('tabindex', '-1')
    await userEvent.tab()
    await expect(viewport).not.toHaveFocus()
  },
}

export const FocusableWhenScrollable: Story = {
  render: () => <ComposedScrollArea {...scrollAreaControlArgs} />,
  play: async ({ canvasElement }) => {
    const viewport = viewportOf(canvasElement)
    await waitForOverflow(rootOf(canvasElement))
    await expect(viewport).toHaveAttribute('tabindex', '0')
    await userEvent.tab()
    await expect(viewport).toHaveFocus()
    await expect(viewport.matches(':focus-visible')).toBe(true)
    await waitFor(() =>
      expect(getComputedStyle(viewport).boxShadow).not.toBe('none'),
    )
  },
}

export const ScrollbarShowsOnHover: Story = {
  render: () => <ComposedScrollArea {...scrollAreaControlArgs} />,
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement)
    await waitForOverflow(root)
    const scrollbar = verticalScrollbarOf(root)
    await expect(getComputedStyle(scrollbar).opacity).toBe('0')
    await userEvent.hover(viewportOf(canvasElement))
    await expect(scrollbar).toHaveAttribute('data-hovering')
    await waitFor(() => expect(getComputedStyle(scrollbar).opacity).toBe('1'))
    await userEvent.unhover(viewportOf(canvasElement))
    await waitFor(() => expect(scrollbar).not.toHaveAttribute('data-hovering'))
  },
}

export const ScrollbarShowsWhileScrolling: Story = {
  render: () => <ComposedScrollArea {...scrollAreaControlArgs} />,
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement)
    await waitForOverflow(root)
    const scrollbar = verticalScrollbarOf(root)
    const viewport = viewportOf(canvasElement)
    viewport.dispatchEvent(
      new WheelEvent('wheel', { bubbles: true, deltaY: 200 }),
    )
    viewport.scrollTo({ top: 200 })
    await waitFor(() => expect(scrollbar).toHaveAttribute('data-scrolling'))
    await expect(root).toHaveAttribute('data-scrolling')
    await waitFor(() => expect(getComputedStyle(scrollbar).opacity).toBe('1'))
    await waitFor(
      () => expect(scrollbar).not.toHaveAttribute('data-scrolling'),
      { timeout: 2000 },
    )
  },
}

export const OverflowEdgesFollowScroll: Story = {
  render: () => <ComposedScrollArea {...scrollAreaControlArgs} />,
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement)
    const viewport = viewportOf(canvasElement)
    await waitFor(() => expect(root).toHaveAttribute('data-overflow-y-end'))
    await expect(root).not.toHaveAttribute('data-overflow-y-start')
    await expect(
      viewport.style.getPropertyValue('--scroll-area-overflow-y-start'),
    ).toBe('0px')
    viewport.scrollTo({ top: viewport.scrollHeight })
    await waitFor(() => expect(root).toHaveAttribute('data-overflow-y-start'))
    await expect(root).not.toHaveAttribute('data-overflow-y-end')
    await expect(
      viewport.style.getPropertyValue('--scroll-area-overflow-y-end'),
    ).toBe('0px')
  },
}

export const ScrollFadeFollowsEdges: Story = {
  render: () => <ComposedScrollArea {...scrollAreaControlArgs} scrollFade />,
  play: async ({ canvasElement }) => {
    const viewport = viewportOf(canvasElement)
    await waitFor(() =>
      expect(fadeOf(viewport)).toEqual({
        bottom: 'calc(100% - 24px)',
        top: '100%',
      }),
    )
    viewport.scrollTo({ top: viewport.scrollHeight })
    await waitFor(() =>
      expect(fadeOf(viewport)).toEqual({
        bottom: '100%',
        top: 'calc(100% - 24px)',
      }),
    )
  },
}

export const GutterWhileOverflowing: Story = {
  render: () => (
    <ComposedScrollArea {...scrollAreaControlArgs} scrollbarGutter />
  ),
  play: async ({ canvasElement }) => {
    const viewport = viewportOf(canvasElement)
    await waitForOverflow(rootOf(canvasElement))
    await expect(getComputedStyle(viewport).paddingInlineEnd).toBe('10px')
    await expect(getComputedStyle(viewport).paddingBottom).toBe('0px')
  },
}

export const ClampsContentWidth: Story = {
  render: () => <ComposedScrollArea {...scrollAreaControlArgs} />,
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement)
    const viewport = viewportOf(canvasElement)
    await waitForOverflow(root)
    const content = viewport.querySelector(
      '[data-slot="scroll-area-content"]',
    ) as HTMLElement
    await expect(content.getBoundingClientRect().width).toBe(
      viewport.clientWidth,
    )
    const name = within(canvasElement).getByText(longFileName)
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth)
    await expect(root).not.toHaveAttribute('data-has-overflow-x')
  },
}

export const UnclampedContentGrows: Story = {
  render: () => (
    <ComposedScrollArea
      {...scrollAreaControlArgs}
      clampContentMinWidth={false}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement)
    const viewport = viewportOf(canvasElement)
    await waitFor(() => expect(root).toHaveAttribute('data-has-overflow-x'))
    const content = viewport.querySelector(
      '[data-slot="scroll-area-content"]',
    ) as HTMLElement
    await expect(content.getBoundingClientRect().width).toBeGreaterThan(
      viewport.clientWidth,
    )
  },
}

export const FillStretchesContent: Story = {
  render: () => <FillScrollArea />,
  play: async ({ canvasElement }) => {
    const viewport = viewportOf(canvasElement)
    const content = viewport.querySelector(
      '[data-slot="scroll-area-content"]',
    ) as HTMLElement
    await expect(content.getBoundingClientRect().height).toBe(
      viewport.clientHeight,
    )
    const footer = within(canvasElement).getByText('3 files')
    await expect(footer.getBoundingClientRect().bottom).toBeCloseTo(
      viewport.getBoundingClientRect().bottom - 4,
      0,
    )
  },
}

export const OverscrollContain: Story = {
  render: () => <NestedScrollArea />,
  play: async ({ canvasElement }) => {
    const outer = viewportOf(canvasElement)
    const list = within(canvasElement).getByRole('list', { name: 'Files' })
    const inner = list.closest(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement
    await waitFor(() =>
      expect(inner.parentElement).toHaveAttribute('data-has-overflow-y'),
    )
    await expect(getComputedStyle(inner).overscrollBehaviorY).toBe('contain')
    await expect(getComputedStyle(outer).overscrollBehaviorY).toBe('auto')
  },
}
