import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from '@tc96/ui/skeleton'
import { expect } from 'storybook/test'
import { skeletonControlArgs } from './skeleton-controls.ts'
import { ComposedSkeleton, ProfileRowSkeleton } from './skeleton-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Skeleton/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const skeletonsIn = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>('[data-slot="skeleton"]'),
  )

const skeletonIn = (canvasElement: HTMLElement) => {
  const [skeleton] = skeletonsIn(canvasElement)
  if (!skeleton) throw new Error('The skeleton did not render.')
  return skeleton
}

const resolvedColor = (
  host: HTMLElement,
  property: 'backgroundColor' | 'color',
  value: string,
) => {
  const probe = document.createElement('span')
  probe.style[property] = value
  host.append(probe)
  const color = getComputedStyle(probe)[property]
  probe.remove()
  return color
}

const corners = (element: HTMLElement) => {
  const style = getComputedStyle(element)
  return {
    bottomLeft: style.borderBottomLeftRadius,
    bottomRight: style.borderBottomRightRadius,
    topLeft: style.borderTopLeftRadius,
    topRight: style.borderTopRightRadius,
  }
}

export const NothingToAnnounce: Story = {
  render: () => <ComposedSkeleton {...skeletonControlArgs} />,
  play: async ({ canvasElement }) => {
    const skeleton = skeletonIn(canvasElement)
    await expect(skeleton.tagName).toBe('DIV')
    await expect(skeleton).not.toHaveAttribute('role')
    await expect(skeleton).not.toHaveAttribute('aria-label')
    await expect(skeleton.childNodes).toHaveLength(0)
  },
}

export const NoHeightOfItsOwn: Story = {
  render: () => (
    <div className="w-60">
      <Skeleton />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(skeletonIn(canvasElement).getBoundingClientRect().height).toBe(
      0,
    )
  },
}

export const DefaultCorner: Story = {
  render: () => <ComposedSkeleton {...skeletonControlArgs} />,
  play: async ({ canvasElement }) => {
    await expect(corners(skeletonIn(canvasElement))).toEqual({
      bottomLeft: '6px',
      bottomRight: '6px',
      topLeft: '6px',
      topRight: '6px',
    })
  },
}

export const ClassNameReplacesCorners: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ComposedSkeleton shape="circle" />
      <Skeleton className="h-10 w-24 rounded-t-lg" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [circle, topRounded] = skeletonsIn(canvasElement)
    if (!(circle && topRounded))
      throw new Error('The skeletons did not render.')
    for (const radius of Object.values(corners(circle)))
      await expect(Number.parseFloat(radius)).toBeGreaterThanOrEqual(20)
    await expect(corners(topRounded)).toEqual({
      bottomLeft: '6px',
      bottomRight: '6px',
      topLeft: '10px',
      topRight: '10px',
    })
  },
}

export const MutedFill: Story = {
  render: () => <ComposedSkeleton {...skeletonControlArgs} />,
  play: async ({ canvasElement }) => {
    await expect(
      getComputedStyle(skeletonIn(canvasElement)).backgroundColor,
    ).toBe(
      resolvedColor(canvasElement, 'backgroundColor', 'var(--color-muted)'),
    )
  },
}

export const HighlightSweeps: Story = {
  render: () => <ComposedSkeleton {...skeletonControlArgs} />,
  play: async ({ canvasElement }) => {
    const style = getComputedStyle(skeletonIn(canvasElement))
    await expect(style.backgroundImage).toContain('linear-gradient(120deg')
    await expect(style.animationName).toBe('skeleton')
    await expect(style.animationDuration).toBe('2s')
    await expect(style.animationIterationCount).toBe('infinite')
    await expect(style.animationTimingFunction).toBe('linear')
  },
}

export const BandFixedToViewport: Story = {
  render: () => <ProfileRowSkeleton />,
  play: async ({ canvasElement }) => {
    const skeletons = skeletonsIn(canvasElement)
    await expect(skeletons.length).toBeGreaterThan(1)
    for (const skeleton of skeletons)
      await expect(getComputedStyle(skeleton).backgroundAttachment).toBe(
        'fixed',
      )
  },
}

export const HighlightFollowsTheme: Story = {
  render: () => <ComposedSkeleton {...skeletonControlArgs} />,
  play: async ({ canvasElement }) => {
    const skeleton = skeletonIn(canvasElement)
    const dark = document.documentElement.classList.contains('dark')
    const highlight = resolvedColor(
      skeleton,
      'color',
      'var(--skeleton-highlight)',
    )
    const white = (alpha: string) =>
      resolvedColor(
        canvasElement,
        'color',
        `color-mix(in oklab, #fff ${alpha}, transparent)`,
      )
    await expect(white('4%')).not.toBe(white('64%'))
    await expect(highlight).toBe(dark ? white('4%') : white('64%'))
  },
}
