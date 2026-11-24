import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar1 } from '@tc96/blocks/application/navbar/navbar-1'
import { breadcrumbs, collaborators, tabs } from '../fixtures/navbar-1.ts'

const meta = {
  args: {
    breadcrumbs,
    collaborators,
    onShare: () => {},
    onTabChange: () => {},
    tab: 'overview',
    tabs,
  },
  component: Navbar1,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Navbar/Navbar1/API Reference',
} satisfies Meta<typeof Navbar1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
