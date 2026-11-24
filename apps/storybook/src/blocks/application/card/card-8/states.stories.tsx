import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card8 } from '@tc96/blocks/application/card/card-8'
import { fn } from 'storybook/test'
import { meetingActions, meetings } from '../fixtures/card-8.tsx'

const meta = {
  args: {
    actions: meetingActions,
    meetings,
    onActionSelect: fn(),
    onJoin: fn(),
    onRetry: fn(),
  },
  component: Card8,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card8/States',
} satisfies Meta<typeof Card8>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = { args: { pending: true } }

export const ErrorState: Story = { args: { error: true }, name: 'Error' }

export const Empty: Story = { args: { meetings: [] } }
