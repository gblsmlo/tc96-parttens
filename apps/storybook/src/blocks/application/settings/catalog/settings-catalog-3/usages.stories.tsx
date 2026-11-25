import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsCatalog3,
  type SettingsCatalog3Rule,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-3'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsCatalog3Handlers } from '../../../../../mocks/settings-catalog-3.ts'
import { settingsCatalog3ControlArgs } from './settings-catalog-3-controls.ts'
import { ComposedSettingsCatalog3 } from './settings-catalog-3-layouts.tsx'

const WorkspaceRules = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsCatalog3Rule[]>('/settings/rules'),
    queryKey: ['settings', 'rules'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsCatalog3
        {...settingsCatalog3ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <SettingsCatalog3 onCreate={fn()} onRuleAction={fn()} rules={data} />
}

const meta = {
  component: WorkspaceRules,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Catalog/Settings3/Usages',
} satisfies Meta<typeof WorkspaceRules>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog3Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog3Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog3Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog3Handlers.pending)
  },
}
