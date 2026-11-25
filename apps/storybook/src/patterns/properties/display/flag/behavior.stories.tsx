import { CircleIcon, RobotIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlagProperty } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { isIcon } from '../../../../test-utils/is-icon'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../../test-utils/property-surface'
import { FlagCanvas } from './flag-canvas.tsx'
import { flagControlArgs } from './flag-controls.ts'
import { ComposedFlag } from './flag-layouts.tsx'

const meta = {
  args: {
    active: true,
    activeIcon: RobotIcon,
    inactiveIcon: CircleIcon,
    label: 'Atrasada',
  },
  component: FlagProperty,
  decorators: [FlagCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Flag/Behavior',
} satisfies Meta<typeof FlagProperty>

export default meta

type Story = StoryObj<typeof meta>

const iconIn = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="property-icon"]')

export const ActiveShowsLabelAndIcon: Story = {
  args: { ariaLabel: 'Prazo' },
  play: async ({ canvasElement }) => {
    const flag = within(canvasElement).getByRole('img', {
      name: 'Prazo: Atrasada',
    })

    await expect(flag.textContent).toBe('Atrasada')
    await expect(isIcon(iconIn(canvasElement), RobotIcon)).toBe(true)
  },
}

export const HidesInactiveByDefault: Story = {
  args: { active: false, inactiveLabel: 'No prazo' },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="property-surface"]'),
    ).toBeNull()
    await expect(within(canvasElement).queryByText('No prazo')).toBeNull()
  },
}

export const ShowsInactiveWhenRequested: Story = {
  args: { active: false, inactiveLabel: 'No prazo', showInactive: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('No prazo')).toBeVisible()
    await expect(canvas.queryByText('Atrasada')).toBeNull()
    await expect(isIcon(iconIn(canvasElement), CircleIcon)).toBe(true)
  },
}

export const InactiveFallsBackToLabel: Story = {
  args: { active: false, showInactive: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Atrasada')).toBeVisible()
  },
}

const surfaceColorWithPrimary = (canvasElement: HTMLElement) => {
  canvasElement.style.setProperty('--primary', 'rgb(255, 0, 0)')

  const { color } = getComputedStyle(
    canvasElement.querySelector('[data-slot="property-surface"]') as Element,
  )

  canvasElement.style.removeProperty('--primary')

  return color
}

export const ActiveBadgeUsesPrimary: Story = {
  play: async ({ canvasElement }) => {
    await expect(surfaceColorWithPrimary(canvasElement)).toBe('rgb(255, 0, 0)')
  },
}

export const ActivePlainUsesPrimary: Story = {
  args: { variant: 'plain' },
  play: async ({ canvasElement }) => {
    await expect(surfaceColorWithPrimary(canvasElement)).toBe('rgb(255, 0, 0)')
  },
}

export const BadgeFillsTheSurface: Story = {
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
  },
}

export const PlainHasNoFill: Story = {
  args: { variant: 'plain' },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="property-surface"]'),
    ).toHaveAttribute('data-variant', 'plain')
    await esperarSuperficiePlana(canvasElement)
  },
}

export const InactiveKeepsTheActiveSurface: Story = {
  render: () => <ComposedFlag {...flagControlArgs} active={false} />,
  play: async ({ canvasElement }) => {
    const flag = within(canvasElement).getByRole('img', {
      name: 'Modo de execução: Manual',
    })

    await expect(flag).not.toHaveAttribute('data-empty')
    await expect(flag).toHaveAttribute('data-variant', 'badge')
    await esperarSuperficieDeBadge(canvasElement)
    await expect(surfaceColorWithPrimary(canvasElement)).toBe('rgb(255, 0, 0)')
  },
}

export const NoIconWithoutIcons: Story = {
  render: () => <ComposedFlag {...flagControlArgs} icon={false} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Modo de execução: Automático',
      }),
    ).toBeVisible()
    await expect(iconIn(canvasElement)).toBeNull()
  },
}
