import {
  SettingsIntegration1,
  type SettingsIntegration1Props,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-1'
import { useState } from 'react'
import { endpoints as fixture } from '../../fixtures/settings-integration-1.ts'
import type { SettingsIntegration1Controls } from './settings-integration-1-controls.ts'

interface ComposedSettingsIntegration1Props
  extends SettingsIntegration1Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onCreate?: SettingsIntegration1Props['onCreate']
  onEnabledChange?: SettingsIntegration1Props['onEnabledChange']
  onEndpointAction?: SettingsIntegration1Props['onEndpointAction']
}

const ignore = () => undefined

export const ComposedSettingsIntegration1 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  failing,
  newEndpoint,
  onCreate = ignore,
  onEnabledChange = ignore,
  onEndpointAction = ignore,
  title,
  withActions,
}: Readonly<ComposedSettingsIntegration1Props>) => {
  const [endpoints, setEndpoints] = useState(fixture)
  const visible = endpoints.map((endpoint) => ({
    ...endpoint,
    failing: failing && endpoint.failing,
  }))

  return (
    <SettingsIntegration1
      error={error}
      onRetry={onRetry}
      pending={pending}
      endpoints={empty ? [] : visible}
      labels={{ description, newEndpoint, title }}
      onCreate={withActions ? onCreate : undefined}
      onEnabledChange={(id, enabled) => {
        setEndpoints((current) =>
          current.map((endpoint) =>
            endpoint.id === id ? { ...endpoint, enabled } : endpoint,
          ),
        )
        onEnabledChange(id, enabled)
      }}
      onEndpointAction={withActions ? onEndpointAction : undefined}
    />
  )
}
