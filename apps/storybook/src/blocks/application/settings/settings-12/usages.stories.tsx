import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings12 } from '@tc96/ui/blocks/application/settings/settings-12'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings12Handlers } from '../../../../mocks/settings-12.ts'
import type { Settings12Data } from '../fixtures/settings-12.ts'
import { settings12ControlArgs } from './settings-12-controls.ts'
import { ComposedSettings12 } from './settings-12-layouts.tsx'

const NextActionsSettings = ({ data }: Readonly<{ data: Settings12Data }>) => {
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
    <Settings12
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
    queryFn: () => fetchJson<Settings12Data>('/settings/next-actions'),
    queryKey: ['settings', 'next-actions'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings12
        {...settings12ControlArgs}
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
  title: 'Blocks/Application/Settings/Settings12/Usages',
} satisfies Meta<typeof WorkspaceNextActions>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings12Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Saindo de Novo lead')).toBeVisible()
    await expect(
      canvas.getByRole('switch', { name: 'Bloquear mudança de etapa' }),
    ).not.toBeChecked()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings12Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma próxima ação ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings12Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as próximas ações'),
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
    msw.use(settings12Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando próximas ações',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
