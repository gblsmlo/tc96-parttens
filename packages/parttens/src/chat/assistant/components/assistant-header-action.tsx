import { Button } from '@tc96/ui/button'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import type { ReactElement, ReactNode } from 'react'

interface AssistantHeaderActionProps {
  children: ReactNode
  label: string
  onClick: () => void
}

export function AssistantHeaderAction({
  children,
  label,
  onClick,
}: Readonly<AssistantHeaderActionProps>): ReactElement {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label={label}
            onClick={onClick}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            {children}
          </Button>
        }
      />
      <TooltipPopup>{label}</TooltipPopup>
    </Tooltip>
  )
}
