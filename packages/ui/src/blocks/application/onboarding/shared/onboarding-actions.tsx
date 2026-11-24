import { Button } from '@tc96/ui/button'
import { cn } from '@tc96/utils'
import type { OnboardingBaseLabels } from './types'

interface OnboardingActionsProps {
  className?: string
  isFirst: boolean
  isLast: boolean
  labels: Pick<OnboardingBaseLabels, 'back' | 'finish' | 'next' | 'skip'>
  onBack: () => void
  onForward: () => void
  onSkip?: () => void
  pending: boolean
}

export function OnboardingActions({
  className,
  isFirst,
  isLast,
  labels,
  onBack,
  onForward,
  onSkip,
  pending,
}: Readonly<OnboardingActionsProps>) {
  return (
    <div
      className={cn('flex items-center justify-between gap-2', className)}
      data-slot="onboarding-actions"
    >
      <Button
        disabled={isFirst || pending}
        onClick={onBack}
        size="sm"
        variant="outline"
      >
        {labels.back}
      </Button>
      <div className="flex items-center gap-2">
        {onSkip ? (
          <Button disabled={pending} onClick={onSkip} size="sm" variant="ghost">
            {labels.skip}
          </Button>
        ) : null}
        <Button loading={pending} onClick={onForward} size="sm">
          {isLast ? labels.finish : labels.next}
        </Button>
      </div>
    </div>
  )
}
