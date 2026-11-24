import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card3 } from '@tc96/blocks/application/card/card-3'
import { profile } from '../fixtures/card-3.ts'

const meta = {
  args: { onFollow: () => {}, onMessage: () => {}, profile },
  component: Card3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Card/Card3/API Reference',
} satisfies Meta<typeof Card3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
