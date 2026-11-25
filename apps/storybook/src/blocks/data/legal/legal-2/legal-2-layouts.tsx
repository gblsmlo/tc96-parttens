import {
  Legal2,
  type Legal2Contract,
  type Legal2Mode,
  type Legal2Props,
  type Legal2Status,
} from '@tc96/ui/blocks/data/legal/legal-2'
import { useEffect, useMemo, useState } from 'react'
import { contracts, owners } from '../fixtures/legal-2.ts'
import type { Legal2Controls } from './legal-2-controls.ts'

export interface ComposedLegal2Props extends Legal2Controls {
  onCreate?: Legal2Props['onCreate']
  onExport?: Legal2Props['onExport']
  onModeChange?: Legal2Props['onModeChange']
  onOpen?: Legal2Props['onOpen']
  onOwnerChange?: Legal2Props['onOwnerChange']
  onQueueChange?: Legal2Props['onQueueChange']
  onStatusChange?: Legal2Props['onStatusChange']
  onStatusFilterChange?: Legal2Props['onStatusFilterChange']
}

const noop = () => undefined

export const ComposedLegal2 = ({
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
}: Readonly<ComposedLegal2Props>) => {
  const [items, setItems] = useState<Legal2Contract[]>(contracts)
  const [mode, setMode] = useState<Legal2Mode>(modeControl)
  const [statusFilter, setStatusFilter] = useState<Legal2Status | null>(null)
  const labels = useMemo(() => ({ create, title }), [create, title])

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  const update = (id: string, change: Partial<Legal2Contract>) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...change } : item)),
    )

  return (
    <Legal2
      contracts={empty ? [] : items}
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
