import { Button, type ButtonProps } from '@tc96/ui/button'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import type { ReactElement } from 'react'

export interface FlowControlButtonProps
  extends Omit<ButtonProps, 'aria-label' | 'render'> {
  label: string
  tooltip?: string
}

export function FlowControlButton({
  children,
  label,
  tooltip = label,
  ...props
}: Readonly<FlowControlButtonProps>): ReactElement {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button aria-label={label} {...props}>
            {children}
          </Button>
        }
      />
      <TooltipPopup>{tooltip}</TooltipPopup>
    </Tooltip>
  )
}
