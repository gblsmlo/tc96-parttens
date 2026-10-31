import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlagProperty } from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const meta = {
  component: FlagProperty,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Flag/Behavior',
} satisfies Meta<typeof FlagProperty>

export default meta

type Story = StoryObj<typeof meta>

export const ActiveSecondaryBadge: Story = {
  args: { active: true, ariaLabel: 'Automatic', label: 'Automatic' },
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByLabelText('Automatic: Automatic')

    await expect(badge.textContent).toContain('Automatic')
  },
}

export const HidesInactiveByDefault: Story = {
  args: { active: false, label: 'Overdue' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByText('Overdue')).toBeNull()
  },
}

export const ShowsInactiveWhenRequested: Story = {
  args: {
    active: false,
    inactiveLabel: 'On time',
    label: 'Overdue',
    showInactive: true,
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('On time')).toBeInTheDocument()
  },
}

export const PlainWithoutBadge: Story = {
  args: { active: true, label: 'Automatic', variant: 'plain' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Automatic'),
    ).toBeInTheDocument()
  },
}
