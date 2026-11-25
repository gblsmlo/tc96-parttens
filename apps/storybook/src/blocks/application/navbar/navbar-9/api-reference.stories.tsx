import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar9 } from '@tc96/ui/blocks/application/navbar/navbar-9'
import { fn } from 'storybook/test'
import { branches, path } from '../fixtures/navbar-9.ts'

const meta = {
  args: {
    branch: 'main',
    branches,
    name: 'Código Vivo',
    onBranchChange: fn(),
    onRun: fn(),
    onShare: fn(),
    path,
  },
  component: Navbar9,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Navbar/Navbar9/API Reference',
} satisfies Meta<typeof Navbar9>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
