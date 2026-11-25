import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsIntegration6,
  type SettingsIntegration6App,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-6'
import { useEffect, useState } from 'react'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsIntegration6Handlers } from '../../../../../mocks/settings-integration-6.ts'
import { settingsIntegration6ControlArgs } from './settings-integration-6-controls.ts'
import { ComposedSettingsIntegration6 } from './settings-integration-6-layouts.tsx'

const IntegrationGallery = ({
  initial,
}: Readonly<{ initial: SettingsIntegration6App[] }>) => {
  const [apps, setApps] = useState(initial)

  useEffect(() => setApps(initial), [initial])

  const patch = (appId: string, change: Partial<SettingsIntegration6App>) =>
    setApps((current) =>
      current.map((app) => (app.id === appId ? { ...app, ...change } : app)),
    )

  return (
    <SettingsIntegration6
      apps={apps}
      onConnect={(appId) => patch(appId, { connected: true, enabled: true })}
      onDisconnect={(appId) =>
        patch(appId, { connected: false, enabled: false })
      }
      onEnabledChange={(appId, enabled) => patch(appId, { enabled })}
    />
  )
}

const WorkspaceGallery = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<SettingsIntegration6App[]>('/settings/integration-gallery'),
    queryKey: ['settings', 'integration-gallery'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsIntegration6
        {...settingsIntegration6ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <IntegrationGallery initial={data} />
}

const meta = {
  component: WorkspaceGallery,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Integration/Settings6/Usages',
} satisfies Meta<typeof WorkspaceGallery>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration6Handlers.apps)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration6Handlers.appsEmpty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration6Handlers.appsError)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration6Handlers.appsPending)
  },
}
