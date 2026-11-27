import { Tasks6 } from '@tc96/ui/blocks/data/tasks/tasks-6'
import { useMemo, useState } from 'react'
import {
  tasksLabelsPtBR,
  tasksSavePreferencePtBR,
} from '../fixtures/tasks-labels.ts'
import {
  kinds,
  now,
  people,
  savedViews,
  tags,
  tasks,
} from '../fixtures/tasks-shared.ts'
import { type TasksStoryCallbacks, useTasksStory } from '../tasks-story.ts'
import type { Tasks6Controls } from './tasks-6-controls.ts'

export interface ComposedTasks6Props
  extends Tasks6Controls,
    TasksStoryCallbacks {
  error?: boolean
  onCreate?: () => void
  onSavedViewSelect?: (savedViewId: string | null) => void
  pending?: boolean
}

const noop = () => undefined

export const ComposedTasks6 = ({
  create,
  error = false,
  headerActions,
  onCreate,
  onSavedViewSelect,
  pending = false,
  title,
  ...controls
}: Readonly<ComposedTasks6Props>) => {
  const { matching, props } = useTasksStory({ ...controls, tasks })
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const labels = useMemo(
    () => ({
      ...tasksLabelsPtBR,
      create,
      savePreference: tasksSavePreferencePtBR,
      title,
    }),
    [create, title],
  )

  return (
    <Tasks6
      {...props}
      error={error}
      kinds={kinds}
      labels={labels}
      now={now}
      onCreate={headerActions ? (onCreate ?? noop) : undefined}
      onSavedViewSelect={(next) => {
        setSavedViewId(next)
        onSavedViewSelect?.(next)
      }}
      pending={pending}
      people={people}
      savedViewId={savedViewId}
      savedViews={savedViews}
      tags={tags}
      tasks={matching}
    />
  )
}
