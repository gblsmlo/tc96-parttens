'use client'

import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { WizardFooterProps } from '../../core'
import { wizardFooterClassName } from '../../lib/variants'

export function WizardFooter({
  className,
  ...props
}: Readonly<WizardFooterProps>): ReactElement {
  return (
    <div
      className={cn(wizardFooterClassName, className)}
      data-slot="wizard-footer"
      {...props}
    />
  )
}
