'use client'

import { formatAmount } from '@tc96/helpers/format'
import { Badge } from '@tc96/ui/badge'
import { CardPanel } from '@tc96/ui/card'
import { Checkbox } from '@tc96/ui/checkbox'
import { Meter, MeterIndicator, MeterTrack, MeterValue } from '@tc96/ui/meter'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import { AvatarStack, type AvatarStackPerson } from '../shared/avatar-stack'
import { CardWidgetShell } from '../shared/card-widget-shell'
import {
  ExpandableList,
  type WidgetExpandProps,
} from '../shared/expandable-list'
import { WidgetHeader } from '../shared/widget-header'

export interface ProjectSubtask {
  done: boolean
  id: string
  label: string
}

export interface ProjectTag {
  id: string
  label: ReactNode
}

export interface ProjectCardWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  description?: ReactNode
  endLabel?: ReactNode
  expand?: WidgetExpandProps
  footer?: ReactNode
  locale?: string
  meta?: ReactNode
  onSubtaskToggle?: (id: string, done: boolean) => void
  people?: readonly AvatarStackPerson[]
  peopleLabel?: string
  progress?: number
  progressLabel?: ReactNode
  startLabel?: ReactNode
  subtasks?: readonly ProjectSubtask[]
  subtasksLabel?: string
  tags?: readonly ProjectTag[]
  title: ReactNode
}

export function ProjectCardWidget({
  action,
  className,
  description,
  endLabel,
  expand,
  footer,
  locale,
  meta,
  onSubtaskToggle,
  people,
  peopleLabel,
  progress,
  progressLabel = 'Progresso',
  startLabel,
  subtasks,
  subtasksLabel = 'Subtarefas',
  tags,
  title,
  ...props
}: Readonly<ProjectCardWidgetProps>): ReactElement {
  const titleId = useId()
  const done = subtasks?.filter((subtask) => subtask.done).length ?? 0
  const total = subtasks?.length ?? 0
  const ratio = progress ?? (total ? done / total : 0)
  const value = Math.round(Math.min(1, Math.max(0, ratio)) * 100)

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="project-card"
      {...props}
    >
      <WidgetHeader action={action} title={title} titleId={titleId} />
      <CardPanel className="grid gap-5 px-5 pb-5">
        {tags?.length || description ? (
          <div className="grid gap-3">
            {tags?.length ? (
              <ul
                className="flex flex-wrap gap-1.5"
                data-slot="project-card-tags"
              >
                {tags.map((tag) => (
                  <li key={tag.id}>
                    <Badge variant="outline">{tag.label}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
            {description ? (
              <p className="text-muted-foreground text-sm">{description}</p>
            ) : null}
          </div>
        ) : null}
        {subtasks?.length ? (
          <ExpandableList items={subtasks} {...expand}>
            {(shown) => (
              <ul
                aria-label={subtasksLabel}
                className="grid gap-2.5"
                data-slot="project-card-subtasks"
              >
                {shown.map((subtask) => {
                  const subtaskId = `${titleId}-${subtask.id}`
                  return (
                    <li className="flex items-center gap-2.5" key={subtask.id}>
                      <Checkbox
                        checked={subtask.done}
                        id={subtaskId}
                        {...(onSubtaskToggle
                          ? {
                              onCheckedChange: (checked: boolean) =>
                                onSubtaskToggle(subtask.id, checked),
                            }
                          : { readOnly: true })}
                      />
                      <label
                        className={cn(
                          'text-sm',
                          subtask.done && 'text-muted-foreground line-through',
                        )}
                        htmlFor={subtaskId}
                      >
                        {subtask.label}
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </ExpandableList>
        ) : null}
        <Meter
          aria-label={
            typeof progressLabel === 'string' ? progressLabel : undefined
          }
          data-slot="project-card-progress"
          max={100}
          min={0}
          value={value}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-sm">
              {progressLabel}
            </span>
            <MeterValue className="font-medium">
              {() =>
                formatAmount(value / 100, {
                  maximumFractionDigits: 0,
                  style: 'percent',
                  ...(locale ? { locale } : {}),
                })
              }
            </MeterValue>
          </div>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
          {startLabel || endLabel ? (
            <div className="flex justify-between gap-3 text-muted-foreground text-xs">
              <span>{startLabel}</span>
              <span>{endLabel}</span>
            </div>
          ) : null}
        </Meter>
        {people?.length || meta || footer ? (
          <div className="flex items-center justify-between gap-3">
            {people?.length ? (
              <AvatarStack
                people={people}
                {...(peopleLabel ? { 'aria-label': peopleLabel } : {})}
              />
            ) : (
              <span />
            )}
            {meta ? (
              <div
                className="flex items-center gap-3 text-muted-foreground text-sm tabular-nums"
                data-slot="project-card-meta"
              >
                {meta}
              </div>
            ) : null}
          </div>
        ) : null}
        {footer}
      </CardPanel>
    </CardWidgetShell>
  )
}
