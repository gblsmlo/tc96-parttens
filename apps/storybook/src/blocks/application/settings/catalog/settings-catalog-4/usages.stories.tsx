import { SparkleIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsCatalog4,
  type SettingsCatalog4Action,
  type SettingsCatalog4Stage,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-4'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsCatalog4Handlers } from '../../../../../mocks/settings-catalog-4.ts'
import {
  phases,
  type SettingsCatalog4StageRecord,
  toStages,
} from '../../fixtures/settings-catalog-4.ts'
import { settingsCatalog4ControlArgs } from './settings-catalog-4-controls.ts'
import { ComposedSettingsCatalog4 } from './settings-catalog-4-layouts.tsx'

const onEditStage = fn()
const onDeleteStage = fn()
const onMoveStage = fn()
const onNewStage = fn()

const swap = (
  stages: SettingsCatalog4Stage[],
  stageId: string,
  action: 'move-up' | 'move-down',
) => {
  const index = stages.findIndex((stage) => stage.id === stageId)
  const phase = stages[index]?.phase
  const step = action === 'move-up' ? -1 : 1
  let target = index + step
  while (target >= 0 && target < stages.length) {
    if (stages[target]?.phase === phase) break
    target += step
  }
  if (index < 0 || stages[target]?.phase !== phase) return stages
  const next = [...stages]
  const moved = next[index] as SettingsCatalog4Stage
  next[index] = next[target] as SettingsCatalog4Stage
  next[target] = moved
  return next
}

const StageSettings = ({
  initialStages,
}: Readonly<{ initialStages: SettingsCatalog4Stage[] }>) => {
  const [stages, setStages] = useState(initialStages)

  return (
    <SettingsCatalog4
      onStageAction={(stageId: string, action: SettingsCatalog4Action) => {
        if (action === 'move-up' || action === 'move-down') {
          onMoveStage(stageId, action)
          setStages((current) => swap(current, stageId, action))
          return
        }
        if (action === 'edit') onEditStage(stageId)
        if (action === 'delete') onDeleteStage(stageId)
      }}
      onStageCreate={(name, phaseId) => {
        onNewStage(name, phaseId)
        setStages((current) => [
          ...current,
          {
            icon: SparkleIcon,
            id: name.toLowerCase(),
            leads: 0,
            name,
            phase: phaseId,
            tone: 'text-muted-foreground',
          },
        ])
      }}
      phases={phases}
      stages={stages}
    />
  )
}

const WorkspaceStages = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsCatalog4StageRecord[]>('/settings/stages'),
    queryKey: ['settings', 'stages'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsCatalog4
        {...settingsCatalog4ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <StageSettings initialStages={toStages(data)} />
}

const meta = {
  component: WorkspaceStages,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Catalog/Settings4/Usages',
} satisfies Meta<typeof WorkspaceStages>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog4Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog4Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog4Handlers.pending)
  },
}

export const MoveDownReordersWithinPhase: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog4Handlers.loaded)
  },
}

export const NewStageAppendsToFirstPhase: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog4Handlers.loaded)
  },
}
