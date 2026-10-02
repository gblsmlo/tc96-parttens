import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DataGridPagination,
  DataTable,
  type DataTableColumnDef,
  SelectProperty,
  type SelectPropertyOption,
  useDataTable,
} from '@tc96/parttens'
import { Checkbox } from '@tc96/ui/checkbox'
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleXIcon,
  ClockIcon,
} from 'lucide-react'
import { type ReactElement, useMemo, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { booleanArgType } from '../../../test-utils/story-arg-types'

interface Project {
  budget: number
  id: string
  project: string
  status: 'Paid' | 'Unpaid' | 'Pending' | 'Failed'
  team: string
}

const projects: Project[] = [
  {
    budget: 12500,
    id: '1',
    project: 'Website Redesign',
    status: 'Paid',
    team: 'Frontend Team',
  },
  {
    budget: 8750,
    id: '2',
    project: 'Mobile App',
    status: 'Unpaid',
    team: 'Mobile Team',
  },
  {
    budget: 5200,
    id: '3',
    project: 'API Integration',
    status: 'Pending',
    team: 'Backend Team',
  },
  {
    budget: 3800,
    id: '4',
    project: 'Database Migration',
    status: 'Paid',
    team: 'DevOps Team',
  },
  {
    budget: 7200,
    id: '5',
    project: 'User Dashboard',
    status: 'Paid',
    team: 'UX Team',
  },
  {
    budget: 2100,
    id: '6',
    project: 'Security Audit',
    status: 'Failed',
    team: 'Security Team',
  },
]

const statusOptions: readonly SelectPropertyOption[] = [
  { icon: CircleCheckIcon, label: 'Paid', tone: 'success', value: 'Paid' },
  { icon: CircleDashedIcon, label: 'Unpaid', tone: 'neutral', value: 'Unpaid' },
  { icon: ClockIcon, label: 'Pending', tone: 'warning', value: 'Pending' },
  { icon: CircleXIcon, label: 'Failed', tone: 'danger', value: 'Failed' },
]

const isStatus = (value: string): value is Project['status'] =>
  statusOptions.some((option) => option.value === value)

const currency = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
})

/**
 * O status é uma propriedade de catálogo fechado: o `SelectProperty` abre o
 * select e avisa a troca, e quem escreve na coleção é o consumer.
 */
const createColumns = (
  onStatusChange: (id: string, status: Project['status']) => void,
): DataTableColumnDef<Project>[] => [
  {
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
      />
    ),
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(Boolean(value))
        }
      />
    ),
    id: 'select',
  },
  {
    accessorKey: 'project',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.project}</div>
    ),
    footer: 'Total Budget',
    header: 'Project',
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => (
      <SelectProperty
        ariaLabel="Status"
        onValueChange={(value) => {
          if (value && isStatus(value)) onStatusChange(row.id, value)
        }}
        options={statusOptions}
        value={row.original.status}
      />
    ),
    header: 'Status',
  },
  {
    accessorKey: 'team',
    header: 'Team',
  },
  {
    accessorKey: 'budget',
    cell: ({ row }) => (
      <div className="text-right">{currency.format(row.original.budget)}</div>
    ),
    footer: ({ table }) => (
      <div className="text-right">
        {currency.format(
          table
            .getCoreRowModel()
            .rows.reduce((sum, row) => sum + row.original.budget, 0),
        )}
      </div>
    ),
    header: () => <div className="text-right">Budget</div>,
  },
]

interface DataTableExampleProps {
  /** Coleção exibida. Passe uma lista vazia para ver a mensagem de vazio. */
  data?: Project[]
  /** Troca as linhas por esqueletos de carregamento. */
  isLoading?: boolean
  /** Pagina no cliente e compõe o rodapé de paginação abaixo da tabela. */
  paginated?: boolean
}

/**
 * Compõe `useDataTable` e `DataTable` do jeito que um consumidor compõe: o
 * hook monta a tabela, a view desenha. Sem `CardFrame` — a tabela fica solta.
 */
function DataTableExample({
  data = projects,
  isLoading = false,
  paginated = false,
}: Readonly<DataTableExampleProps>): ReactElement {
  const [rows, setRows] = useState(data)
  const columns = useMemo(
    () =>
      createColumns((id, status) =>
        setRows((current) =>
          current.map((project) =>
            project.id === id ? { ...project, status } : project,
          ),
        ),
      ),
    [],
  )
  const { table } = useDataTable<Project>({
    columns,
    data: rows,
    enablePagination: paginated,
    enableRowSelection: true,
    getRowId: (project) => project.id,
    pageSize: 3,
  })

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 p-4">
      <DataTable
        aria-label="Projetos"
        emptyMessage="No results."
        isLoading={isLoading}
        table={table}
      />
      {paginated ? <DataGridPagination table={table} /> : null}
    </div>
  )
}

const meta = {
  argTypes: {
    isLoading: booleanArgType,
    paginated: booleanArgType,
  },
  component: DataTableExample,
  decorators: [
    // Ocupa a largura do canvas até 1280px; acima disso, fica centralizada.
    (Story) => (
      <div className="w-[calc(100vw-2rem)] max-w-[1280px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Collection view em tabela semântica, sobre a `Table` do COSS e o TanStack Table. A view não traz moldura: não é filha de `CardFrame`. O consumidor é dono das colunas e do estado; o rodapé aparece quando alguma coluna declara `footer`. O status é um `SelectProperty`: o select emite a troca e o exemplo escreve na coleção.',
      },
    },
    layout: 'centered',
  },
  title: 'Patterns/CollectionViews/Views/Data Table',
} satisfies Meta<typeof DataTableExample>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('$39,550')).toBeTruthy()
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all' }))
    await expect(
      canvasElement.querySelectorAll('tbody tr[data-state="selected"]'),
    ).toHaveLength(projects.length)
    await expect(
      canvasElement.querySelector('[data-slot="card-frame"]'),
    ).toBeNull()
  },
}

/** Trocar o status pelo select reescreve a linha na coleção do exemplo. */
export const EditStatus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // O popup do Select sai em portal — vive fora de `canvasElement`.
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(
      await canvas.findByRole('combobox', { name: 'Status: Unpaid' }),
    )
    await userEvent.click(await body.findByRole('option', { name: 'Paid' }))
    await expect(
      canvas.queryByRole('combobox', { name: 'Status: Unpaid' }),
    ).toBeNull()
    await expect(
      canvas.getAllByRole('combobox', { name: 'Status: Paid' }),
    ).toHaveLength(4)
  },
}

export const Paginated: Story = { args: { paginated: true } }

export const Loading: Story = { args: { isLoading: true } }

export const Empty: Story = { args: { data: [] } }
