import type { Meta, StoryObj } from '@storybook/react-vite'
import { StateSurface } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { BellOffIcon } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

const meta = {
  args: {
    description: 'There are no records to show in this view.',
    kind: 'empty',
    title: 'No records',
  },
  component: StateSurface,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Surface shown in place of data. `error` and `permission` are announced as `alert`; `empty`, `no-result` and `not-found` as `status`. `icon` replaces the default icon and `null` hides it. `actions` is a slot: the consumer picks the button variant.',
      },
    },
    layout: 'padded',
  },
  title: 'Patterns/StateSurface',
} satisfies Meta<typeof StateSurface>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    actions: <Button variant="outline">Create record</Button>,
  },
}

export const NoResult: Story = {
  args: {
    actions: <Button variant="outline">Clear filters</Button>,
    description: 'Remove or adjust the filters to widen the search.',
    kind: 'no-result',
    title: 'No results found',
  },
}

export const Failure: Story = {
  name: 'Error',
  args: {
    actions: <Button variant="outline">Try again</Button>,
    description: 'The records could not be loaded.',
    kind: 'error',
    title: 'Something went wrong',
  },
}

export const Permission: Story = {
  args: {
    description: 'Ask an admin to grant you access to this resource.',
    kind: 'permission',
    title: 'Restricted access',
  },
}

export const NotFound: Story = {
  args: {
    description: 'The record may have been deleted or moved.',
    kind: 'not-found',
    title: 'Record not found',
  },
}

export const CustomIcon: Story = {
  args: {
    description: 'You will see new activity here.',
    icon: <BellOffIcon />,
    title: 'No notifications',
  },
}

export const Interaction: Story = {
  args: {
    actions: <Button onClick={fn()}>Try again</Button>,
    kind: 'error',
    title: 'Something went wrong',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }))
  },
  tags: ['!dev', '!autodocs'],
}

export const StatusRole: Story = {
  args: {
    kind: 'no-result',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('status')).toHaveAttribute(
      'data-kind',
      'no-result',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
  tags: ['!dev', '!autodocs'],
}
