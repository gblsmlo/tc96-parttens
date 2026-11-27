import { Tasks5 } from '@tc96/ui/blocks/data/tasks/tasks-5'
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
import type { Tasks5Controls } from './tasks-5-controls.ts'

export interface ComposedTasks5Props
  extends Tasks5Controls,
    TasksStoryCallbacks {
  error?: boolean
  onCreate?: () => void
  onSavedViewSelect?: (savedViewId: string | null) => void
  pending?: boolean
}

const noop = () => undefined

export const ComposedTasks5 = ({
  create,
  error = false,
  headerActions,
  onCreate,
  onSavedViewSelect,
  pending = false,
  title,
  ...controls
}: Readonly<ComposedTasks5Props>) => {
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
    <Tasks5
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
