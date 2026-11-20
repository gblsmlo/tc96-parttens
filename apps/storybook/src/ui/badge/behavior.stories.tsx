import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@tc96/ui/badge'
import { CheckIcon } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { badgeSizeNames, badgeVariantNames } from './badge-api.ts'

interface BehaviorArgs {
  onClick: () => void
}

const meta = {
  args: { onClick: fn() },
  argTypes: { onClick: { control: false } },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Badge/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {badgeVariantNames.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const badges = canvasElement.querySelectorAll('[data-slot="badge"]')
    await expect(badges).toHaveLength(badgeVariantNames.length)
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      {badgeSizeNames.map((size) => (
        <Badge key={size} size={size}>
          {size}
        </Badge>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heightOf = (name: string) =>
      canvas.getByText(name).getBoundingClientRect().height
    await expect(heightOf('default')).toBe(20)
    await expect(heightOf('large')).toBe(24)
  },
}

export const WithIcon: Story = {
  render: () => (
    <Badge variant="outline">
      <CheckIcon aria-hidden="true" />
      Verified
    </Badge>
  ),
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByText('Verified')
    const icon = badge.querySelector('svg')
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon?.getBoundingClientRect().right).toBeLessThanOrEqual(
      badge.getBoundingClientRect().right,
    )
  },
}

export const Count: Story = {
  render: () => (
    <Badge aria-label="7 unread messages" className="rounded-full">
      7
    </Badge>
  ),
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByText('7')
    const { height, width } = badge.getBoundingClientRect()
    await expect(width).toBeCloseTo(height, 0)
  },
}

export const AsLink: Story = {
  render: () => (
    <Badge
      render={(props) => <a {...props} href="#pricing" />}
      variant="secondary"
    >
      New
    </Badge>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'New' })
    await expect(link).toHaveAttribute('data-slot', 'badge')
    await expect(getComputedStyle(link).cursor).toBe('pointer')
    await userEvent.tab()
    await expect(link).toHaveFocus()
    await expect(getComputedStyle(link).boxShadow).not.toBe('none')
  },
}

export const AsButton: Story = {
  render: ({ onClick }) => (
    <Badge
      render={<button onClick={onClick} type="button" />}
      variant="outline"
    >
      Filter: Open
    </Badge>
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Filter: Open',
    })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}
