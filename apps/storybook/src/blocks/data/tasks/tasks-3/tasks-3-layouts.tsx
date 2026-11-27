import { Tasks3 } from '@tc96/ui/blocks/data/tasks/tasks-3'
import { useMemo } from 'react'
import { tasksLabelsPtBR } from '../fixtures/tasks-labels.ts'
import { kinds, now, people, tags, tasks } from '../fixtures/tasks-shared.ts'
import { type TasksStoryCallbacks, useTasksStory } from '../tasks-story.ts'
import type { Tasks3Controls } from './tasks-3-controls.ts'

export interface ComposedTasks3Props
  extends Tasks3Controls,
    TasksStoryCallbacks {
  error?: boolean
  onCreate?: () => void
  pending?: boolean
}

const noop = () => undefined

export const ComposedTasks3 = ({
  create,
  error = false,
  headerActions,
  onCreate,
  pending = false,
  title,
  ...controls
}: Readonly<ComposedTasks3Props>) => {
  const { matching, props } = useTasksStory({ ...controls, tasks })
  const labels = useMemo(
    () => ({
      ...tasksLabelsPtBR,
      create,
      description:
        'Acompanhe prazos, prioridades e responsáveis de cada tarefa.',
      title,
    }),
    [create, title],
  )

  return (
    <Tasks3
      {...props}
      error={error}
      kinds={kinds}
      labels={labels}
      now={now}
      onCreate={headerActions ? (onCreate ?? noop) : undefined}
      pending={pending}
      people={people}
      tags={tags}
      tasks={matching}
    />
  )
}
