import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card1 } from '@tc96/ui/blocks/application/card/card-1'
import { facts } from '../fixtures/card-1.ts'

const meta = {
  args: { facts },
  component: Card1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Card/Card1/API Reference',
} satisfies Meta<typeof Card1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
