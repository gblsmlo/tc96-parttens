import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings8 } from '@tc96/blocks/application/settings/settings-8'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings8Handlers } from '../../../../mocks/settings-8.ts'
import type { Settings8Sla } from '../fixtures/settings-8.ts'
import { settings8ControlArgs } from './settings-8-controls.ts'
import { ComposedSettings8 } from './settings-8-layouts.tsx'

const SlaSettings = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings8Sla>('/settings/sla'),
    queryKey: ['settings', 'sla'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings8
        {...settings8ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
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
  tags: ['!autodocs', 'msw'],
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
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar os SLAs'),
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
    msw.use(settings8Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton =
      await within(canvasElement).findByLabelText('Carregando SLAs')
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
