'use client'

import { Card } from '@tc96/ui/card'
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@tc96/ui/collapsible'
import { cn } from '@tc96/utils'
import { ChevronDownIcon } from 'lucide-react'
import { type ReactElement, type ReactNode, useId, useState } from 'react'
import type { RecordGroupProps } from '../../core'
import {
  recordGroupClassName,
  recordGroupContentVariants,
  recordGroupHeaderClassName,
  recordGroupPanelClassName,
  recordGroupShellClassName,
  recordGroupTitleVariants,
  recordGroupTriggerVariants,
} from '../../lib/variants'

const chevronIcon = (
  <ChevronDownIcon
    aria-hidden="true"
    className="size-4 shrink-0 -rotate-90 transition-transform group-data-panel-open/trigger:rotate-0"
  />
)

export function RecordGroup({
  actions,
  actionsAlign = 'between',
  chevron = 'start',
  children,
  className,
  collapsible = true,
  defaultOpen = true,
  empty = false,
  footer,
  onOpenChange,
  open,
  title,
  variant = 'plain',
}: Readonly<RecordGroupProps>): ReactElement {
  const controlled = open !== undefined
  const titleId = `record-group-title-${useId()}`
  const [internalOpen, setInternalOpen] = useState(defaultOpen && !empty)
  const [wasEmpty, setWasEmpty] = useState(empty)
  if (wasEmpty !== empty) {
    setWasEmpty(empty)
    if (wasEmpty && !controlled) setInternalOpen(true)
  }

  const isOpen = controlled ? open : internalOpen

  const content = (
    <div
      className={recordGroupContentVariants({ empty, variant })}
      data-slot="record-group-content"
    >
      {children}
    </div>
  )

  const titleText = (
    <span className="min-w-0 break-words text-start">{title}</span>
  )

  const hasTitle = title !== undefined && title !== null && title !== ''
  const labelledBy = hasTitle ? titleId : undefined

  const header =
    hasTitle || actions ? (
      <div
        className={recordGroupHeaderClassName(variant, actionsAlign)}
        data-actions-align={actionsAlign}
        data-slot="record-group-header"
      >
        {hasTitle ? (
          <h2
            className={
              collapsible
                ? 'min-w-0 font-medium text-sm'
                : cn(
                    'font-medium text-sm',
                    recordGroupTitleVariants({ variant }),
                  )
            }
            id={titleId}
          >
            {collapsible ? (
              <CollapsibleTrigger
                className={recordGroupTriggerVariants({ variant })}
              >
                {chevron === 'start' ? chevronIcon : null}
                {titleText}
                {chevron === 'end' ? chevronIcon : null}
              </CollapsibleTrigger>
            ) : (
              titleText
            )}
          </h2>
        ) : null}
        {actions ? (
          <div
            className="flex shrink-0 items-center gap-1"
            data-slot="record-group-actions"
          >
            {actions}
          </div>
        ) : null}
      </div>
    ) : null

  const body = (
    <>
      {variant === 'inset' ? (
        <Card className={recordGroupShellClassName}>{content}</Card>
      ) : (
        content
      )}
      {footer ? (
        <div className="py-2" data-slot="record-group-footer">
          {footer}
        </div>
      ) : null}
    </>
  )

  const shell = (parts: ReactNode) =>
    variant === 'card' ? (
      <Card className={recordGroupShellClassName}>{parts}</Card>
    ) : (
      parts
    )

  if (!collapsible)
    return (
      <section
        aria-labelledby={labelledBy}
        className={recordGroupClassName(variant, className)}
        data-empty={empty ? 'true' : undefined}
        data-slot="record-group"
        data-variant={variant}
      >
        {shell(
          <>
            {header}
            <div className={recordGroupPanelClassName(variant)}>{body}</div>
          </>,
        )}
      </section>
    )

  return (
    <Collapsible
      aria-labelledby={labelledBy}
      className={recordGroupClassName(variant, className)}
      data-empty={empty ? 'true' : undefined}
      data-slot="record-group"
      data-variant={variant}
      onOpenChange={(next) => {
        if (!controlled) setInternalOpen(next)
        onOpenChange?.(next)
      }}
      open={isOpen}
      render={<section />}
    >
      {shell(
        <>
          {header}
          <CollapsiblePanel
            className={recordGroupPanelClassName(variant)}
            inert={!isOpen}
          >
            {body}
          </CollapsiblePanel>
        </>,
      )}
    </Collapsible>
  )
}
