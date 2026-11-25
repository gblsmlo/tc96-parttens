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
import { referenceControlArgs } from './reference-controls.ts'
import { ComposedReference } from './reference-layouts.tsx'

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

const iconNamed = (canvasElement: HTMLElement, name: string) =>
  iconOf(
    within(canvasElement).getByRole('img', { name: new RegExp(`^${name}:`) }),
  )

export const AccountKindShowsTheBuildingsIcon: Story = {
  render: () => (
    <ComposedReference
      {...referenceControlArgs}
      ariaLabel="Conta"
      kind="account"
      label="Acme"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(isIcon(iconNamed(canvasElement, 'Conta'), BuildingsIcon)).toBe(
      true,
    )
  },
}

export const ProductKindShowsThePackageIcon: Story = {
  render: () => (
    <ComposedReference
      {...referenceControlArgs}
      ariaLabel="Produto"
      kind="product"
      label="Pro"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(isIcon(iconNamed(canvasElement, 'Produto'), PackageIcon)).toBe(
      true,
    )
  },
}

export const RecordKindIsTheDefaultCubeIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <ComposedReference
        {...referenceControlArgs}
        ariaLabel="Registro"
        kind="record"
        label="Lead"
      />
      <ReferenceProperty ariaLabel="Padrão" label="Ticket" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(isIcon(iconNamed(canvasElement, 'Registro'), CubeIcon)).toBe(
      true,
    )
    await expect(isIcon(iconNamed(canvasElement, 'Padrão'), CubeIcon)).toBe(
      true,
    )
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
