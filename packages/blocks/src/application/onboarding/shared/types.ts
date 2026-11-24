import type { ReactNode } from 'react'

export interface OnboardingStep {
  content: ReactNode
  description?: string
  id: string
  title: string
}

export interface OnboardingBaseProps {
  className?: string
  completed?: boolean
  error?: string
  onComplete?: () => void
  onContinue?: (stepId: string) => boolean | undefined
  onFinish: () => void
  onSkip?: (stepId: string) => void
  onStepChange: (id: string) => void
  pending?: boolean
  step: string
  steps: OnboardingStep[]
}

export interface OnboardingBaseLabels {
  back: string
  errorTitle: string
  finish: string
  next: string
  skip: string
  start: string
  stepOf: (current: number, total: number) => string
  successDescription: string
  successTitle: string
}
