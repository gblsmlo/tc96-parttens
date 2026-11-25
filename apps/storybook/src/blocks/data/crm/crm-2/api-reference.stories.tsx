import type { Meta, StoryObj } from '@storybook/react-vite'
import { Crm2 } from '@tc96/ui/blocks/data/crm/crm-2'
import { fn } from 'storybook/test'
import {
  boardLeads,
  owners,
  stages,
  stageValues,
  tags,
} from '../fixtures/crm-2.ts'

const meta = {
  args: {
    leads: boardLeads,
    onCreate: fn(),
    onCreateInStage: fn(),
    onGroupByChange: fn(),
    onModeChange: fn(),
    onOpen: fn(),
    onOwnerFilterChange: fn(),
    onSearchChange: fn(),
    onStageChange: fn(),
    onStageFilterChange: fn(),
    onTagFilterChange: fn(),
    owners,
    stageValues,
    stages,
    tags,
  },
  component: Crm2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/CRM/Crm2/API Reference',
} satisfies Meta<typeof Crm2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
