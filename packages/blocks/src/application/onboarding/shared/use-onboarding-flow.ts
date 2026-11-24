'use client'

import { useEffect, useRef } from 'react'
import type { OnboardingBaseProps, OnboardingStep } from './types'

type FlowProps = Pick<
  OnboardingBaseProps,
  'onComplete' | 'onContinue' | 'onStepChange' | 'step' | 'steps'
>

export interface OnboardingFlow {
  back: () => void
  current: OnboardingStep | undefined
  forward: () => void
  index: number
  isFirst: boolean
  isLast: boolean
  total: number
}

export function useOnboardingFlow({
  onComplete,
  onContinue,
  onStepChange,
  step,
  steps,
}: Readonly<FlowProps>): OnboardingFlow {
  const index = steps.findIndex((item) => item.id === step)
  const isFirst = index <= 0
  const isLast = index === steps.length - 1

  return {
    back: () => {
      const previous = steps[index - 1]
      if (previous) onStepChange(previous.id)
    },
    current: steps[index],
    forward: () => {
      if (index < 0 || onContinue?.(step) === false) return
      const next = steps[index + 1]
      if (next) onStepChange(next.id)
      else onComplete?.()
    },
    index,
    isFirst,
    isLast,
    total: steps.length,
  }
}

export function useFocusOnChange<T extends HTMLElement>(key: string) {
  const ref = useRef<T>(null)
  const rendered = useRef(key)

  useEffect(() => {
    if (rendered.current === key) return
    rendered.current = key
    ref.current?.focus()
  }, [key])

  return ref
}
