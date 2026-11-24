import {
  Dashboard3,
  type Dashboard3Props,
} from '@tc96/blocks/application/dashboard/dashboard-3'
import { useState } from 'react'
import { crew, forecast, queue } from '../fixtures/dashboard-3.ts'
import type { Dashboard3Controls } from './dashboard-3-controls.ts'

interface ComposedDashboard3Props extends Dashboard3Controls {
  onAction?: Dashboard3Props['onAction']
  onRetry?: Dashboard3Props['onRetry']
}

export const ComposedDashboard3 = ({
  actions,
  empty,
  error,
  onAction,
  onRetry,
  pending,
  title,
}: Readonly<ComposedDashboard3Props>) => {
  const [done, setDone] = useState<string[]>([])

  return (
    <Dashboard3
      crew={empty ? [] : crew}
      error={error}
      forecast={empty ? [] : forecast}
      labels={{ title }}
      onAction={
        actions
          ? (id) => {
              setDone((current) => [...current, id])
              onAction?.(id)
            }
          : undefined
      }
      onRetry={onRetry}
      pending={pending}
      queue={empty ? [] : queue.filter((item) => !done.includes(item.id))}
    />
  )
}
