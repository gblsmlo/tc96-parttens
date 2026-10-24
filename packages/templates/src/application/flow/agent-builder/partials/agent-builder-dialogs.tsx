'use client'

import type { FlowConnection } from '@tc96/parttens/flow/canvas/core'
import type { ReactElement } from 'react'
import { FlowConfirmDialog } from '../../shared/flow-confirm-dialog'
import { FlowDeleteDialog } from '../../shared/flow-delete-dialog'
import type { FlowPageLabels } from '../../shared/types'
import { agentBuilderLabels } from './agent-builder-labels'

export interface AgentBuilderDialogsProps {
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

export function AgentBuilderDialogs({
  clearOpen = false,
  connections,
  labels = agentBuilderLabels,
  onClearOpenChange,
  onClearResults,
  onDelete,
  onPendingDeleteChange,
  pendingDelete = null,
  pendingDeleteName = '',
}: Readonly<AgentBuilderDialogsProps>): ReactElement {
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
