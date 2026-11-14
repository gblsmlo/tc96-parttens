import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import { skeletonKeys } from '../../../shared/lib/skeleton-keys'
import {
  KanbanCard,
  KanbanCardAction,
  KanbanCardBody,
  KanbanCardDescription,
  KanbanCardField,
  KanbanCardFooter,
  KanbanCardHeader,
  type KanbanCardProps,
  KanbanCardTitle,
} from './kanban-card'

export interface KanbanCardSkeletonAnatomy {
  assignee?: boolean
  counts?: number
  descriptionLines?: number
  fields?: number
  menu?: boolean
}

export interface KanbanCardSkeletonProps
  extends KanbanCardSkeletonAnatomy,
    Omit<
      KanbanCardProps,
      'aria-busy' | 'aria-label' | 'children' | 'role' | 'title'
    > {
  label?: string
}

const descriptionWidths = ['w-full', 'w-4/5', 'w-2/3'] as const
const valueWidths = ['w-20', 'w-16', 'w-24'] as const

export function KanbanCardSkeleton({
  assignee = true,
  className,
  counts = 1,
  descriptionLines = 2,
  display = 'full',
  fields = 0,
  label = 'Carregando card',
  menu = false,
  ...props
}: KanbanCardSkeletonProps): ReactElement {
  // `article` não pode ser `status`: um `output`, que já é status, envolve
  // o card sem caixa própria, e o card fica oculto da tecnologia assistiva.
  return (
    <output
      aria-busy="true"
      aria-label={label}
      className="contents"
      data-counts={counts}
      data-description-lines={descriptionLines}
      data-fields={fields}
    >
      <KanbanCard
        {...props}
        aria-hidden="true"
        className={cn('pointer-events-none select-none', className)}
        display={display}
      >
        <KanbanCardHeader aria-hidden="true">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <KanbanCardTitle className="min-w-0 flex-1">
              <Skeleton className="my-0.5 h-4 w-2/3" />
            </KanbanCardTitle>
            {display === 'compact' && assignee ? (
              <Skeleton className="size-6 shrink-0 rounded-full" />
            ) : null}
          </div>
          {descriptionLines > 0 ? (
            <KanbanCardDescription className="flex flex-col">
              {skeletonKeys('description', descriptionLines).map(
                (key, position) => (
                  <Skeleton
                    className={cn(
                      'my-1 h-3',
                      descriptionWidths[position % descriptionWidths.length],
                    )}
                    key={key}
                  />
                ),
              )}
            </KanbanCardDescription>
          ) : null}
          {menu ? (
            <KanbanCardAction>
              <Skeleton className="size-7 rounded-md" />
            </KanbanCardAction>
          ) : null}
        </KanbanCardHeader>
        {fields > 0 ? (
          <KanbanCardBody aria-hidden="true">
            {skeletonKeys('field', fields).map((key, position) => (
              <KanbanCardField key={key}>
                <Skeleton className="my-0.75 h-3.5 w-14" />
                <Skeleton
                  className={cn(
                    'my-0.75 h-3.5',
                    valueWidths[position % valueWidths.length],
                  )}
                />
              </KanbanCardField>
            ))}
          </KanbanCardBody>
        ) : null}
        {counts > 0 || assignee ? (
          <KanbanCardFooter aria-hidden="true">
            <div className="flex min-w-0 flex-1 items-center gap-1">
              {skeletonKeys('count', counts).map((key) => (
                <Skeleton className="h-7 w-10 rounded-md sm:h-6" key={key} />
              ))}
            </div>
            {assignee ? (
              <Skeleton className="ml-auto size-6 shrink-0 rounded-full" />
            ) : null}
          </KanbanCardFooter>
        ) : null}
      </KanbanCard>
    </output>
  )
}
