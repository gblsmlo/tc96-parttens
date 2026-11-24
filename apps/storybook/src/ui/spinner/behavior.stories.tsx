import { CheckIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Spinner } from '@tc96/ui/spinner'
import { expect, within } from 'storybook/test'
import { spinnerControlArgs } from './spinner-controls.ts'
import { ComposedSpinner } from './spinner-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Spinner/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const getSvg = (canvasElement: HTMLElement) => {
  const svg = canvasElement.querySelector('svg')
  if (!(svg instanceof SVGSVGElement))
    throw new Error('The spinner did not render.')
  return svg
}

export const AnnouncedAsStatus: Story = {
  render: () => <Spinner />,
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status', {
      name: 'Loading',
    })
    await expect(status).toBe(getSvg(canvasElement))
  },
}

export const NamedByLabel: Story = {
  render: () => <Spinner aria-label="Loading invoices" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status', { name: 'Loading invoices' })).toBe(
      getSvg(canvasElement),
    )
    await expect(
      canvas.queryByRole('status', { name: 'Loading' }),
    ).not.toBeInTheDocument()
  },
}

export const Spins: Story = {
  render: () => <ComposedSpinner {...spinnerControlArgs} />,
  play: async ({ canvasElement }) => {
    const style = getComputedStyle(getSvg(canvasElement))
    await expect(style.animationName).toBe('spin')
    await expect(style.animationDuration).toBe('1s')
    await expect(style.animationTimingFunction).toBe('linear')
    await expect(style.animationIterationCount).toBe('infinite')
  },
}

export const DefaultSize: Story = {
  render: () => <ComposedSpinner {...spinnerControlArgs} />,
  play: async ({ canvasElement }) => {
    const { height, width } = getSvg(canvasElement).getBoundingClientRect()
    await expect(width).toBe(24)
    await expect(height).toBe(24)
  },
}

export const SizeClassMergesWithSpin: Story = {
  render: () => <ComposedSpinner {...spinnerControlArgs} size="size-5" />,
  play: async ({ canvasElement }) => {
    const svg = getSvg(canvasElement)
    await expect(svg).toHaveClass('animate-spin', 'size-5')
    const { height, width } = svg.getBoundingClientRect()
    await expect(width).toBe(20)
    await expect(height).toBe(20)
  },
}

export const SizedByParent: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  render: () => (
    <div className="flex gap-2">
      <Button loading type="button">
        Save changes
      </Button>
      <Button type="button" variant="outline">
        <CheckIcon aria-hidden="true" />
        Saved
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(window.innerWidth).toBeLessThan(640)
    const spinner = within(
      canvas.getByRole('button', { name: /^Save changes/ }),
    ).getByRole('status', { name: 'Loading' })
    const icon = canvas
      .getByRole('button', { name: 'Saved' })
      .querySelector('svg')
    const spinnerBox = spinner.getBoundingClientRect()
    const iconBox = icon?.getBoundingClientRect()
    await expect(spinnerBox.width).toBe(18)
    await expect(spinnerBox.width).toBe(iconBox?.width)
    await expect(spinnerBox.height).toBe(iconBox?.height)
  },
}

export const FollowsTextColor: Story = {
  render: () => (
    <p className="text-destructive-foreground">
      <Spinner />
    </p>
  ),
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('p')
    if (!(text instanceof HTMLElement))
      throw new Error('The wrapper did not render.')
    const textColor = getComputedStyle(text).color
    await expect(textColor).not.toBe(getComputedStyle(canvasElement).color)
    await expect(getComputedStyle(getSvg(canvasElement)).fill).toBe(textColor)
  },
}
