import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsIntegration8,
  type SettingsIntegration8Item,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-8'
import { useEffect, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsIntegration8Handlers } from '../../../../../mocks/settings-integration-8.ts'
import { settingsIntegration8Items } from '../../fixtures/settings-integration-8.ts'
import { settingsIntegration8ControlArgs } from './settings-integration-8-controls.ts'
import { ComposedSettingsIntegration8 } from './settings-integration-8-layouts.tsx'

const logos = new Map(
  settingsIntegration8Items.map((item) => [item.id, item.logo]),
)

const ApiIntegrations = ({
  initial,
}: Readonly<{ initial: SettingsIntegration8Item[] }>) => {
  const [items, setItems] = useState(initial)
  const [allPaused, setAllPaused] = useState(false)

  useEffect(() => setItems(initial), [initial])

  return (
    <SettingsIntegration8
      allPaused={allPaused}
      integrations={items}
      onAllPausedChange={setAllPaused}
      onCopyKey={(id) =>
        navigator.clipboard?.writeText(
          items.find((item) => item.id === id)?.keyPreview ?? '',
        )
      }
      onEnabledChange={(id, enabled) =>
        setItems((current) =>
          current.map((item) => (item.id === id ? { ...item, enabled } : item)),
        )
      }
    />
  )
}

const WorkspaceApiIntegrations = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: async () =>
      (
        await fetchJson<SettingsIntegration8Item[]>(
          '/settings/api-integrations',
        )
      ).map((item) => ({ ...item, logo: logos.get(item.id) })),
    queryKey: ['settings', 'api-integrations'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsIntegration8
        {...settingsIntegration8ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <ApiIntegrations initial={data} />
}

const meta = {
  component: WorkspaceApiIntegrations,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Integration/Settings8/Usages',
} satisfies Meta<typeof WorkspaceApiIntegrations>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration8Handlers.items)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const pause = await canvas.findByRole('switch', { name: 'Pausar tudo' })
    await userEvent.click(pause)
    await expect(
      canvas.getByRole('switch', { name: 'Ativar GitHub' }),
    ).toHaveAttribute('aria-checked', 'false')
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration8Handlers.itemsEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma integração de API'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration8Handlers.itemsError)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText(
        'Não foi possível carregar as integrações de API',
      ),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    ).toBeEnabled()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration8Handlers.itemsPending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando integrações de API',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
