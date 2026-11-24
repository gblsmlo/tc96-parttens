import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings10 } from '@tc96/blocks/application/settings/settings-10'
import { fn } from 'storybook/test'
import { phases, stages } from '../fixtures/settings-10.ts'

const meta = {
  args: { onStageAction: fn(), onStageCreate: fn(), phases, stages },
  component: Settings10,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings10/API Reference',
} satisfies Meta<typeof Settings10>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
