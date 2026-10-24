'use client'

import { MenuItem, MenuSeparator } from '@tc96/ui/menu'
import type { ReactElement } from 'react'
import type { FlowPageLabels } from '../../shared/types'
import { agentBuilderLabels } from './agent-builder-labels'

export interface AgentBuilderMenuProps {
  labels?: FlowPageLabels
  onClearResults?: () => void
  onCopyJson?: () => void
  onRestoreExample?: () => void
}

export function AgentBuilderMenu({
  labels = agentBuilderLabels,
  onClearResults,
  onCopyJson,
  onRestoreExample,
}: Readonly<AgentBuilderMenuProps>): ReactElement {
  return (
    <>
      {onClearResults ? (
        <MenuItem onClick={onClearResults}>{labels.clearResults}</MenuItem>
      ) : null}
      {onRestoreExample ? (
        <MenuItem onClick={onRestoreExample}>{labels.restoreExample}</MenuItem>
      ) : null}
      {onCopyJson ? (
        <>
          {onClearResults || onRestoreExample ? <MenuSeparator /> : null}
          <MenuItem onClick={onCopyJson}>{labels.copyJson}</MenuItem>
        </>
      ) : null}
    </>
  )
}
