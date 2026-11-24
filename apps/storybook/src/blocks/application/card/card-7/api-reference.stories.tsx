import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card7 } from '@tc96/blocks/application/card/card-7'
import { fn } from 'storybook/test'
import { contact, items, stats } from '../fixtures/card-7.tsx'

const meta = {
  args: { className: 'max-w-sm', contact, items, onAction: fn(), stats },
  component: Card7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Card/Card7/API Reference',
} satisfies Meta<typeof Card7>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
