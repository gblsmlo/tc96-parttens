import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { SettingsCatalog6 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-6'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsCatalog6Handlers } from '../../../../../mocks/settings-catalog-6.ts'
import type { SettingsCatalog6Data } from '../../fixtures/settings-catalog-6.ts'
import { settingsCatalog6ControlArgs } from './settings-catalog-6-controls.ts'
import { ComposedSettingsCatalog6 } from './settings-catalog-6-layouts.tsx'

const NextActionsSettings = ({
  data,
}: Readonly<{ data: SettingsCatalog6Data }>) => {
  const [blockStageChanges, setBlockStageChanges] = useState(
    data.blockStageChanges,
  )
  const [required, setRequired] = useState(() =>
    Object.fromEntries(
      data.stages.flatMap((stage) =>
        stage.actions.map((action) => [action.id, action.required]),
      ),
    ),
  )
  const stages = data.stages.map((stage) => ({
    ...stage,
    actions: stage.actions.map((action) => ({
      ...action,
      required: required[action.id] ?? action.required,
    })),
  }))

  return (
    <SettingsCatalog6
      blockStageChanges={blockStageChanges}
      onBlockStageChangesChange={setBlockStageChanges}
      onCreate={fn()}
      onNextActionAction={fn()}
      onRequiredChange={(actionId, checked) =>
        setRequired((current) => ({ ...current, [actionId]: checked }))
      }
      stages={stages}
    />
  )
}

const WorkspaceNextActions = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsCatalog6Data>('/settings/next-actions'),
    queryKey: ['settings', 'next-actions'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsCatalog6
        {...settingsCatalog6ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <NextActionsSettings data={data} />
}

const meta = {
  component: WorkspaceNextActions,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Catalog/Settings6/Usages',
} satisfies Meta<typeof WorkspaceNextActions>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog6Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog6Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog6Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog6Handlers.pending)
  },
}
