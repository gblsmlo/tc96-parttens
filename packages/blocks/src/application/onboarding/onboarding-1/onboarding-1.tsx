'use client'

import { Wizard } from '@tc96/parttens/wizard/composition/wizard/wizard'
import { WizardFooter } from '@tc96/parttens/wizard/composition/wizard-footer/wizard-footer'
import { cn } from '@tc96/utils'
import { OnboardingActions } from '../shared/onboarding-actions'
import { OnboardingError } from '../shared/onboarding-error'
import { OnboardingSuccess } from '../shared/onboarding-success'
import {
  useFocusOnChange,
  useOnboardingFlow,
} from '../shared/use-onboarding-flow'
import { defaultOnboarding1Labels } from './labels'
import type { Onboarding1Props } from './types'

export function Onboarding1({
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
}: Readonly<Onboarding1Props>) {
  const labels = { ...defaultOnboarding1Labels, ...labelsProp }
  const flow = useOnboardingFlow({
    onComplete,
    onContinue,
    onStepChange,
    step,
    steps,
  })
  const headingRef = useFocusOnChange<HTMLHeadingElement>(step)

  if (completed)
    return (
      <section
        aria-label={labels.label}
        className={cn('min-w-0', className)}
        data-slot="onboarding-1"
      >
        <OnboardingSuccess
          description={labels.successDescription}
          onFinish={onFinish}
          start={labels.start}
          title={labels.successTitle}
        />
      </section>
    )

  return (
    <section
      aria-label={labels.label}
      className={cn('min-w-0', className)}
      data-slot="onboarding-1"
    >
      <Wizard
        label={labels.steps}
        onValueChange={onStepChange}
        steps={steps.map((item, index) => ({
          description: item.description,
          disabled: index > flow.index,
          title: item.title,
          value: item.id,
        }))}
        value={step}
      >
        {flow.current ? (
          <>
            <header className="grid gap-1">
              <p className="text-muted-foreground text-xs">
                {labels.stepOf(flow.index + 1, flow.total)}
              </p>
              <h2
                className="font-heading font-semibold text-xl outline-none"
                ref={headingRef}
                tabIndex={-1}
              >
                {flow.current.title}
              </h2>
              {flow.current.description ? (
                <p className="text-muted-foreground text-sm">
                  {flow.current.description}
                </p>
              ) : null}
            </header>
            <div data-slot="onboarding-content">{flow.current.content}</div>
            <OnboardingError error={error} title={labels.errorTitle} />
            <WizardFooter>
              <OnboardingActions
                className="w-full"
                isFirst={flow.isFirst}
                isLast={flow.isLast}
                labels={labels}
                onBack={flow.back}
                onForward={flow.forward}
                onSkip={onSkip ? () => onSkip(step) : undefined}
                pending={pending}
              />
            </WizardFooter>
          </>
        ) : null}
      </Wizard>
    </section>
  )
}
