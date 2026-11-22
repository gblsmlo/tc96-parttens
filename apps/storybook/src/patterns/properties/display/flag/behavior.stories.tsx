import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlagProperty } from '@tc96/parttens'
import { BotIcon, CircleIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../../test-utils/property-surface'
import { FlagCanvas } from './flag-canvas.tsx'

const meta = {
  args: {
    active: true,
    activeIcon: BotIcon,
    inactiveIcon: CircleIcon,
    label: 'Overdue',
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
      name: 'Prazo: Overdue',
    })

    await expect(flag.textContent).toBe('Overdue')
    await expect(iconIn(canvasElement)).toHaveClass('lucide-bot')
  },
}

export const HidesInactiveByDefault: Story = {
  args: { active: false, inactiveLabel: 'On time' },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="property-surface"]'),
    ).toBeNull()
    await expect(within(canvasElement).queryByText('On time')).toBeNull()
  },
}

export const ShowsInactiveWhenRequested: Story = {
  args: { active: false, inactiveLabel: 'On time', showInactive: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('On time')).toBeVisible()
    await expect(canvas.queryByText('Overdue')).toBeNull()
    await expect(iconIn(canvasElement)).toHaveClass('lucide-circle')
  },
}

export const InactiveFallsBackToLabel: Story = {
  args: { active: false, showInactive: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Overdue')).toBeVisible()
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
    await esperarSuperficiePlana(canvasElement)
  },
}
