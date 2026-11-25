import { DataCollectionKanbanCard } from '../../shared/collection/data-collection-record-parts'
import {
  Projects3DueField,
  type Projects3FieldContext,
  Projects3PriorityField,
  Projects3TagsField,
} from './projects-3-fields'
import type { Projects3Task } from './types'

export const renderProjects3KanbanCard =
  (context: Projects3FieldContext) => (task: Projects3Task) => {
    const { labels, onDueChange, onOpen, onPriorityChange, onTagsChange } =
      context
    return (
      <DataCollectionKanbanCard
        caption={task.description ? [task.description] : []}
        fields={[
          {
            id: 'due',
            interactive: Boolean(onDueChange),
            label: labels.columns.due,
            value: (
              <Projects3DueField
                context={context}
                item={task}
                variant="plain"
              />
            ),
          },
          {
            id: 'priority',
            interactive: Boolean(onPriorityChange),
            label: labels.columns.priority,
            value: (
              <Projects3PriorityField
                context={context}
                item={task}
                variant="plain"
              />
            ),
          },
          {
            id: 'tags',
            interactive: Boolean(onTagsChange),
            label: labels.columns.tags,
            value: (
              <Projects3TagsField
                context={context}
                item={task}
                variant="plain"
              />
            ),
          },
        ]}
        onOpen={onOpen ? () => onOpen(task.id) : undefined}
        openLabel={labels.openTask(task.title)}
        title={task.title}
      />
    )
  }
