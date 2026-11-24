import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings18 } from '@tc96/blocks/application/settings/settings-18'
import { fn } from 'storybook/test'
import { capabilities, roles } from '../fixtures/settings-18.ts'

const meta = {
  args: {
    capabilities,
    onCapabilityChange: fn(),
    onRoleChange: fn(),
    roles,
    selectedRole: 'editor',
  },
  component: Settings18,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings18/API Reference',
} satisfies Meta<typeof Settings18>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
