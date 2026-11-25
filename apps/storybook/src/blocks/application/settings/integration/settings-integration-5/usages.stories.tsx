import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsIntegration5,
  type SettingsIntegration5App,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-5'
import { useEffect, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsIntegration5Handlers } from '../../../../../mocks/settings-integration-5.ts'
import { settingsIntegration5ControlArgs } from './settings-integration-5-controls.ts'
import { ComposedSettingsIntegration5 } from './settings-integration-5-layouts.tsx'

const ConnectedApps = ({
  initial,
}: Readonly<{ initial: SettingsIntegration5App[] }>) => {
  const [apps, setApps] = useState(initial)

  useEffect(() => setApps(initial), [initial])

  const setConnected = (appId: string, connected: boolean) =>
    setApps((current) =>
      current.map((app) => (app.id === appId ? { ...app, connected } : app)),
    )

  const setChannel = (appId: string, channelId: string, enabled: boolean) =>
    setApps((current) =>
      current.map((app) =>
        app.id === appId
          ? {
              ...app,
              channels: app.channels?.map((channel) =>
                channel.id === channelId ? { ...channel, enabled } : channel,
              ),
            }
          : app,
      ),
    )

  return (
    <SettingsIntegration5
      apps={apps}
      onChannelChange={setChannel}
      onConnect={(appId) => setConnected(appId, true)}
      onDisconnect={(appId) => setConnected(appId, false)}
    />
  )
}

const WorkspaceApps = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<SettingsIntegration5App[]>('/settings/integration-events'),
    queryKey: ['settings', 'integration-events'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsIntegration5
        {...settingsIntegration5ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <ConnectedApps initial={data} />
}

const meta = {
  component: WorkspaceApps,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Integration/Settings5/Usages',
} satisfies Meta<typeof WorkspaceApps>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration5Handlers.apps)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Conectar Linear' }),
    )
    await userEvent.click(
      await canvas.findByRole('switch', { name: 'Novos leads em Linear' }),
    )
    await expect(
      await canvas.findByRole('switch', { name: 'Novos leads em Linear' }),
    ).toBeChecked()
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Desconectar Slack' }),
    )
    await expect(
      await canvas.findByRole('button', { name: 'Conectar Slack' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration5Handlers.appsEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma integração disponível'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration5Handlers.appsError)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as integrações'),
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
    msw.use(settingsIntegration5Handlers.appsPending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando integrações',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
