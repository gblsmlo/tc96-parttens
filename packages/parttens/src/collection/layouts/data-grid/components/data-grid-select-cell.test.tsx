import { afterEach, describe, expect, test } from 'bun:test'
import type { ReactElement } from 'react'
import { Profiler } from 'react'

await import('../../../test/dom')

class MockResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.assign(globalThis, { ResizeObserver: MockResizeObserver })

const { cleanup, fireEvent, render } = await import('@testing-library/react')
const { DataGrid } = await import('./data-grid')
const { useDataGrid } = await import('../hooks/use-data-grid')

interface Task {
  id: string
  stage: string
  title: string
}

const tasks: Task[] = [
  { id: 'a', stage: 'open', title: 'Alpha' },
  { id: 'b', stage: 'done', title: 'Beta' },
]

const doneRows: Task[] = [
  { id: 'a', stage: 'done', title: 'Alpha' },
  { id: 'b', stage: 'done', title: 'Beta' },
]

const stageOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Done', value: 'done' },
]

function SelectGrid({
  commits,
  options = stageOptions,
  rows = tasks,
}: Readonly<{
  commits?: { count: number }
  options?: { label: string; value: string }[]
  rows?: Task[]
}>): ReactElement {
  const { table } = useDataGrid<Task>({
    columns: [
      { accessorKey: 'title', header: 'Title', meta: { label: 'Title' } },
      {
        accessorKey: 'stage',
        header: 'Stage',
        meta: {
          editable: true,
          label: 'Stage',
          options,
          variant: 'select',
        },
      },
    ],
    data: rows,
    getRowId: (task) => task.id,
    onCellValueChange: () => {},
  })

  return (
    <Profiler
      id="grid"
      onRender={() => {
        if (commits) commits.count += 1
      }}
    >
      <DataGrid aria-label="Tasks" table={table} />
    </Profiler>
  )
}

function cellAt(container: HTMLElement, column: string): HTMLElement {
  const cell = container.querySelector<HTMLElement>(
    `[data-slot="data-grid-row"] [data-slot="data-grid-cell"][data-column-id="${column}"]`,
  )
  if (!cell) throw new Error(`cell ${column} not found`)
  return cell
}

function trigger(container: HTMLElement): HTMLElement {
  const element = container.querySelector<HTMLElement>(
    '[data-grid-select-trigger]',
  )
  if (!element) throw new Error('select trigger not found')
  return element
}

afterEach(cleanup)

describe('DataGrid select cell', () => {
  test('moves focus onto and off the select cell in one commit each', () => {
    const commits = { count: 0 }
    const { container } = render(<SelectGrid commits={commits} />)

    fireEvent.click(cellAt(container, 'title'))

    commits.count = 0
    fireEvent.keyDown(cellAt(container, 'title'), { key: 'ArrowRight' })
    expect(commits.count).toBe(1)

    commits.count = 0
    fireEvent.keyDown(cellAt(container, 'stage'), { key: 'ArrowLeft' })
    expect(commits.count).toBe(1)
  })

  test('updates the trigger label when the meta option labels change', () => {
    const { container, rerender } = render(<SelectGrid />)
    expect(trigger(container).textContent).toBe('Open')

    rerender(
      <SelectGrid
        options={[
          { label: 'Aberto', value: 'open' },
          { label: 'Concluído', value: 'done' },
        ]}
      />,
    )

    expect(trigger(container).textContent).toBe('Aberto')
    expect(trigger(container).getAttribute('aria-label')).toBe('Stage: Aberto')
  })

  test('updates the trigger label when the value changes', () => {
    const { container, rerender } = render(<SelectGrid />)
    expect(trigger(container).textContent).toBe('Open')

    rerender(<SelectGrid rows={doneRows} />)

    expect(trigger(container).textContent).toBe('Done')
  })

  test('opens the select on the second pointer click and not on the first', () => {
    const { container } = render(<SelectGrid />)
    const cell = cellAt(container, 'stage')

    fireEvent.pointerDown(cell)
    fireEvent.mouseDown(cell)
    fireEvent.click(cell)
    expect(trigger(container).getAttribute('aria-expanded')).toBe('false')

    fireEvent.pointerDown(cell)
    fireEvent.mouseDown(cell)
    fireEvent.click(cell)
    expect(trigger(container).getAttribute('aria-expanded')).toBe('true')
  })
})
