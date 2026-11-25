import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar10 } from '@tc96/ui/blocks/application/navbar/navbar-10'
import { fn } from 'storybook/test'
import { services, user } from '../fixtures/navbar-10.ts'
import { AccountMenu, Logo } from './navbar-10-layouts.tsx'

const meta = {
  args: {
    logo: <Logo />,
    menu: <AccountMenu onAction={fn()} />,
    method: 'GET',
    name: 'Portal Dev',
    onMethodChange: fn(),
    onPathChange: fn(),
    onSend: fn(),
    onServiceChange: fn(),
    path: '/modelos/{id}',
    service: 'models',
    services,
    user,
  },
  component: Navbar10,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Navbar/Navbar10/API Reference',
} satisfies Meta<typeof Navbar10>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
