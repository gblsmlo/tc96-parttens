import { EmptyState5 } from '@tc96/blocks/application/empty-state/empty-state-5'
import { useState } from 'react'
import { connectors } from '../fixtures/empty-state-5.ts'
import type { EmptyState5Controls } from './empty-state-5-controls.ts'

export const ComposedEmptyState5 = ({
  connect,
  title,
}: Readonly<EmptyState5Controls>) => {
  const [connected, setConnected] = useState<readonly string[]>([])

  return (
    <EmptyState5
      connectors={connectors.map((connector) => ({
        ...connector,
        connected: connector.connected || connected.includes(connector.id),
      }))}
      labels={{ title }}
      onConnect={
        connect
          ? (id) => setConnected((current) => [...current, id])
          : undefined
      }
    />
  )
}
