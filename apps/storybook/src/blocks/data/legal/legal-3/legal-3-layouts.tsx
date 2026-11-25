import {
  Legal3,
  type Legal3Deadline,
  type Legal3Mode,
  type Legal3Props,
  type Legal3Status,
} from '@tc96/ui/blocks/data/legal/legal-3'
import { useEffect, useMemo, useState } from 'react'
import {
  calendarAnchor,
  calendarNow,
  deadlines,
  owners,
} from '../fixtures/legal-3.ts'
import type { Legal3Controls } from './legal-3-controls.ts'

export interface ComposedLegal3Props extends Legal3Controls {
  onCreate?: Legal3Props['onCreate']
  onExport?: Legal3Props['onExport']
  onModeChange?: Legal3Props['onModeChange']
  onOpen?: Legal3Props['onOpen']
  onOwnerChange?: Legal3Props['onOwnerChange']
  onQueueChange?: Legal3Props['onQueueChange']
  onStatusChange?: Legal3Props['onStatusChange']
  onStatusFilterChange?: Legal3Props['onStatusFilterChange']
}

const noop = () => undefined

export const ComposedLegal3 = ({
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
}: Readonly<ComposedLegal3Props>) => {
  const [items, setItems] = useState<Legal3Deadline[]>(deadlines)
  const [mode, setMode] = useState<Legal3Mode>(modeControl)
  const [statusFilter, setStatusFilter] = useState<Legal3Status | null>(null)
  const labels = useMemo(() => ({ create, title }), [create, title])

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  const update = (id: string, change: Partial<Legal3Deadline>) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...change } : item)),
    )

  return (
    <Legal3
      anchor={calendarAnchor}
      now={calendarNow}
      deadlines={empty ? [] : items}
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
