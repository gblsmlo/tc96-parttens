import {
  Legal4,
  type Legal4Client,
  type Legal4Mode,
  type Legal4Props,
  type Legal4Status,
} from '@tc96/ui/blocks/data/legal/legal-4'
import { useEffect, useMemo, useState } from 'react'
import { clients, owners } from '../fixtures/legal-4.ts'
import type { Legal4Controls } from './legal-4-controls.ts'

export interface ComposedLegal4Props extends Legal4Controls {
  onCreate?: Legal4Props['onCreate']
  onExport?: Legal4Props['onExport']
  onModeChange?: Legal4Props['onModeChange']
  onOpen?: Legal4Props['onOpen']
  onOwnerChange?: Legal4Props['onOwnerChange']
  onQueueChange?: Legal4Props['onQueueChange']
  onStatusChange?: Legal4Props['onStatusChange']
  onStatusFilterChange?: Legal4Props['onStatusFilterChange']
}

const noop = () => undefined

export const ComposedLegal4 = ({
  create,
  editable,
  empty,
  headerActions,
  mode: modeControl,
  onCreate,
  onExport,
  onModeChange,
  onOpen,
  onOwnerChange,
  onQueueChange,
  onStatusChange,
  onStatusFilterChange,
  openable,
  title,
}: Readonly<ComposedLegal4Props>) => {
  const [items, setItems] = useState<Legal4Client[]>(clients)
  const [mode, setMode] = useState<Legal4Mode>(modeControl)
  const [statusFilter, setStatusFilter] = useState<Legal4Status | null>(null)
  const labels = useMemo(() => ({ create, title }), [create, title])

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  const update = (id: string, change: Partial<Legal4Client>) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...change } : item)),
    )

  return (
    <Legal4
      clients={empty ? [] : items}
      labels={labels}
      mode={mode}
      onCreate={headerActions ? (onCreate ?? noop) : undefined}
      onExport={headerActions ? (onExport ?? noop) : undefined}
      onModeChange={(next) => {
        setMode(next)
        onModeChange?.(next)
      }}
      onOpen={openable ? (onOpen ?? noop) : undefined}
      onOwnerChange={
        editable
          ? (id, ownerId) => {
              update(id, { ownerId })
              onOwnerChange?.(id, ownerId)
            }
          : undefined
      }
      onQueueChange={
        editable
          ? (id, queue) => {
              update(id, { queue })
              onQueueChange?.(id, queue)
            }
          : undefined
      }
      onStatusChange={
        editable
          ? (id, status) => {
              update(id, { status })
              onStatusChange?.(id, status)
            }
          : undefined
      }
      onStatusFilterChange={(next) => {
        setStatusFilter(next)
        onStatusFilterChange?.(next)
      }}
      owners={owners}
      statusFilter={statusFilter}
    />
  )
}
