import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar12 } from '@tc96/ui/blocks/application/navbar/navbar-12'
import { cta, items, logo, name } from '../fixtures/navbar-12.tsx'

const meta = {
  args: { cta, items, logo, name },
  component: Navbar12,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Navbar/Navbar12/API Reference',
} satisfies Meta<typeof Navbar12>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
