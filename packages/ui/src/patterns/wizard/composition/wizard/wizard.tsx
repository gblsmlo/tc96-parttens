'use client'

import { Card } from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import { type ReactElement, useEffect, useId, useMemo, useRef } from 'react'
import { WizardStepItem } from '../../components/wizard-step-item'
import {
  adjacentWizardStep,
  type WizardProps,
  wizardStepStatus,
} from '../../core'
import {
  wizardClassName,
  wizardNavClassName,
  wizardPanelCardClassName,
  wizardPanelClassName,
  wizardShellClassName,
  wizardStepListClassName,
} from '../../lib/variants'
import {
  WizardContext,
  type WizardContextValue,
} from '../../store/wizard-context'

export function Wizard({
  children,
  className,
  label,
  onValueChange,
  steps,
  value,
}: Readonly<WizardProps>): ReactElement {
  const id = useId()
  const panelRef = useRef<HTMLElement>(null)
  const focusPanelOn = useRef<string | undefined>(undefined)
  const renderedValue = useRef(value)
  const currentIndex = steps.findIndex((step) => step.value === value)
  const titleId = (index: number) => `wizard-${id}-step-${index}-title`

  useEffect(() => {
    if (renderedValue.current === value) return
    renderedValue.current = value
    const moved = focusPanelOn.current === value
    focusPanelOn.current = undefined
    const focusLost =
      !document.activeElement || document.activeElement === document.body
    if (moved || focusLost) panelRef.current?.focus()
  }, [value])

  const context = useMemo<WizardContextValue>(() => {
    const previous = adjacentWizardStep(steps, value, -1)
    const next = adjacentWizardStep(steps, value, 1)

    return {
      move: (offset) => {
        const target = offset < 0 ? previous : next
        if (!target) return
        focusPanelOn.current = target.value
        onValueChange(target.value)
      },
      next,
      previous,
    }
  }, [onValueChange, steps, value])

  const select = (stepValue: string) => {
    if (stepValue !== value) onValueChange(stepValue)
  }

  return (
    <WizardContext.Provider value={context}>
      <div className={cn(wizardClassName, className)} data-slot="wizard">
        <Card className={wizardShellClassName}>
          <nav
            aria-label={label}
            className={wizardNavClassName}
            data-slot="wizard-nav"
          >
            <ol className={wizardStepListClassName}>
              {steps.map((step, index) => (
                <WizardStepItem
                  key={step.value}
                  number={index + 1}
                  onSelect={select}
                  status={wizardStepStatus(steps, value, step.value)}
                  step={step}
                  titleId={titleId(index)}
                />
              ))}
            </ol>
          </nav>
          <Card className={wizardPanelCardClassName}>
            <section
              aria-labelledby={
                currentIndex >= 0 ? titleId(currentIndex) : undefined
              }
              className={wizardPanelClassName}
              data-slot="wizard-panel"
              ref={panelRef}
              tabIndex={-1}
            >
              {children}
            </section>
          </Card>
        </Card>
      </div>
    </WizardContext.Provider>
  )
}
