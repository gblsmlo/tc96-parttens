import type { Meta, StoryObj } from '@storybook/react-vite'
import { Crm3 } from '@tc96/ui/blocks/data/crm/crm-3'
import { fn } from 'storybook/test'
import {
  boardLeads,
  counts,
  crm3Labels,
  owners,
  savedViews,
  stages,
  stageValues,
  tags,
} from '../fixtures/crm-3.ts'

const meta = {
  args: {
    counts,
    labels: { ...crm3Labels, create: 'Novo lead', title: 'Leads' },
    leads: boardLeads,
    onCreate: fn(),
    onCreateInStage: fn(),
    onGroupByChange: fn(),
    onModeChange: fn(),
    onOpen: fn(),
    onOriginFilterChange: fn(),
    onOwnerFilterChange: fn(),
    onSavedViewCreate: fn(),
    onSavedViewSelect: fn(),
    onStageChange: fn(),
    onStageFilterChange: fn(),
    onTagFilterChange: fn(),
    owners,
    savedViews,
    stageValues,
    stages,
    tags,
  },
  component: Crm3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/CRM/Crm3/API Reference',
} satisfies Meta<typeof Crm3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
