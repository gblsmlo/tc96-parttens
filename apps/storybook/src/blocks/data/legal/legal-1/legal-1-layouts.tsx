import {
  Legal1,
  type Legal1Case,
  type Legal1Mode,
  type Legal1Props,
  type Legal1Status,
  type Legal1View,
} from '@tc96/ui/blocks/data/legal/legal-1'
import { useEffect, useMemo, useState } from 'react'
import { cases, owners } from '../fixtures/legal-1.ts'
import type { Legal1Controls } from './legal-1-controls.ts'

export interface ComposedLegal1Props extends Legal1Controls {
  onCreate?: Legal1Props['onCreate']
  onExport?: Legal1Props['onExport']
  onModeChange?: Legal1Props['onModeChange']
  onOpen?: Legal1Props['onOpen']
  onOwnerChange?: Legal1Props['onOwnerChange']
  onPhaseChange?: Legal1Props['onPhaseChange']
  onQueueChange?: Legal1Props['onQueueChange']
  onStatusChange?: Legal1Props['onStatusChange']
  onStatusFilterChange?: Legal1Props['onStatusFilterChange']
  onViewChange?: Legal1Props['onViewChange']
}

const noop = () => undefined

export const ComposedLegal1 = ({
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
  onPhaseChange,
  onQueueChange,
  onStatusChange,
  onStatusFilterChange,
  onViewChange,
  openable,
  title,
}: Readonly<ComposedLegal1Props>) => {
  const [items, setItems] = useState<Legal1Case[]>(cases)
  const [mode, setMode] = useState<Legal1Mode>(modeControl)
  const [statusFilter, setStatusFilter] = useState<Legal1Status | null>(null)
  const [view, setView] = useState<Legal1View>('all')
  const labels = useMemo(() => ({ create, title }), [create, title])

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  const update = (id: string, change: Partial<Legal1Case>) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...change } : item)),
    )

  return (
    <Legal1
      cases={empty ? [] : items}
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
      onPhaseChange={
        editable
          ? (id, phase) => {
              update(id, { phase })
              onPhaseChange?.(id, phase)
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
      onViewChange={(next) => {
        setView(next)
        onViewChange?.(next)
      }}
      owners={owners}
      statusFilter={statusFilter}
      view={view}
    />
  )
}
