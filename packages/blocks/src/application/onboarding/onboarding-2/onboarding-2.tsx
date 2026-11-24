'use client'

import { Card, CardContent, CardDescription, CardHeader } from '@tc96/ui/card'
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
} from '@tc96/ui/progress'
import { cn } from '@tc96/utils'
import { OnboardingActions } from '../shared/onboarding-actions'
import { OnboardingError } from '../shared/onboarding-error'
import { OnboardingSuccess } from '../shared/onboarding-success'
import {
  useFocusOnChange,
  useOnboardingFlow,
} from '../shared/use-onboarding-flow'
import { defaultOnboarding2Labels } from './labels'
import type { Onboarding2Props } from './types'

export function Onboarding2({
  className,
  completed = false,
  error,
  labels: labelsProp,
  onComplete,
  onContinue,
  onFinish,
  onSkip,
  onStepChange,
  pending = false,
  step,
  steps,
}: Readonly<Onboarding2Props>) {
  const labels = { ...defaultOnboarding2Labels, ...labelsProp }
  const flow = useOnboardingFlow({
    onComplete,
    onContinue,
    onStepChange,
    step,
    steps,
  })
  const titleRef = useFocusOnChange<HTMLHeadingElement>(step)

  return (
    <section
      aria-label={labels.label}
      className={cn('mx-auto flex w-full max-w-lg flex-col gap-4', className)}
      data-slot="onboarding-2"
    >
      {completed ? (
        <Card>
          <CardContent>
            <OnboardingSuccess
              description={labels.successDescription}
              onFinish={onFinish}
              start={labels.start}
              title={labels.successTitle}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Progress max={flow.total} min={0} value={flow.index + 1}>
            <ProgressLabel>
              {labels.stepOf(flow.index + 1, flow.total)}
            </ProgressLabel>
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
          {flow.current ? (
            <Card>
              <CardHeader>
                <h2
                  className="font-heading font-semibold text-lg leading-none outline-none"
                  ref={titleRef}
                  tabIndex={-1}
                >
                  {flow.current.title}
                </h2>
                {flow.current.description ? (
                  <CardDescription>{flow.current.description}</CardDescription>
                ) : null}
              </CardHeader>
              <CardContent className="grid gap-4">
                <div data-slot="onboarding-content">{flow.current.content}</div>
                <OnboardingError error={error} title={labels.errorTitle} />
                <OnboardingActions
                  isFirst={flow.isFirst}
                  isLast={flow.isLast}
                  labels={labels}
                  onBack={flow.back}
                  onForward={flow.forward}
                  onSkip={onSkip ? () => onSkip(step) : undefined}
                  pending={pending}
                />
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </section>
  )
}
