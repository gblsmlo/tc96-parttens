import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings17 } from '@tc96/blocks/application/settings/settings-17'
import { fn } from 'storybook/test'
import { privacyControls } from '../fixtures/settings-17.ts'

const meta = {
  args: {
    controls: privacyControls,
    onAction: fn(),
    onCheckedChange: fn(),
  },
  component: Settings17,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings17/API Reference',
} satisfies Meta<typeof Settings17>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
