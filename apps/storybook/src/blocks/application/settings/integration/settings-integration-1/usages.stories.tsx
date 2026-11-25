import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsIntegration1,
  type SettingsIntegration1Endpoint,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-1'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsIntegration1Handlers } from '../../../../../mocks/settings-integration-1.ts'
import { settingsIntegration1ControlArgs } from './settings-integration-1-controls.ts'
import { ComposedSettingsIntegration1 } from './settings-integration-1-layouts.tsx'

const EndpointList = ({
  initial,
}: Readonly<{ initial: SettingsIntegration1Endpoint[] }>) => {
  const [endpoints, setEndpoints] = useState(initial)

  return (
    <SettingsIntegration1
      endpoints={endpoints}
      onCreate={fn()}
      onEnabledChange={(id, enabled) =>
        setEndpoints((current) =>
          current.map((endpoint) =>
            endpoint.id === id ? { ...endpoint, enabled } : endpoint,
          ),
        )
      }
      onEndpointAction={fn()}
    />
  )
}

const WorkspaceWebhooks = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<SettingsIntegration1Endpoint[]>('/settings/webhooks'),
    queryKey: ['settings', 'webhooks'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsIntegration1
        {...settingsIntegration1ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <EndpointList initial={data} />
}

const meta = {
  component: WorkspaceWebhooks,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Integration/Settings1/Usages',
} satisfies Meta<typeof WorkspaceWebhooks>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration1Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration1Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration1Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration1Handlers.pending)
  },
}
