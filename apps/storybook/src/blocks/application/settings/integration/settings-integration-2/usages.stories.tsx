import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsIntegration2,
  type SettingsIntegration2App,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-2'
import { useEffect, useState } from 'react'
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
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration2Handlers.appsEmpty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration2Handlers.appsError)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration2Handlers.appsPending)
  },
}
