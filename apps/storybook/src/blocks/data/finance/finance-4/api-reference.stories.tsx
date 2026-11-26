import type { Meta, StoryObj } from '@storybook/react-vite'
import { Finance4 } from '@tc96/ui/blocks/data/finance/finance-4'
import { fn } from 'storybook/test'
import {
  cases,
  clients,
  entries,
  lawyers,
  ptBRLabels,
  savedViews,
} from '../fixtures/finance-4.ts'

const meta = {
  args: {
    cases,
    clients,
    entries,
    labels: ptBRLabels,
    lawyers,
    onBulkDelete: fn(),
    onBulkResponsibleChange: fn(),
    onBulkSettle: fn(),
    onCreate: fn(),
    onGroupByChange: fn(),
    onKindFilterChange: fn(),
    onLawyerFilterChange: fn(),
    onModeChange: fn(),
    onOpen: fn(),
    onSavedViewSelect: fn(),
    onSelectedIdsChange: fn(),
    onSituationFilterChange: fn(),
    onSortChange: fn(),
    onViewChange: fn(),
    savedViews,
  },
  component: Finance4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Finance/Finance4/API Reference',
} satisfies Meta<typeof Finance4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
