'use client'

import { IconFrame } from '@tc96/elements/icon-frame'
import { CheckIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import type { WizardStep, WizardStepStatus } from '../core'
import {
  wizardStepIndicatorVariants,
  wizardStepTriggerClassName,
} from '../lib/variants'

export interface WizardStepItemProps {
  number: number
  onSelect: (value: string) => void
  status: WizardStepStatus
  step: WizardStep
  titleId: string
}

export function WizardStepItem({
  number,
  onSelect,
  status,
  step,
  titleId,
}: Readonly<WizardStepItemProps>): ReactElement {
  const fallbackIcon = status === 'complete' ? <CheckIcon /> : number

  return (
    <li data-slot="wizard-step" data-status={status}>
      <button
        aria-current={status === 'current' ? 'step' : undefined}
        className={wizardStepTriggerClassName}
        data-slot="wizard-step-trigger"
        disabled={step.disabled}
        onClick={() => onSelect(step.value)}
        type="button"
      >
        <IconFrame
          className={wizardStepIndicatorVariants({ status })}
          data-slot="wizard-step-indicator"
        >
          {step.icon ?? fallbackIcon}
        </IconFrame>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span
            className="font-medium text-sm"
            data-slot="wizard-step-title"
            id={titleId}
          >
            {step.title}
          </span>
          {step.description ? (
            <span
              className="text-muted-foreground text-xs"
              data-slot="wizard-step-description"
            >
              {step.description}
            </span>
          ) : null}
        </span>
      </button>
    </li>
  )
}
