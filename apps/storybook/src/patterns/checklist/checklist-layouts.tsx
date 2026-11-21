import {
  Checklist,
  type ChecklistItem,
  type ChecklistProps,
} from '@tc96/parttens'
import { useState } from 'react'
import type { ChecklistControls } from './checklist-controls.ts'
import { authorOptions, sampleItems } from './checklist-data.ts'

type ConsumerHandledProps =
  | 'items'
  | 'newItemTitle'
  | 'onCreate'
  | 'onItemAuthorChange'
  | 'onItemCompletionChange'
  | 'onItemDelete'
  | 'onItemDueDateChange'
  | 'onItemMove'
  | 'onItemRename'
  | 'onNewItemTitleChange'

interface StatefulChecklistProps
  extends Omit<ChecklistProps, ConsumerHandledProps> {
  deletable?: boolean
  initialItems: readonly ChecklistItem[]
}

const moveItem = (
  items: readonly ChecklistItem[],
  id: string,
  targetIndex: number,
) => {
  const moving = items.find((item) => item.id === id)
  if (!moving) return items
  const rest = items.filter((item) => item.id !== id)
  return [...rest.slice(0, targetIndex), moving, ...rest.slice(targetIndex)]
}

export const StatefulChecklist = ({
  deletable = true,
  initialItems,
  ...props
}: Readonly<StatefulChecklistProps>) => {
  const [items, setItems] = useState(initialItems)
  const [newItemTitle, setNewItemTitle] = useState('')
  const update = (id: string, change: Partial<ChecklistItem>) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...change } : item)),
    )

  return (
    <Checklist
      {...props}
      items={items}
      newItemTitle={newItemTitle}
      onCreate={(title, completed) => {
        setItems((current) => [
          ...current,
          { completed, id: `item-${current.length + 1}`, title },
        ])
        setNewItemTitle('')
      }}
      onItemAuthorChange={(id, authorId) => update(id, { authorId })}
      onItemCompletionChange={(id, completed) => update(id, { completed })}
      onItemDelete={
        deletable
          ? (id) =>
              setItems((current) => current.filter((item) => item.id !== id))
          : undefined
      }
      onItemDueDateChange={(id, dueDate) => update(id, { dueDate })}
      onItemMove={(id, targetIndex) =>
        setItems((current) => moveItem(current, id, targetIndex))
      }
      onItemRename={(id, title) => update(id, { title })}
      onNewItemTitleChange={setNewItemTitle}
    />
  )
}

const openItem = () => undefined

export const ComposedChecklist = ({
  author,
  creating,
  deleteButton,
  density,
  dueDate,
  empty,
  feedback,
  openable,
  progress,
  readOnly,
  title,
  variant,
}: Readonly<ChecklistControls>) => (
  <StatefulChecklist
    ariaLabel={title || 'Etapas'}
    authorOptions={authorOptions}
    creating={creating}
    deletable={deleteButton}
    density={density}
    feedback={
      feedback ? (
        <p className="text-muted-foreground text-sm">{feedback}</p>
      ) : undefined
    }
    initialItems={empty ? [] : sampleItems({ author, dueDate })}
    key={[author, dueDate, empty].join()}
    onItemClick={openable ? openItem : undefined}
    progress={progress}
    readOnly={readOnly}
    title={title || null}
    variant={variant}
  />
)
