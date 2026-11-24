import type { OnboardingBaseLabels, OnboardingBaseProps } from '../shared/types'

export type { OnboardingStep } from '../shared/types'

export interface Onboarding3Labels extends OnboardingBaseLabels {
  close: string
  steps: string
}

export interface Onboarding3Props extends OnboardingBaseProps {
  labels?: Partial<Onboarding3Labels>
  onOpenChange: (open: boolean) => void
  open: boolean
}
