import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card8 } from '@tc96/ui/blocks/application/card/card-8'
import { fn } from 'storybook/test'
import { meetingActions, meetings } from '../fixtures/card-8.tsx'

const meta = {
  args: {
    actions: meetingActions,
    meetings,
    onActionSelect: fn(),
    onJoin: fn(),
  },
  component: Card8,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Card/Card8/API Reference',
} satisfies Meta<typeof Card8>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
