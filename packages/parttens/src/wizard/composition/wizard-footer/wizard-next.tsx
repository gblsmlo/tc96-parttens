'use client'

import { Button } from '@tc96/ui/button'
import type { ReactElement } from 'react'
import type { WizardNextProps } from '../../core'
import { useWizardContext } from '../../store/wizard-context'

export function WizardNext({
  disabled,
  onClick,
  ...props
}: Readonly<WizardNextProps>): ReactElement {
  const { move, next } = useWizardContext('WizardNext')

  return (
    <Button
      data-slot="wizard-next"
      disabled={disabled || !next}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) move(1)
      }}
      {...props}
    />
  )
}
