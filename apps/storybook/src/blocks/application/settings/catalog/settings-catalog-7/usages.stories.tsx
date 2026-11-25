import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { SettingsCatalog7 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-7'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsCatalog7Handlers } from '../../../../../mocks/settings-catalog-7.ts'
import type { SettingsCatalog7Data } from '../../fixtures/settings-catalog-7.ts'
import { settingsCatalog7ControlArgs } from './settings-catalog-7-controls.ts'
import { ComposedSettingsCatalog7 } from './settings-catalog-7-layouts.tsx'

const LossReasonsSettings = ({
  data,
}: Readonly<{ data: SettingsCatalog7Data }>) => {
  const [allowCustomReason, setAllowCustomReason] = useState(
    data.allowCustomReason,
  )
  const [requireReason, setRequireReason] = useState(data.requireReason)

  return (
    <SettingsCatalog7
      allowCustomReason={allowCustomReason}
      archivedReasons={data.archivedReasons}
      onAllowCustomReasonChange={setAllowCustomReason}
      onCreate={fn()}
      onReasonAction={fn()}
      onRequireReasonChange={setRequireReason}
      reasons={data.reasons}
      requireReason={requireReason}
    />
  )
}

const WorkspaceLossReasons = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsCatalog7Data>('/settings/loss-reasons'),
    queryKey: ['settings', 'loss-reasons'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsCatalog7
        {...settingsCatalog7ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <LossReasonsSettings data={data} />
}

const meta = {
  component: WorkspaceLossReasons,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Catalog/Settings7/Usages',
} satisfies Meta<typeof WorkspaceLossReasons>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog7Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Preço acima do orçamento'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('switch', { name: 'Exigir motivo de perda' }),
    ).not.toBeChecked()
    await expect(
      canvas.getByRole('switch', { name: 'Permitir motivo personalizado' }),
    ).toBeChecked()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog7Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum motivo de perda ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog7Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar os motivos'),
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
    msw.use(settingsCatalog7Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton =
      await within(canvasElement).findByLabelText('Carregando motivos')
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
