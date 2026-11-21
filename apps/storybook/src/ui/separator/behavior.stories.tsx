import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from '@tc96/ui/separator'
import { expect, within } from 'storybook/test'
import { separatorControlArgs } from './separator-controls.ts'
import { SeparatorCanvas } from './separator-frame.tsx'
import { ComposedSeparator } from './separator-layouts.tsx'

const rowOf = (separator: HTMLElement) => {
  const row = separator.parentElement
  if (!row) throw new Error('The separator has no parent row.')
  return row
}

const tokenColor = (container: HTMLElement, token: string) => {
  const probe = document.createElement('div')
  probe.style.backgroundColor = `var(${token})`
  container.append(probe)
  const color = getComputedStyle(probe).backgroundColor
  probe.remove()
  return color
}

const meta = {
  decorators: [SeparatorCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Separator/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SeparatorRole: Story = {
  render: () => <ComposedSeparator {...separatorControlArgs} />,
  play: async ({ canvasElement }) => {
    const separator = within(canvasElement).getByRole('separator')
    await expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
  },
}

export const VerticalOrientation: Story = {
  render: () => (
    <ComposedSeparator {...separatorControlArgs} orientation="vertical" />
  ),
  play: async ({ canvasElement }) => {
    const separator = within(canvasElement).getByRole('separator')
    await expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    await expect(separator).toHaveAttribute('data-orientation', 'vertical')
  },
}

export const HorizontalFillsWidth: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4 text-sm">
      <span>First group</span>
      <Separator />
      <span>Second group</span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const separator = within(canvasElement).getByRole('separator')
    const line = separator.getBoundingClientRect()
    const row = rowOf(separator).getBoundingClientRect()
    await expect(line.height).toBe(1)
    await expect(row.width).toBeGreaterThan(0)
    await expect(line.width).toBe(row.width)
  },
}

export const VerticalStretchesToRow: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-4 text-sm">
      <span>First group</span>
      <Separator orientation="vertical" />
      <span>Second group</span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const separator = within(canvasElement).getByRole('separator')
    const line = separator.getBoundingClientRect()
    await expect(line.width).toBe(1)
    await expect(line.height).toBe(48)
  },
}

export const HeightClassStopsStretch: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-4 text-sm">
      <span>First group</span>
      <Separator className="h-4" orientation="vertical" />
      <span>Second group</span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const separator = within(canvasElement).getByRole('separator')
    const line = separator.getBoundingClientRect()
    const row = rowOf(separator).getBoundingClientRect()
    await expect(line.height).toBe(16)
    await expect(line.top - row.top).toBe(16)
  },
}

export const ColorClassWins: Story = {
  render: () => <Separator className="bg-input" />,
  play: async ({ canvasElement }) => {
    const separator = within(canvasElement).getByRole('separator')
    const input = tokenColor(canvasElement, '--input')
    const border = tokenColor(canvasElement, '--border')
    await expect(input).not.toBe(border)
    await expect(getComputedStyle(separator).backgroundColor).toBe(input)
  },
}
