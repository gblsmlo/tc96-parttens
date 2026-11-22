import { Button, type ButtonProps } from '@tc96/ui/button'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import type { ReactElement } from 'react'

export interface FlowToolButtonProps
  extends Omit<ButtonProps, 'aria-label' | 'render'> {
  label: string
}

export function FlowToolButton({
  children,
  label,
  ...props
}: Readonly<FlowToolButtonProps>): ReactElement {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label={label}
            size="icon-sm"
            variant="outline"
            {...props}
          >
            {children}
          </Button>
        }
      />
      <TooltipPopup>{label}</TooltipPopup>
    </Tooltip>
  )
}
