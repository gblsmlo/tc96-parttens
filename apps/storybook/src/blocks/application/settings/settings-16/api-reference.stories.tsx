import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings16 } from '@tc96/blocks/application/settings/settings-16'
import { fn } from 'storybook/test'
import {
  settings16ArchivedCostCenters,
  settings16CostCenters,
} from '../fixtures/settings-16.ts'

const meta = {
  args: {
    archivedCostCenters: settings16ArchivedCostCenters,
    costCenters: settings16CostCenters,
    onCostCenterAction: fn(),
    onCreate: fn(),
  },
  component: Settings16,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings16/API Reference',
} satisfies Meta<typeof Settings16>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
