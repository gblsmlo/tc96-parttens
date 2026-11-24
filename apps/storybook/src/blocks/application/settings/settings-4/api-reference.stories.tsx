import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings4 } from '@tc96/blocks/application/settings/settings-4'
import { fn } from 'storybook/test'
import { settings4Data } from '../fixtures/settings-4.ts'

const meta = {
  args: {
    ...settings4Data,
    onColorThemeChange: fn(),
    onModeChange: fn(),
  },
  component: Settings4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings4/API Reference',
} satisfies Meta<typeof Settings4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
