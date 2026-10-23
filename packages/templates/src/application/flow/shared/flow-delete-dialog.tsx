'use client'

import type { FlowConnection } from '@tc96/parttens/flow/canvas/core'
import type { ReactElement } from 'react'
import { FlowConfirmDialog } from './flow-confirm-dialog'
import type { FlowPageLabels } from './types'
import type { FlowPageState } from './use-flow-page-state'

export interface FlowDeleteDialogProps {
  connections: readonly FlowConnection[]
  labels: FlowPageLabels
  onDelete: (stepId: string) => void
  stepName: string
  state: FlowPageState
}

export function FlowDeleteDialog({
  connections,
  labels,
  onDelete,
  stepName,
  state,
}: Readonly<FlowDeleteDialogProps>): ReactElement {
  const { pendingDelete, setPendingDelete } = state
  return (
    <FlowConfirmDialog
      cancelLabel={labels.cancel}
      confirmLabel={labels.deleteConfirm}
      description={labels.deleteDialogDescription(
        stepName,
        connections.filter(
          (connection) =>
            connection.source === pendingDelete ||
            connection.target === pendingDelete,
        ).length,
      )}
      onConfirm={() => {
        if (pendingDelete) onDelete(pendingDelete)
      }}
      onOpenChange={(open) => {
        if (!open) setPendingDelete(null)
      }}
      open={pendingDelete !== null}
      title={labels.deleteDialogTitle(stepName)}
    />
  )
}
