'use client'

import { Button } from '@tc96/ui/button'
import type { ReactElement } from 'react'
import type { WizardPreviousProps } from '../../core'
import { useWizardContext } from '../../store/wizard-context'

export function WizardPrevious({
  disabled,
  onClick,
  variant = 'secondary',
  ...props
}: Readonly<WizardPreviousProps>): ReactElement {
  const { move, previous } = useWizardContext('WizardPrevious')

  return (
    <Button
      data-slot="wizard-previous"
      disabled={disabled || !previous}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) move(-1)
      }}
      variant={variant}
      {...props}
    />
  )
}
