'use client'

import { MenuItem, MenuSeparator } from '@tc96/ui/menu'
import type { ReactElement } from 'react'
import type { FlowPageLabels } from '../../shared/types'
import { flow2Labels } from './flow-2-labels'

export interface Flow2MenuProps {
  labels?: FlowPageLabels
  onClearResults?: () => void
  onCopyJson?: () => void
  onRestoreExample?: () => void
}

export function Flow2Menu({
  labels = flow2Labels,
  onClearResults,
  onCopyJson,
  onRestoreExample,
}: Readonly<Flow2MenuProps>): ReactElement {
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
