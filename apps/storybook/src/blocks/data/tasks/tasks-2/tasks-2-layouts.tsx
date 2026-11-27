import { Tasks2 } from '@tc96/ui/blocks/data/tasks/tasks-2'
import { useMemo } from 'react'
import {
  createOptions,
  kinds,
  now,
  people,
  tags,
  tasks,
} from '../fixtures/tasks-2.ts'
import { tasksLabelsPtBR, tasksSearchPtBR } from '../fixtures/tasks-labels.ts'
import { type TasksStoryCallbacks, useTasksStory } from '../tasks-story.ts'
import type { Tasks2Controls } from './tasks-2-controls.ts'

export interface ComposedTasks2Props
  extends Tasks2Controls,
    TasksStoryCallbacks {
  error?: boolean
  onCreate?: (optionId?: string) => void
  pending?: boolean
}

const noop = () => undefined

export const ComposedTasks2 = ({
  create,
  createMenu,
  error = false,
  headerActions,
  onCreate,
  pending = false,
  title,
  ...controls
}: Readonly<ComposedTasks2Props>) => {
  const { matching, props } = useTasksStory({
    ...controls,
    searchable: headerActions,
    tasks,
  })
  const labels = useMemo(
    () => ({ ...tasksLabelsPtBR, create, search: tasksSearchPtBR, title }),
    [create, title],
  )

  return (
    <Tasks2
      {...props}
      createOptions={createMenu ? createOptions : undefined}
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
