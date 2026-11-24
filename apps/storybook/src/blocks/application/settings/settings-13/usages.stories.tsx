import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings13 } from '@tc96/blocks/application/settings/settings-13'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { useState } from 'react'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings13Handlers } from '../../../../mocks/settings-13.ts'
import type { Settings13Data } from '../fixtures/settings-13.ts'

const LossReasonsSettings = ({ data }: Readonly<{ data: Settings13Data }>) => {
  const [allowCustomReason, setAllowCustomReason] = useState(
    data.allowCustomReason,
  )
  const [requireReason, setRequireReason] = useState(data.requireReason)

  return (
    <Settings13
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
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings13Data>('/settings/loss-reasons'),
    queryKey: ['settings', 'loss-reasons'],
  })

  if (isPending) return <Spinner aria-label="Carregando motivos" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar os motivos</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return <LossReasonsSettings data={data} />
}

const meta = {
  component: WorkspaceLossReasons,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings13/Usages',
} satisfies Meta<typeof WorkspaceLossReasons>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings13Handlers.loaded)
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
    msw.use(settings13Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum motivo de perda ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings13Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os motivos',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings13Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando motivos'),
    ).toBeVisible()
  },
}
