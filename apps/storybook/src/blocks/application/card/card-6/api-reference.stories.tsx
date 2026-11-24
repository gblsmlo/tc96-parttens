import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card6 } from '@tc96/ui/blocks/application/card/card-6'
import { fn } from 'storybook/test'
import { jobs } from '../fixtures/card-6.ts'

const meta = {
  args: {
    jobs,
    onApply: fn(),
    onSaveChange: fn(),
    saved: ['data'],
  },
  component: Card6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Card/Card6/API Reference',
} satisfies Meta<typeof Card6>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
