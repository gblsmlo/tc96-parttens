import { AssignedProperty, AssignedPropertyBadge } from '@tc96/ui/patterns'
import { useState } from 'react'
import {
  type AssignedControls,
  type Assignee,
  assignees,
} from './assigned-controls'

function StatefulAssigned({
  value: initialValue,
  ...args
}: Readonly<AssignedControls>) {
  const [value, setValue] = useState(initialValue)

  return (
    <AssignedProperty
      {...args}
      onValueChange={setValue}
      options={assignees}
      value={value}
    />
  )
}

export function ComposedAssigned(args: Readonly<AssignedControls>) {
  return <StatefulAssigned key={String(args.value)} {...args} />
}

export function TaskOwnerRow() {
  const [owner, setOwner] = useState<Assignee | null>('gabriel')

  return (
    <div className="flex max-w-md items-center justify-between gap-4 rounded-md border p-3">
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium text-sm">
          Renovar o contrato da Acme
        </span>
        <span className="text-muted-foreground text-xs">Vence em 28/08</span>
      </div>
      <AssignedProperty
        ariaLabel="Responsável"
        dropdownPlacement={{ align: 'end', side: 'bottom', sideOffset: 8 }}
        onValueChange={setOwner}
        options={assignees}
        placeholder="Atribuir"
        value={owner}
      />
    </div>
  )
}

const tasks: readonly { assignee: Assignee | null; title: string }[] = [
  { assignee: 'ana', title: 'Conferir notas fiscais de agosto' },
  { assignee: 'marina', title: 'Enviar proposta para a Northwind' },
  { assignee: null, title: 'Revisar a política de reembolso' },
]

export function TeamTaskList() {
  return (
    <ul aria-label="Tarefas da equipe" className="flex max-w-md flex-col">
      {tasks.map((task) => (
        <li
          className="flex items-center justify-between gap-4 border-b py-2 last:border-b-0"
          key={task.title}
        >
          <span className="truncate text-sm">{task.title}</span>
          <AssignedPropertyBadge
            placeholder="Sem responsável"
            option={
              assignees.find((option) => option.value === task.assignee) ?? null
            }
          />
        </li>
      ))}
    </ul>
  )
}
