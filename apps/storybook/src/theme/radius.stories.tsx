import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { resolvedStyle, Shape, ShapeGrid } from './theme-shapes.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Theme/Radius',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const scale = [
  { className: 'rounded-sm', token: 'radius-sm' },
  { className: 'rounded-md', token: 'radius-md' },
  { className: 'rounded-lg', token: 'radius-lg' },
  { className: 'rounded-xl', token: 'radius-xl' },
  { className: 'rounded-2xl', token: 'radius-2xl' },
  { className: 'rounded-3xl', token: 'radius-3xl' },
] as const

export const Scale: Story = {
  render: () => (
    <ShapeGrid>
      {scale.map(({ className, token }) => (
        <Shape
          className={`border bg-card text-card-foreground ${className}`}
          key={token}
          label={className}
          token={token}
        />
      ))}
    </ShapeGrid>
  ),
  play: async ({ canvasElement }) => {
    const shapes = [
      ...canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="theme-shape"]',
      ),
    ]
    await expect(shapes).toHaveLength(scale.length)
    const base = resolvedStyle(
      canvasElement,
      'border-top-left-radius',
      'var(--radius)',
    )
    const large = shapes.find((shape) => shape.dataset.token === 'radius-lg')
    if (!large) throw new Error('Missing radius-lg')
    await expect(getComputedStyle(large).borderTopLeftRadius).toBe(base)
  },
}
