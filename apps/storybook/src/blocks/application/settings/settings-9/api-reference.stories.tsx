import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings9 } from '@tc96/ui/blocks/application/settings/settings-9'
import { fn } from 'storybook/test'
import { rules } from '../fixtures/settings-9.ts'

const meta = {
  args: { onCreate: fn(), onRuleAction: fn(), rules },
  component: Settings9,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings9/API Reference',
} satisfies Meta<typeof Settings9>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
