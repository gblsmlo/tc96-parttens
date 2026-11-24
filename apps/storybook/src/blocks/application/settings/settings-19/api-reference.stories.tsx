import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings19 } from '@tc96/blocks/application/settings/settings-19'
import { fn } from 'storybook/test'
import { endpoints } from '../fixtures/settings-19.ts'

const meta = {
  args: {
    endpoints,
    onCreate: fn(),
    onEnabledChange: fn(),
    onEndpointAction: fn(),
  },
  component: Settings19,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings19/API Reference',
} satisfies Meta<typeof Settings19>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
