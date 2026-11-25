import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsIntegration2,
  type SettingsIntegration2App,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-2'
import { useEffect, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsIntegration2Handlers } from '../../../../../mocks/settings-integration-2.ts'
import { settingsIntegration2ControlArgs } from './settings-integration-2-controls.ts'
import { ComposedSettingsIntegration2 } from './settings-integration-2-layouts.tsx'

const ConnectedApps = ({
  initial,
}: Readonly<{ initial: SettingsIntegration2App[] }>) => {
  const [apps, setApps] = useState(initial)

  useEffect(() => setApps(initial), [initial])

  const setStatus = (
    appId: string,
    status: SettingsIntegration2App['status'],
  ) =>
    setApps((current) =>
      current.map((app) => (app.id === appId ? { ...app, status } : app)),
    )

  return (
    <SettingsIntegration2
      apps={apps}
      onConnect={(appId) => setStatus(appId, 'connected')}
      onDisconnect={(appId) => setStatus(appId, 'disconnected')}
    />
  )
}

const WorkspaceApps = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<SettingsIntegration2App[]>('/settings/connected-apps'),
    queryKey: ['settings', 'connected-apps'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsIntegration2
        {...settingsIntegration2ControlArgs}
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
  title: 'Blocks/Application/Settings/Integration/Settings2/Usages',
} satisfies Meta<typeof WorkspaceApps>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration2Handlers.apps)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Conectar Slack' }),
    )
    await expect(
      await canvas.findByRole('button', { name: 'Desconectar Slack' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration2Handlers.appsEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum aplicativo disponível'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration2Handlers.appsError)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar os aplicativos'),
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
    msw.use(settingsIntegration2Handlers.appsPending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando aplicativos',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
