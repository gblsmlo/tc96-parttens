import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar6 } from '@tc96/ui/blocks/application/navbar/navbar-6'
import { useState } from 'react'
import {
  breadcrumb,
  filterOptions,
  people,
  sortOptions,
} from '../fixtures/navbar-6.ts'
import { boardMenu } from './navbar-6-layouts.tsx'

interface Task {
  deadline: number
  id: string
  late: boolean
  mine: boolean
  name: string
  open: boolean
}

const tasks: Task[] = [
  {
    deadline: 3,
    id: 't1',
    late: false,
    mine: true,
    name: 'Revisar o checkout',
    open: true,
  },
  {
    deadline: 1,
    id: 't2',
    late: true,
    mine: false,
    name: 'Corrigir o frete',
    open: true,
  },
  {
    deadline: 5,
    id: 't3',
    late: false,
    mine: true,
    name: 'Publicar a vitrine',
    open: false,
  },
  {
    deadline: 2,
    id: 't4',
    late: true,
    mine: true,
    name: 'Atualizar o catálogo',
    open: true,
  },
]

const TeamBoard = () => {
  const [filters, setFilters] = useState<string[]>([])
  const [sort, setSort] = useState('recent')
  const [invited, setInvited] = useState(false)

  const visible = [...tasks]
    .filter((task) =>
      filters.every((id) => task[id as 'late' | 'mine' | 'open']),
    )
    .sort((a, b) =>
      sort === 'name'
        ? a.name.localeCompare(b.name)
        : sort === 'deadline'
          ? a.deadline - b.deadline
          : a.id.localeCompare(b.id),
    )

  return (
    <div className="min-h-80">
      <Navbar6
        breadcrumb={breadcrumb}
        filterOptions={filterOptions}
        filters={filters}
        menu={boardMenu}
        onFiltersChange={setFilters}
        onInvite={() => setInvited(true)}
        onSortChange={setSort}
        people={people}
        sort={sort}
        sortOptions={sortOptions}
      />
      <main className="grid gap-3 p-6 text-sm">
        {invited ? (
          <p className="text-muted-foreground">Convite enviado à equipe.</p>
        ) : null}
        <ul aria-label="Tarefas" className="grid gap-2">
          {visible.map((task) => (
            <li key={task.id}>{task.name}</li>
          ))}
        </ul>
      </main>
    </div>
  )
}

const meta = {
  component: TeamBoard,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar6/Usages',
} satisfies Meta<typeof TeamBoard>

export default meta

type Story = StoryObj<typeof meta>

export const FilteringTheBoard: Story = {}

export const SortingByName: Story = {}

export const InvitingTheTeam: Story = {}
