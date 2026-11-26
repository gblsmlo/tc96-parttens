import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader, CardTitle } from '@tc96/ui/card'
import type { CSSProperties } from 'react'
import { expect, within } from 'storybook/test'
import { resolvedStyle, Shape, ShapeGrid } from './theme-shapes.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Theme/Shadows',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const surfaces = [
  {
    className:
      'rounded-xl border bg-card text-card-foreground shadow-(shadow:--card-shadow)',
    label: 'Card',
    token: 'card-shadow',
  },
  {
    className:
      'rounded-lg border bg-popover text-popover-foreground shadow-(shadow:--popover-shadow)',
    label: 'Popover',
    token: 'popover-shadow',
  },
  {
    className:
      'rounded-lg border border-input bg-background text-foreground shadow-(shadow:--input-shadow)',
    label: 'Input',
    token: 'input-shadow',
  },
  {
    className:
      'rounded-lg border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-(shadow:--sidebar-shadow)',
    label: 'Sidebar',
    token: 'sidebar-shadow',
  },
  {
    className:
      'rounded-lg border bg-popover text-popover-foreground shadow-(shadow:--chart-shadow)',
    label: 'Chart',
    token: 'chart-shadow',
  },
] as const

const surfaceStory = (index: number): Story => ({
  render: () => {
    const surface = surfaces[index]
    if (!surface) throw new Error('Missing surface')
    return (
      <div className="p-16">
        <Shape {...surface} className={`w-72 ${surface.className}`} />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const [shape] = shapesOf(canvasElement)
    if (!shape) throw new Error('Missing shape')
    await expect(getComputedStyle(shape.shape).boxShadow).toContain(
      resolvedStyle(
        shape.shape.parentElement as Element,
        'box-shadow',
        `var(--${shape.token})`,
      ),
    )
  },
})

export const CardSurface = surfaceStory(0)
export const PopoverSurface = surfaceStory(1)
export const InputSurface = surfaceStory(2)
export const SidebarSurface = surfaceStory(3)
export const ChartSurface = surfaceStory(4)

const shapesOf = (canvasElement: HTMLElement) =>
  [
    ...canvasElement.querySelectorAll<HTMLElement>('[data-slot="theme-shape"]'),
  ].map((shape) => ({ shape, token: shape.dataset.token ?? '' }))

export const Surfaces: Story = {
  render: () => (
    <ShapeGrid>
      {surfaces.map((surface) => (
        <Shape key={surface.token} {...surface} />
      ))}
    </ShapeGrid>
  ),
  play: async ({ canvasElement }) => {
    const shapes = shapesOf(canvasElement)
    await expect(shapes).toHaveLength(surfaces.length)
    for (const { shape, token } of shapes) {
      const expected = resolvedStyle(
        shape.parentElement as Element,
        'box-shadow',
        `var(--${token})`,
      )
      await expect(expected).not.toBe('none')
      await expect(getComputedStyle(shape).boxShadow).toContain(expected)
    }
  },
}

const customShadow = '0 8px 24px -4px oklch(0 0 0 / 12%)'

export const CustomCardShadow: Story = {
  render: () => (
    <ShapeGrid>
      <Shape {...surfaces[0]} label="Twincan" />
      <div style={{ '--card-shadow': customShadow } as CSSProperties}>
        <Shape {...surfaces[0]} label="Custom" />
      </div>
    </ShapeGrid>
  ),
  play: async ({ canvasElement }) => {
    const [twincan, custom] = shapesOf(canvasElement)
    if (!twincan || !custom) throw new Error('Missing shapes')
    const customShadowValue = resolvedStyle(
      custom.shape.parentElement as Element,
      'box-shadow',
      customShadow,
    )
    await expect(getComputedStyle(custom.shape).boxShadow).toContain(
      customShadowValue,
    )
    await expect(getComputedStyle(twincan.shape).boxShadow).not.toContain(
      customShadowValue,
    )
  },
}

export const ComponentOverride: Story = {
  render: () => (
    <ShapeGrid>
      <Card>
        <CardHeader>
          <CardTitle>Themed</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Flat</CardTitle>
        </CardHeader>
      </Card>
    </ShapeGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const themed = canvas.getByText('Themed').closest('[data-slot="card"]')
    const flat = canvas.getByText('Flat').closest('[data-slot="card"]')
    if (!themed || !flat) throw new Error('Missing cards')
    await expect(getComputedStyle(themed).boxShadow).toContain(
      resolvedStyle(themed, 'box-shadow', 'var(--card-shadow)'),
    )
    await expect(flat.className).not.toContain('--card-shadow')
    await expect(getComputedStyle(flat).boxShadow).not.toContain(
      resolvedStyle(themed, 'box-shadow', 'var(--card-shadow)'),
    )
  },
}
