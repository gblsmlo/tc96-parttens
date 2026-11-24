'use client'

import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import { type ReactElement, type ReactNode, useId } from 'react'

export interface PropertyTooltipProps {
  content: ReactNode
  trigger: ReactElement
}

export function PropertyTooltip({
  content,
  trigger,
}: Readonly<PropertyTooltipProps>) {
  const descriptionId = useId()

  return (
    <Tooltip>
      <TooltipTrigger aria-describedby={descriptionId} render={trigger} />
      <span hidden id={descriptionId}>
        {content}
      </span>
      <TooltipPopup>{content}</TooltipPopup>
    </Tooltip>
  )
}
