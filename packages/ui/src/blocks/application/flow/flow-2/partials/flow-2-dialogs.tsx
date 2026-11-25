'use client'

import type { FlowConnection } from '@tc96/ui/patterns/flow/canvas/core'
import type { ReactElement } from 'react'
import { FlowConfirmDialog } from '../../shared/flow-confirm-dialog'
import { FlowDeleteDialog } from '../../shared/flow-delete-dialog'
import type { FlowPageLabels } from '../../shared/types'
import { flow2Labels } from './flow-2-labels'

export interface Flow2DialogsProps {
  clearOpen?: boolean
  connections: readonly FlowConnection[]
  labels?: FlowPageLabels
  onClearOpenChange?: (open: boolean) => void
  onClearResults?: () => void
  onDelete: (stepId: string) => void
  onPendingDeleteChange?: (stepId: string | null) => void
  pendingDelete?: string | null
  pendingDeleteName?: string
}

export function Flow2Dialogs({
  clearOpen = false,
  connections,
  labels = flow2Labels,
  onClearOpenChange,
  onClearResults,
  onDelete,
  onPendingDeleteChange,
  pendingDelete = null,
  pendingDeleteName = '',
}: Readonly<Flow2DialogsProps>): ReactElement {
  return (
    <>
      <FlowConfirmDialog
        cancelLabel={labels.cancel}
        confirmLabel={labels.clearResults}
        description={labels.clearDialogDescription}
        onConfirm={() => onClearResults?.()}
        onOpenChange={(open) => onClearOpenChange?.(open)}
        open={clearOpen}
        title={labels.clearDialogTitle}
      />
      <FlowDeleteDialog
        connections={connections}
        labels={labels}
        onDelete={onDelete}
        onPendingDeleteChange={(stepId) => onPendingDeleteChange?.(stepId)}
        pendingDelete={pendingDelete}
        stepName={pendingDeleteName}
      />
    </>
  )
}
