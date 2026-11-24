import { SparkleIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings10,
  type Settings10Action,
  type Settings10Stage,
} from '@tc96/blocks/application/settings/settings-10'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings10Handlers } from '../../../../mocks/settings-10.ts'
import {
  phases,
  type Settings10StageRecord,
  toStages,
} from '../fixtures/settings-10.ts'
import { settings10ControlArgs } from './settings-10-controls.ts'
import { ComposedSettings10 } from './settings-10-layouts.tsx'

const onEditStage = fn()
const onDeleteStage = fn()
const onMoveStage = fn()
const onNewStage = fn()

const swap = (
  stages: Settings10Stage[],
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
  const moved = next[index] as Settings10Stage
  next[index] = next[target] as Settings10Stage
  next[target] = moved
  return next
}

const StageSettings = ({
  initialStages,
}: Readonly<{ initialStages: Settings10Stage[] }>) => {
  const [stages, setStages] = useState(initialStages)

  return (
    <Settings10
      onStageAction={(stageId: string, action: Settings10Action) => {
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
    queryFn: () => fetchJson<Settings10StageRecord[]>('/settings/stages'),
    queryKey: ['settings', 'stages'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings10
        {...settings10ControlArgs}
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
  title: 'Blocks/Application/Settings/Settings10/Usages',
} satisfies Meta<typeof WorkspaceStages>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings10Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Negociação')).toBeVisible()
    await expect(canvas.getByText('12 leads · Fecha como ganho')).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings10Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as etapas'),
    ).toBeVisible()
    const retry = canvas.getByRole('button', { name: 'Tentar novamente' })
    await expect(retry).toBeEnabled()
    await userEvent.click(retry)
    await expect(await canvas.findByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings10Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton =
      await within(canvasElement).findByLabelText('Carregando etapas')
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}

export const MoveDownReordersWithinPhase: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings10Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Ações de Proposta' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Mover para baixo' }),
    )
    const phase = canvas.getByRole('region', { name: 'Em aberto' })
    await waitFor(() => {
      const text = phase.textContent ?? ''
      expect(text.indexOf('Negociação')).toBeLessThan(text.indexOf('Proposta'))
    })
    await expect(onMoveStage).toHaveBeenCalledWith('proposta', 'move-down')
  },
}

export const NewStageAppendsToFirstPhase: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings10Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByRole('region', { name: 'Em aberto' })
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Nova etapa' }),
    )
    const dialog = await screen.findByRole('dialog', { name: 'Nova etapa' })
    await userEvent.type(
      within(dialog).getByRole('textbox', { name: 'Nome da etapa' }),
      'Contrato',
    )
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Criar etapa' }),
    )
    const phase = canvas.getByRole('region', { name: 'Em aberto' })
    await waitFor(() => {
      const text = phase.textContent ?? ''
      expect(text.indexOf('Contrato')).toBeGreaterThan(
        text.indexOf('Negociação'),
      )
    })
    await expect(onNewStage).toHaveBeenCalledWith('Contrato', 'aberto')
  },
}
