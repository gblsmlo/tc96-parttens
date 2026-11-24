import type { OnboardingBaseLabels, OnboardingBaseProps } from '../shared/types'

export type { OnboardingStep } from '../shared/types'

export interface Onboarding2Labels extends OnboardingBaseLabels {
  label: string
}

export interface Onboarding2Props extends OnboardingBaseProps {
  labels?: Partial<Onboarding2Labels>
}
