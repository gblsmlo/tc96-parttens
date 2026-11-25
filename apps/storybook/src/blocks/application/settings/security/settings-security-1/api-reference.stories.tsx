import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsSecurity1 } from '@tc96/ui/blocks/application/settings/security/settings-security-1'
import { fn } from 'storybook/test'
import { privacyControls } from '../../fixtures/settings-security-1.ts'

const meta = {
  args: {
    controls: privacyControls,
    onAction: fn(),
    onCheckedChange: fn(),
  },
  component: SettingsSecurity1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Security/Settings1/API Reference',
} satisfies Meta<typeof SettingsSecurity1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
