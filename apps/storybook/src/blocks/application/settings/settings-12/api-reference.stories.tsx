import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings12 } from '@tc96/ui/blocks/application/settings/settings-12'
import { fn } from 'storybook/test'
import { settings12Data } from '../fixtures/settings-12.ts'

const meta = {
  args: {
    blockStageChanges: settings12Data.blockStageChanges,
    onBlockStageChangesChange: fn(),
    onCreate: fn(),
    onNextActionAction: fn(),
    onRequiredChange: fn(),
    stages: settings12Data.stages,
  },
  component: Settings12,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings12/API Reference',
} satisfies Meta<typeof Settings12>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
