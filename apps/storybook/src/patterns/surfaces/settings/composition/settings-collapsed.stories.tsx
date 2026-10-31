import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCollapsed } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const onOpenChange = fn()

function ControlledCollapsed() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline">
        Open items
      </Button>
      <SettingsCollapsed onOpenChange={onOpenChange} open={open} title="Items">
        <p>Nested row</p>
      </SettingsCollapsed>
    </div>
  )
}

const meta = {
  args: {
    children: <p>Nested row</p>,
    onOpenChange,
    title: 'Items',
  },
  component: SettingsCollapsed,
  decorators: [
    (Story) => (
      <div className="w-lg">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Composition/Collapsed',
} satisfies Meta<typeof SettingsCollapsed>

export default meta
type Story = StoryObj<typeof meta>

export const ActionsStayVisibleWhileCollapsed: Story = {
  args: {
    actions: <Button variant="ghost">Add item</Button>,
    defaultOpen: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Items' })
    const heading = canvas.getByRole('heading', { level: 2, name: 'Items' })
    const trigger = within(heading).getByRole('button', { name: 'Items' })
    const action = canvas.getByRole('button', { name: 'Add item' })

    await expect(region).toHaveAttribute('data-slot', 'settings-collapsed')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText('Nested row')).toBeNull()
    await expect(region.contains(action)).toBe(true)
    await expect(trigger.contains(action)).toBe(false)

    await userEvent.click(action)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)
    await waitFor(() => expect(canvas.getByText('Nested row')).toBeVisible())
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  },
}

export const StartsExpandedAndReportsCollapse: Story = {
  play: async ({ canvasElement }) => {
    onOpenChange.mockClear()
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Items' })

    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('Nested row')).toBeVisible()

    await userEvent.click(trigger)
    await waitFor(() => expect(canvas.queryByText('Nested row')).toBeNull())
    await expect(onOpenChange.mock.calls.map(([open]) => open)).toEqual([false])
  },
}

export const FollowsControlledOpenValue: Story = {
  render: () => <ControlledCollapsed />,
  play: async ({ canvasElement }) => {
    onOpenChange.mockClear()
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Items' })

    await userEvent.click(trigger)
    await expect(onOpenChange.mock.calls.map(([open]) => open)).toEqual([true])
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(canvas.getByRole('button', { name: 'Open items' }))
    await waitFor(() => expect(canvas.getByText('Nested row')).toBeVisible())
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  },
}
