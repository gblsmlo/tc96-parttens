'use client'

import { Button } from '@tc96/ui/button'
import { ToolbarButton } from '@tc96/ui/toolbar'
import type { ReactElement } from 'react'

export interface ActionProps {
  className?: string
  disabled?: boolean
  label?: string
  onClick: () => void
}

export function Action({
  className,
  disabled = false,
  label = 'Adicionar',
  onClick,
}: Readonly<ActionProps>): ReactElement {
  return (
    <ToolbarButton
      disabled={disabled}
      onClick={onClick}
      render={
        <Button
          className={className}
          disabled={disabled}
          type="button"
          variant="default"
        />
      }
    >
      {label}
    </ToolbarButton>
  )
}
