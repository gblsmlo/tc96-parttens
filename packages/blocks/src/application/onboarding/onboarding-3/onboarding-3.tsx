'use client'

import { CheckCircleIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from '@tc96/ui/dialog'
import { IconFrame } from '@tc96/ui/icon-frame'
import { cn } from '@tc96/utils'
import { OnboardingActions } from '../shared/onboarding-actions'
import { OnboardingError } from '../shared/onboarding-error'
import { useOnboardingFlow } from '../shared/use-onboarding-flow'
import { defaultOnboarding3Labels } from './labels'
import type { Onboarding3Props } from './types'

export function Onboarding3({
  className,
  completed = false,
  error,
  labels: labelsProp,
  onComplete,
  onContinue,
  onFinish,
  onOpenChange,
  onSkip,
  onStepChange,
  open,
  pending = false,
  step,
  steps,
}: Readonly<Onboarding3Props>) {
  const labels = { ...defaultOnboarding3Labels, ...labelsProp }
  const flow = useOnboardingFlow({
    onComplete,
    onContinue,
    onStepChange,
    step,
    steps,
  })

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPopup
        className={className}
        closeProps={{ 'aria-label': labels.close }}
        data-slot="onboarding-3"
      >
        {completed ? (
          <>
            <DialogHeader className="items-center text-center">
              <IconFrame shape="rounded" size="xl">
                <CheckCircleIcon aria-hidden="true" />
              </IconFrame>
              <DialogTitle>{labels.successTitle}</DialogTitle>
              <DialogDescription>{labels.successDescription}</DialogDescription>
            </DialogHeader>
            <DialogFooter variant="bare">
              <Button onClick={onFinish} size="sm">
                {labels.start}
              </Button>
            </DialogFooter>
          </>
        ) : flow.current ? (
          <>
            <DialogHeader>
              <ol
                aria-label={labels.steps}
                className="m-0 flex list-none items-center gap-1.5 p-0"
                data-slot="onboarding-dots"
              >
                {steps.map((item, index) => (
                  <li
                    aria-current={index === flow.index ? 'step' : undefined}
                    className={cn(
                      'h-1.5 rounded-full bg-input transition-all',
                      index < flow.index && 'w-1.5 bg-primary',
                      index === flow.index && 'w-6 bg-primary',
                      index > flow.index && 'w-1.5',
                    )}
                    data-status={
                      index < flow.index
                        ? 'complete'
                        : index === flow.index
                          ? 'current'
                          : 'upcoming'
                    }
                    key={item.id}
                  >
                    <span className="sr-only">{item.title}</span>
                  </li>
                ))}
              </ol>
              <p className="text-muted-foreground text-xs">
                {labels.stepOf(flow.index + 1, flow.total)}
              </p>
              <DialogTitle>{flow.current.title}</DialogTitle>
              {flow.current.description ? (
                <DialogDescription>
                  {flow.current.description}
                </DialogDescription>
              ) : null}
            </DialogHeader>
            <DialogPanel className="grid gap-4">
              <div data-slot="onboarding-content">{flow.current.content}</div>
              <OnboardingError error={error} title={labels.errorTitle} />
            </DialogPanel>
            <DialogFooter variant="bare">
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
            </DialogFooter>
          </>
        ) : null}
      </DialogPopup>
    </Dialog>
  )
}
