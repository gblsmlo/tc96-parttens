'use client'

import type { FlowConnection } from '@tc96/parttens/flow/canvas/core'
import type { ReactElement } from 'react'
import { FlowConfirmDialog } from './flow-confirm-dialog'
import type { FlowPageLabels } from './types'

export interface FlowDeleteDialogProps {
  connections: readonly FlowConnection[]
  labels: FlowPageLabels
  onDelete: (stepId: string) => void
  onPendingDeleteChange: (stepId: string | null) => void
  pendingDelete: string | null
  stepName: string
}

export function FlowDeleteDialog({
  connections,
  labels,
  onDelete,
  onPendingDeleteChange,
  pendingDelete,
  stepName,
}: Readonly<FlowDeleteDialogProps>): ReactElement {
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
        if (!open) onPendingDeleteChange(null)
      }}
      open={pendingDelete !== null}
      title={labels.deleteDialogTitle(stepName)}
    />
  )
}
