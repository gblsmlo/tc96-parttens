import type { OnboardingBaseLabels, OnboardingBaseProps } from '../shared/types'

export type { OnboardingStep } from '../shared/types'

export interface Onboarding1Labels extends OnboardingBaseLabels {
  label: string
  steps: string
}

export interface Onboarding1Props extends OnboardingBaseProps {
  labels?: Partial<Onboarding1Labels>
}
