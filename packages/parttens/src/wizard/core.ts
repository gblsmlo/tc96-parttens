import type { ButtonProps } from '@tc96/ui/button'
import type { ComponentProps, ReactNode } from 'react'

export const wizardStepStatuses = ['complete', 'current', 'upcoming'] as const

export type WizardStepStatus = (typeof wizardStepStatuses)[number]

export interface WizardStep {
  description?: ReactNode
  disabled?: boolean
  icon?: ReactNode
  title: ReactNode
  value: string
}

export interface WizardProps {
  children?: ReactNode
  className?: string
  label: string
  onValueChange: (value: string) => void
  steps: readonly WizardStep[]
  value: string
}

export type WizardFooterProps = ComponentProps<'div'>

export type WizardPreviousProps = ButtonProps

export type WizardNextProps = ButtonProps

export function wizardStepStatus(
  steps: readonly WizardStep[],
  value: string,
  stepValue: string,
): WizardStepStatus {
  const current = steps.findIndex((step) => step.value === value)
  const index = steps.findIndex((step) => step.value === stepValue)
  if (index < 0 || current < 0 || index > current) return 'upcoming'
  return index === current ? 'current' : 'complete'
}

export function adjacentWizardStep(
  steps: readonly WizardStep[],
  value: string,
  offset: -1 | 1,
): WizardStep | undefined {
  const current = steps.findIndex((step) => step.value === value)
  if (current < 0) return undefined
  return steps[current + offset]
}
