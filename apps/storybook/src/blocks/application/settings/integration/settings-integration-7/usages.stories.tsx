import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsIntegration7,
  type SettingsIntegration7App,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-7'
import { useEffect, useState } from 'react'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsIntegration7Handlers } from '../../../../../mocks/settings-integration-7.ts'
import { settingsIntegration7ControlArgs } from './settings-integration-7-controls.ts'
import { ComposedSettingsIntegration7 } from './settings-integration-7-layouts.tsx'

const Connectors = ({
  initial,
}: Readonly<{ initial: SettingsIntegration7App[] }>) => {
  const [apps, setApps] = useState(initial)

  useEffect(() => setApps(initial), [initial])

  const install = (appId: string) =>
    setApps((current) =>
      current.map((app) =>
        app.id === appId
          ? { ...app, actionLabel: 'Configurar', status: 'connected' }
          : app,
      ),
    )

  return <SettingsIntegration7 apps={apps} onAction={install} />
}

const WorkspaceConnectors = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsIntegration7App[]>('/settings/connectors'),
    queryKey: ['settings', 'connectors'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsIntegration7
        {...settingsIntegration7ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <Connectors initial={data} />
}

const meta = {
  component: WorkspaceConnectors,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Integration/Settings7/Usages',
} satisfies Meta<typeof WorkspaceConnectors>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration7Handlers.apps)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration7Handlers.appsEmpty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration7Handlers.appsError)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration7Handlers.appsPending)
  },
}
