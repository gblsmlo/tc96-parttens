import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar5 } from '@tc96/blocks/application/navbar/navbar-5'
import { fn } from 'storybook/test'
import { actions, breadcrumb, people } from '../fixtures/navbar-5.ts'

const meta = {
  args: {
    actions,
    breadcrumb,
    onPublish: fn(),
    onPublishAction: fn(),
    people,
    status: 'changed',
  },
  component: Navbar5,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Navbar/Navbar5/API Reference',
} satisfies Meta<typeof Navbar5>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
