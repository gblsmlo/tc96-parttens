import type * as React from 'react'

import { Button, type ButtonProps } from '@tc96/ui/compat/collection-views/button'
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from '@tc96/ui/tooltip'

export interface DetailSheetActionProps
  extends Omit<ButtonProps, 'aria-label' | 'children' | 'render' | 'size'> {
  children: React.ReactNode
  label: string
}

export function DetailSheetAction({
  children,
  label,
  variant = 'ghost',
  ...props
}: Readonly<DetailSheetActionProps>): React.ReactElement {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            {...props}
            aria-label={label}
            size="icon-sm"
            variant={variant}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipPopup>{label}</TooltipPopup>
    </Tooltip>
  )
}
