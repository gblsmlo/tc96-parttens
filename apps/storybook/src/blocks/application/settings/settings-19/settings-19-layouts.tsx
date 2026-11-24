import {
  Settings19,
  type Settings19Props,
} from '@tc96/blocks/application/settings/settings-19'
import { useState } from 'react'
import { endpoints as fixture } from '../fixtures/settings-19.ts'
import type { Settings19Controls } from './settings-19-controls.ts'

interface ComposedSettings19Props extends Settings19Controls {
  onCreate?: Settings19Props['onCreate']
  onEnabledChange?: Settings19Props['onEnabledChange']
  onEndpointAction?: Settings19Props['onEndpointAction']
}

const ignore = () => undefined

export const ComposedSettings19 = ({
  description,
  empty,
  failing,
  newEndpoint,
  onCreate = ignore,
  onEnabledChange = ignore,
  onEndpointAction = ignore,
  title,
  withActions,
}: Readonly<ComposedSettings19Props>) => {
  const [endpoints, setEndpoints] = useState(fixture)
  const visible = endpoints.map((endpoint) => ({
    ...endpoint,
    failing: failing && endpoint.failing,
  }))

  return (
    <Settings19
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
