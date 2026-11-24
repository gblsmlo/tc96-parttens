import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings8 } from '@tc96/blocks/application/settings/settings-8'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings8Handlers } from '../../../../mocks/settings-8.ts'
import type { Settings8Sla } from '../fixtures/settings-8.ts'

const SlaSettings = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings8Sla>('/settings/sla'),
    queryKey: ['settings', 'sla'],
  })

  if (isPending) return <Spinner aria-label="Carregando SLAs" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar os SLAs</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return <SlaSwitch initial={data.enabled} />
}

const SlaSwitch = ({ initial }: { initial: boolean }) => {
  const [enabled, setEnabled] = useState(initial)
  return <Settings8 enabled={enabled} onEnabledChange={setEnabled} />
}

const meta = {
  component: SlaSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings8/Usages',
} satisfies Meta<typeof SlaSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings8Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole('switch', { name: 'Ativar SLAs' }),
    ).toBeChecked()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings8Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os SLAs',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings8Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando SLAs'),
    ).toBeVisible()
  },
}
