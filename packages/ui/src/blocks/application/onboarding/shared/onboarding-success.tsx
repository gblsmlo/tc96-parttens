'use client'

import { CheckCircleIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
import { cn } from '@tc96/utils'
import { useEffect, useRef } from 'react'

interface OnboardingSuccessProps {
  className?: string
  description: string
  onFinish: () => void
  start: string
  title: string
}

export function OnboardingSuccess({
  className,
  description,
  onFinish,
  start,
  title,
}: Readonly<OnboardingSuccessProps>) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 py-6 text-center',
        className,
      )}
      data-slot="onboarding-success"
    >
      <IconFrame shape="rounded" size="xl">
        <CheckCircleIcon aria-hidden="true" />
      </IconFrame>
      <div className="grid gap-1">
        <h2
          className="font-heading font-semibold text-xl outline-none"
          ref={titleRef}
          tabIndex={-1}
        >
          {title}
        </h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Button onClick={onFinish} size="sm">
        {start}
      </Button>
    </div>
  )
}
