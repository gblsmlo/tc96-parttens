import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card4 } from '@tc96/ui/blocks/application/card/card-4'
import { fn } from 'storybook/test'
import { meetings } from '../fixtures/card-4.ts'

const meta = {
  args: { meetings, onJoin: fn() },
  component: Card4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Card/Card4/API Reference',
} satisfies Meta<typeof Card4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
