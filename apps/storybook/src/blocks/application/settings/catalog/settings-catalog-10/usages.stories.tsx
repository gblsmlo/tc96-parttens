import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsCatalog10,
  type SettingsCatalog10CostCenter,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-10'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsCatalog10Handlers } from '../../../../../mocks/settings-catalog-10.ts'
import { settingsCatalog10ControlArgs } from './settings-catalog-10-controls.ts'
import { ComposedSettingsCatalog10 } from './settings-catalog-10-layouts.tsx'

const WorkspaceCostCenters = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<SettingsCatalog10CostCenter[]>('/settings/cost-centers'),
    queryKey: ['settings', 'cost-centers'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsCatalog10
        {...settingsCatalog10ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <SettingsCatalog10
      costCenters={data}
      onCostCenterAction={fn()}
      onCreate={fn()}
    />
  )
}

const meta = {
  component: WorkspaceCostCenters,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Catalog/Settings10/Usages',
} satisfies Meta<typeof WorkspaceCostCenters>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog10Handlers.costCenters)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog10Handlers.costCentersEmpty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog10Handlers.costCentersError)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog10Handlers.costCentersPending)
  },
}
