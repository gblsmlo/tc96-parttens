import { BuildingsIcon, CubeIcon, PackageIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReferenceProperty } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { isIcon } from '../../../../test-utils/is-icon'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../../test-utils/property-surface'
import { ReferenceCanvas } from './reference-canvas.tsx'

const meta = {
  args: { label: 'Acme Corp' },
  component: ReferenceProperty,
  decorators: [ReferenceCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Reference/Behavior',
} satisfies Meta<typeof ReferenceProperty>

export default meta

type Story = StoryObj<typeof meta>

const iconOf = (chip: HTMLElement) =>
  chip.querySelector('[data-slot="property-icon"]')

export const KindPicksIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <ReferenceProperty ariaLabel="Account" kind="account" label="Acme" />
      <ReferenceProperty ariaLabel="Product" kind="product" label="Pro" />
      <ReferenceProperty ariaLabel="Record" kind="record" label="Lead" />
      <ReferenceProperty ariaLabel="Default" label="Ticket" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const icon = (name: string) =>
      iconOf(canvas.getByRole('img', { name: new RegExp(`^${name}:`) }))

    await expect(isIcon(icon('Account'), BuildingsIcon)).toBe(true)
    await expect(isIcon(icon('Product'), PackageIcon)).toBe(true)
    await expect(isIcon(icon('Record'), CubeIcon)).toBe(true)
    await expect(isIcon(icon('Default'), CubeIcon)).toBe(true)
  },
}

export const AriaLabelNamesOneImage: Story = {
  args: { ariaLabel: 'Conta', kind: 'account' },
  play: async ({ canvasElement }) => {
    const chip = within(canvasElement).getByRole('img', {
      name: 'Conta: Acme Corp',
    })

    await expect(chip).toHaveAttribute('data-slot', 'property-surface')
    await expect(iconOf(chip)).toHaveAttribute('aria-hidden', 'true')
  },
}

export const WithoutAriaLabelIsText: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('img')).toBeNull()
    await expect(canvas.getByText('Acme Corp')).toBeVisible()
  },
}

export const HasNoControl: Story = {
  args: { ariaLabel: 'Conta' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="property-surface"]'),
    ).not.toHaveAttribute('tabindex')
  },
}

export const BadgeIsFilled: Story = {
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
    await expect(
      canvasElement.querySelector('[data-slot="property-surface"]'),
    ).toHaveAttribute('data-variant', 'badge')
  },
}

export const PlainHasNoFill: Story = {
  args: { variant: 'plain' },
  play: async ({ canvasElement }) => {
    await esperarSuperficiePlana(canvasElement)
    await expect(
      canvasElement.querySelector('[data-slot="property-surface"]'),
    ).toHaveAttribute('data-variant', 'plain')
  },
}
