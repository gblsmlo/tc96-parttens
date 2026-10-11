'use client'

import { Button } from '@tc96/ui/button'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import type * as React from 'react'
import type { RecordPreviewActionProps } from '../../core'

export function RecordPreviewAction({
  children,
  disabled,
  label,
  onClick,
}: Readonly<RecordPreviewActionProps>): React.ReactElement {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            size="icon-sm"
            variant="ghost"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipPopup>{label}</TooltipPopup>
    </Tooltip>
  )
}
