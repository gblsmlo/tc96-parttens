import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card2 } from '@tc96/blocks/application/card/card-2'
import { integrations } from '../fixtures/card-2.ts'

const meta = {
  args: { integrations, onConnect: () => {} },
  component: Card2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Card/Card2/API Reference',
} satisfies Meta<typeof Card2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
