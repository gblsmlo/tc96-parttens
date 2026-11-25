import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar8 } from '@tc96/ui/blocks/application/navbar/navbar-8'
import { fn } from 'storybook/test'
import { categories, notifications, user } from '../fixtures/navbar-8.ts'
import { BrandMark, UserMenuItems } from './navbar-8-layouts.tsx'

const meta = {
  args: {
    categories,
    category: 'all',
    logo: <BrandMark />,
    menu: <UserMenuItems />,
    name: 'Orbit Agentes',
    notifications: notifications.map((item, index) => ({
      ...item,
      read: index >= 2,
    })),
    onCategoryChange: fn(),
    onDeploy: fn(),
    onNotificationSelect: fn(),
    user,
  },
  component: Navbar8,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Navbar/Navbar8/API Reference',
} satisfies Meta<typeof Navbar8>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
