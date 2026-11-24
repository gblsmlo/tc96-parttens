import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar3 } from '@tc96/blocks/application/navbar/navbar-3'
import {
  notifications,
  routes,
  user,
  userActions,
} from '../fixtures/navbar-3.ts'

const meta = {
  args: {
    notifications,
    onNavigate: () => {},
    onUserAction: () => {},
    routes,
    user,
    userActions,
  },
  component: Navbar3,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Navbar/Navbar3/API Reference',
} satisfies Meta<typeof Navbar3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
