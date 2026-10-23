'use client'

import { Empty, EmptyDescription } from '@tc96/ui/empty'
import { ScrollArea } from '@tc96/ui/scroll-area'
import { Separator } from '@tc96/ui/separator'
import { cn } from '@tc96/utils'
import { type ReactElement, useId } from 'react'
import { FlowStepLibrarySkeleton } from '../../components/step-library-skeleton'
import { defaultFlowStepLibraryLabels } from '../../core'
import {
  flowStepLibraryClassName,
  flowStepLibraryFooterClassName,
  flowStepLibraryGroupsClassName,
  flowStepLibraryHeaderClassName,
} from '../../lib/variants'
import type { FlowStepLibraryProps } from '../../types'
import { FlowStepLibraryGroup } from '../step-library-group/step-library-group'

export function FlowStepLibrary({
  children,
  className,
  collapsed = false,
  disabled = false,
  groups,
  icons,
  labels,
  loading = false,
  onAdd,
}: Readonly<FlowStepLibraryProps>): ReactElement {
  const text = { ...defaultFlowStepLibraryLabels, ...labels }
  const titleId = useId()
  const hintId = useId()

  return (
    <section
      aria-busy={loading || undefined}
      aria-describedby={collapsed ? undefined : hintId}
      aria-labelledby={titleId}
      className={cn(flowStepLibraryClassName, className)}
      data-collapsed={collapsed || undefined}
      data-slot="flow-step-library"
    >
      <header className={flowStepLibraryHeaderClassName}>
        <h2
          className={cn('font-semibold text-sm', collapsed && 'sr-only')}
          id={titleId}
        >
          {text.title}
        </h2>
        {collapsed ? null : (
          <p className="text-muted-foreground text-xs" id={hintId}>
            {text.hint}
          </p>
        )}
      </header>
      <ScrollArea className="min-h-0 flex-1">
        {loading ? (
          <FlowStepLibrarySkeleton />
        ) : groups.length ? (
          <div
            className={flowStepLibraryGroupsClassName}
            data-slot="flow-step-library-groups"
          >
            {groups.map((group) => (
              <FlowStepLibraryGroup
                collapsed={collapsed}
                disabled={disabled}
                group={group}
                icons={icons}
                key={group.label}
                onAdd={onAdd}
              />
            ))}
          </div>
        ) : (
          <Empty className="py-8">
            <EmptyDescription>{text.empty}</EmptyDescription>
          </Empty>
        )}
      </ScrollArea>
      {children ? (
        <>
          <Separator />
          <div
            className={flowStepLibraryFooterClassName}
            data-slot="flow-step-library-footer"
          >
            {children}
          </div>
        </>
      ) : null}
    </section>
  )
}
