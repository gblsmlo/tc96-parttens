import { Tasks1 } from '@tc96/ui/blocks/data/tasks/tasks-1'
import { useMemo, useState } from 'react'
import { kinds, pageSize, people, tags, tasks } from '../fixtures/tasks-1.ts'
import {
  tasksLabelsPtBR,
  tasksSavePreferencePtBR,
  tasksSearchPtBR,
} from '../fixtures/tasks-labels.ts'
import { type TasksStoryCallbacks, useTasksStory } from '../tasks-story.ts'
import type { Tasks1Controls } from './tasks-1-controls.ts'

export interface ComposedTasks1Props
  extends Tasks1Controls,
    TasksStoryCallbacks {
  onCreate?: () => void
  onPageChange?: (page: number) => void
}

const noop = () => undefined

export const ComposedTasks1 = ({
  bulkActions,
  create,
  headerActions,
  onCollapsedGroupIdsChange,
  onCreate,
  onPageChange,
  paginated,
  title,
  ...controls
}: Readonly<ComposedTasks1Props>) => {
  const [page, setPage] = useState(1)
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<string[]>([])
  const { matching, props } = useTasksStory({
    ...controls,
    bulk: bulkActions,
    initialSort: 'updated',
    onQueryChange: () => setPage(1),
    searchable: headerActions,
    tasks,
  })
  const labels = useMemo(
    () => ({
      ...tasksLabelsPtBR,
      create,
      pagination: 'Paginação de tarefas',
      pageRange: (first: number, last: number, total: number) =>
        total === 0 ? '0 de 0' : `${first}–${last} de ${total}`,
      paginationButtons: {
        first: 'Primeira página',
        last: 'Última página',
        next: 'Próxima página',
        previous: 'Página anterior',
      },
      savePreference: tasksSavePreferencePtBR,
      search: tasksSearchPtBR,
      tagPicker: {
        count: (count: number) => (count === 1 ? '1 tag' : `${count} tags`),
      },
      title,
    }),
    [create, title],
  )
  const visible = paginated
    ? matching.slice((page - 1) * pageSize, page * pageSize)
    : matching

  return (
    <Tasks1
      {...props}
      collapsedGroupIds={collapsedGroupIds}
      kinds={kinds}
      labels={labels}
      onCollapsedGroupIdsChange={(next) => {
        setCollapsedGroupIds(next)
        onCollapsedGroupIdsChange?.(next)
      }}
      onCreate={headerActions ? (onCreate ?? noop) : undefined}
      onGroupByChange={(next) => {
        setCollapsedGroupIds([])
        props.onGroupByChange(next)
      }}
      onPageChange={(next) => {
        setPage(next)
        onPageChange?.(next)
      }}
      onSelectedIdsChange={bulkActions ? props.onSelectedIdsChange : undefined}
      page={paginated ? page : undefined}
      pageCount={
        paginated
          ? Math.max(1, Math.ceil(matching.length / pageSize))
          : undefined
      }
      pageSize={paginated ? pageSize : undefined}
      people={people}
      selectedIds={bulkActions ? props.selectedIds : undefined}
      tags={tags}
      tasks={visible}
      total={paginated ? matching.length : undefined}
    />
  )
}
