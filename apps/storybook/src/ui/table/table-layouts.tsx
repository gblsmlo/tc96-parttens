import { CardFrame } from '@tc96/ui/card'
import { Checkbox } from '@tc96/ui/checkbox'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  type TableProps,
  TableRow,
} from '@tc96/ui/table'
import type { TableContainerName, TableControls } from './table-controls.ts'

export const tableProjects = [
  { budget: '$12,400', name: 'Website', status: 'Active', team: 'Design' },
  { budget: '$8,750', name: 'Mobile app', status: 'Paused', team: 'Product' },
  { budget: '$5,200', name: 'Billing API', status: 'Active', team: 'Platform' },
  { budget: '$2,900', name: 'Help center', status: 'Done', team: 'Support' },
]

const tableTotal = '$29,250'

export const tableColumns = ['Project', 'Status', 'Team', 'Budget']

const selectedIndex = 1

interface ComposedTableProps extends TableControls {
  empty?: boolean
}

// biome-ignore lint/a11y/noNoninteractiveTabindex: a container that scrolls must be reachable by keyboard (axe scrollable-region-focusable)
const scrollRegion = <section aria-label="Projects" tabIndex={0} />

const containers: Record<TableContainerName, TableProps['render']> = {
  div: undefined,
  section: scrollRegion,
}

export const ComposedTable = ({
  caption,
  container,
  empty,
  footer,
  selectedRow,
  selection,
  variant,
}: Readonly<ComposedTableProps>) => {
  const columnCount = tableColumns.length + (selection ? 1 : 0)
  return (
    <Table
      key={String(selectedRow)}
      render={containers[container]}
      variant={variant}
    >
      {caption ? <TableCaption>{caption}</TableCaption> : null}
      <TableHeader>
        <TableRow>
          {selection ? (
            <TableHead>
              <Checkbox
                aria-label="Select all rows"
                indeterminate={selectedRow}
              />
            </TableHead>
          ) : null}
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Team</TableHead>
          <TableHead className="text-right">Budget</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {empty ? (
          <TableRow>
            <TableCell className="h-24 text-center" colSpan={columnCount}>
              No results.
            </TableCell>
          </TableRow>
        ) : (
          tableProjects.map((project, index) => {
            const selected = selectedRow && index === selectedIndex
            return (
              <TableRow
                data-state={selected ? 'selected' : undefined}
                key={project.name}
              >
                {selection ? (
                  <TableCell>
                    <Checkbox
                      aria-label={`Select ${project.name}`}
                      defaultChecked={selected}
                    />
                  </TableCell>
                ) : null}
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>{project.team}</TableCell>
                <TableCell className="text-right">{project.budget}</TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
      {footer ? (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columnCount - 1}>Total</TableCell>
            <TableCell className="text-right">{tableTotal}</TableCell>
          </TableRow>
        </TableFooter>
      ) : null}
    </Table>
  )
}

export const RowHeadersTable = () => (
  <Table>
    <TableCaption>Projects this quarter.</TableCaption>
    <TableBody>
      {tableProjects.map((project) => (
        <TableRow key={project.name}>
          <TableHead scope="row">{project.name}</TableHead>
          <TableCell>{project.status}</TableCell>
          <TableCell className="text-right">{project.budget}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

export const CardFrameTable = (props: Readonly<TableControls>) => (
  <CardFrame>
    <ComposedTable {...props} variant="card" />
  </CardFrame>
)

export const ScrollRegionTable = (props: Readonly<TableControls>) => (
  <div className="w-56">
    <ComposedTable {...props} container="section" />
  </div>
)
