import { DiamondIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  IconFrame,
  iconFrameShapes,
  iconFrameSizes,
  iconFrameVariantNames,
} from '@tc96/ui/icon-frame'
import { expect, within } from 'storybook/test'
import { iconFrameControlArgs } from './icon-frame-controls.ts'
import { ComposedIconFrame } from './icon-frame-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/IconFrame/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const framesIn = (canvasElement: HTMLElement, testId: string) =>
  [
    ...within(canvasElement)
      .getByTestId(testId)
      .querySelectorAll('[data-slot="icon-frame"]'),
  ] as HTMLElement[]

const frameIn = (canvasElement: HTMLElement) => {
  const frame = canvasElement.querySelector('[data-slot="icon-frame"]')
  if (!(frame instanceof HTMLElement))
    throw new Error('The icon frame did not render.')
  return frame
}

const frameSizes = {
  default: [36, 18],
  lg: [44, 20],
  sm: [32, 16],
  xl: [56, 24],
  xs: [24, 16],
} as const

export const DecorativeMarkup: Story = {
  render: () => <ComposedIconFrame {...iconFrameControlArgs} />,
  play: async ({ canvasElement }) => {
    const frame = frameIn(canvasElement)
    await expect(frame.tagName).toBe('SPAN')
    await expect(frame).toHaveAttribute('aria-hidden', 'true')
    await expect(frame).toHaveAttribute('data-size', 'default')
    await expect(frame).toHaveAttribute('data-shape', 'circle')
    await expect(frame).toHaveAttribute('data-variant', 'color')
  },
}

export const EverySize: Story = {
  render: () => (
    <div className="flex items-end gap-4" data-testid="sizes">
      {iconFrameSizes.map((size) => (
        <IconFrame key={size} size={size}>
          <DiamondIcon aria-hidden="true" />
        </IconFrame>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const frames = framesIn(canvasElement, 'sizes')
    await expect(frames).toHaveLength(iconFrameSizes.length)
    for (const [index, size] of iconFrameSizes.entries()) {
      const frame = frames[index]
      const [box, icon] = frameSizes[size]
      await expect(frame).toHaveAttribute('data-size', size)
      await expect(frame?.getBoundingClientRect().width).toBe(box)
      await expect(frame?.getBoundingClientRect().height).toBe(box)
      await expect(
        frame?.querySelector('svg')?.getBoundingClientRect().width,
      ).toBe(icon)
    }
  },
}

export const EveryShape: Story = {
  render: () => (
    <div className="flex items-center gap-4" data-testid="shapes">
      {iconFrameShapes.map((shape) => (
        <IconFrame key={shape} shape={shape}>
          <DiamondIcon aria-hidden="true" />
        </IconFrame>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const frames = framesIn(canvasElement, 'shapes')
    await expect(frames[0]).toHaveAttribute('data-shape', 'circle')
    await expect(frames[0]).toHaveClass('rounded-full')
    await expect(frames[1]).toHaveAttribute('data-shape', 'rounded')
    await expect(frames[1]).toHaveClass('rounded-lg')
  },
}

export const EveryVariant: Story = {
  render: () => (
    <div className="flex items-center gap-4" data-testid="variants">
      {iconFrameVariantNames.map((variant) => (
        <IconFrame key={variant} variant={variant}>
          <DiamondIcon aria-hidden="true" />
        </IconFrame>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const frames = framesIn(canvasElement, 'variants')
    await expect(frames[0]).toHaveAttribute('data-variant', 'color')
    await expect(frames[1]).toHaveAttribute('data-variant', 'plain')
  },
}

export const ColorTintsBackground: Story = {
  render: () => <ComposedIconFrame {...iconFrameControlArgs} color="#627eea" />,
  play: async ({ canvasElement }) => {
    const frame = frameIn(canvasElement)
    await expect(frame).toHaveStyle({ color: '#627eea' })
    await expect(getComputedStyle(frame).backgroundColor).not.toBe(
      'rgba(0, 0, 0, 0)',
    )
  },
}

export const PlainKeepsBackgroundTransparent: Story = {
  render: () => (
    <ComposedIconFrame
      {...iconFrameControlArgs}
      color="#627eea"
      variant="plain"
    />
  ),
  play: async ({ canvasElement }) => {
    const frame = frameIn(canvasElement)
    await expect(frame).toHaveAttribute('data-variant', 'plain')
    await expect(frame).toHaveStyle({ color: '#627eea' })
    await expect(getComputedStyle(frame).backgroundColor).toBe(
      'rgba(0, 0, 0, 0)',
    )
  },
}

export const ThemeColorsWithoutColor: Story = {
  render: () => <ComposedIconFrame {...iconFrameControlArgs} color="" />,
  play: async ({ canvasElement }) => {
    const frame = frameIn(canvasElement)
    await expect(frame).toHaveClass('bg-muted', 'text-foreground')
    await expect(frame.style.backgroundColor).toBe('')
    await expect(frame.style.color).toBe('')
  },
}

export const RenderReplacesElement: Story = {
  render: () => (
    <div data-testid="frames">
      <IconFrame render={<div />} variant="plain" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [frame] = framesIn(canvasElement, 'frames')
    await expect(frame?.tagName).toBe('DIV')
    await expect(frame).toHaveAttribute('aria-hidden', 'true')
    await expect(frame).toHaveAttribute('data-variant', 'plain')
  },
}

export const IconSizeClassWins: Story = {
  render: () => (
    <ComposedIconFrame {...iconFrameControlArgs} size="xs">
      <DiamondIcon aria-hidden="true" className="size-5" />
    </ComposedIconFrame>
  ),
  play: async ({ canvasElement }) => {
    const icon = frameIn(canvasElement).querySelector('svg')
    await expect(icon?.getBoundingClientRect().width).toBe(20)
  },
}

export const ClassNameWins: Story = {
  render: () => (
    <IconFrame className="rounded-sm" shape="circle">
      <DiamondIcon aria-hidden="true" />
    </IconFrame>
  ),
  play: async ({ canvasElement }) => {
    const frame = frameIn(canvasElement)
    await expect(frame).toHaveClass('rounded-sm')
    await expect(frame).not.toHaveClass('rounded-full')
  },
}
