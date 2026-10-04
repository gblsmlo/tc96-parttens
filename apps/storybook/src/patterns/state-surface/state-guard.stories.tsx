import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  StateGuard,
  type StateGuardState,
  type StateSurfaceProps,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { expect, within } from 'storybook/test'

function GuardDemo({
  state,
  surface,
}: {
  state: StateGuardState
  surface: Omit<StateSurfaceProps, 'kind'>
}) {
  return (
    <StateGuard state={state} surface={surface}>
      <p className="text-sm">Confidential record</p>
    </StateGuard>
  )
}

const meta = {
  args: {
    state: 'data',
    surface: {
      description: 'Please wait while the records load.',
      title: 'Loading',
    },
  },
  component: GuardDemo,
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
          'Mounts its children only when `state` is `data`. `loading` renders a light status block; every other state renders the matching `StateSurface`. `surface` is required outside `data`.',
      },
    },
    layout: 'padded',
  },
  title: 'Patterns/StateGuard',
} satisfies Meta<typeof GuardDemo>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: {
    state: 'loading',
  },
}

export const Blocked: Story = {
  args: {
    state: 'permission',
    surface: {
      actions: <Button variant="outline">Request access</Button>,
      description: 'Ask an admin to grant you access to this resource.',
      title: 'Restricted access',
    },
  },
}

export const BlockedInteraction: Story = {
  ...Blocked,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('alert')).toHaveAttribute(
      'data-kind',
      'permission',
    )
    await expect(canvas.queryByText('Confidential record')).toBeNull()
  },
  tags: ['!dev', '!autodocs'],
}

export const LoadingInteraction: Story = {
  ...Loading,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('status')).toHaveAttribute(
      'data-slot',
      'state-guard-loading',
    )
    await expect(canvas.queryByText('Confidential record')).toBeNull()
  },
  tags: ['!dev', '!autodocs'],
}
