import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { sleep } from '../../test-utils/sleep'
import { initialTasks } from '../collection/fixtures/tasks'
import { DataGridCanvas } from './data-grid-canvas.tsx'
import { dataGridControlArgs } from './data-grid-controls.ts'
import {
  ComposedDataGrid,
  TASK_PAGE_SIZE,
  TasksGrid,
} from './data-grid-layouts.tsx'

const meta = {
  decorators: [DataGridCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/DataGrid/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const LOAD_DELAY = 2000

function LoadingTasksGrid() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    sleep(LOAD_DELAY).then(() => {
      if (active) setIsLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return <TasksGrid density="short" isLoading={isLoading} />
}

const gridOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('grid', { name: 'Tarefas do lançamento' })

const bodyRowsOf = (grid: HTMLElement) =>
  [...grid.querySelectorAll<HTMLElement>('[role="row"]')].filter((row) =>
    row.querySelector('[role="gridcell"]'),
  )

const firstTask = () => {
  const [first] = initialTasks
  if (!first) throw new Error('The fixture has no task.')
  return first
}

const pageOf = (page: number) =>
  initialTasks.slice((page - 1) * TASK_PAGE_SIZE, page * TASK_PAGE_SIZE)

export const LoadingKeepsTheRowHeight: Story = {
  render: () => <LoadingTasksGrid />,
  play: async ({ canvasElement }) => {
    const grid = gridOf(canvasElement)
    await expect(grid).toHaveAttribute('aria-busy', 'true')
    const skeletonRowHeight =
      bodyRowsOf(grid)[0]?.getBoundingClientRect().height

    await within(canvasElement).findByText(firstTask().title, undefined, {
      timeout: LOAD_DELAY * 2,
    })
    await expect(grid).not.toHaveAttribute('aria-busy')
    await expect(bodyRowsOf(grid)[0]?.getBoundingClientRect().height).toBe(
      skeletonRowHeight,
    )
  },
}

export const ArrowKeysMoveTheCellFocus: Story = {
  render: () => <TasksGrid />,
  play: async ({ canvasElement }) => {
    const titleCell = within(gridOf(canvasElement))
      .getByText(firstTask().title)
      .closest<HTMLElement>('[role="gridcell"]')
    if (!titleCell) throw new Error('The title is not inside a grid cell.')

    await userEvent.click(titleCell)
    await waitFor(() =>
      expect(titleCell.contains(document.activeElement)).toBe(true),
    )
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() =>
      expect(titleCell.contains(document.activeElement)).toBe(false),
    )
    await expect(document.activeElement).toHaveAttribute('role', 'gridcell')
    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() =>
      expect(titleCell.contains(document.activeElement)).toBe(true),
    )
  },
}

export const SelectionShowsTheActionBar: Story = {
  render: () => <TasksGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: 'Enviar' })).toBeNull()

    const [checkbox] = canvas.getAllByRole('checkbox', {
      name: 'Selecionar registro',
    })
    if (!checkbox) throw new Error('The grid has no row checkbox.')
    await userEvent.click(checkbox)
    await expect(
      await canvas.findByRole('button', { name: 'Enviar' }),
    ).toBeVisible()

    await userEvent.click(checkbox)
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: 'Enviar' })).toBeNull(),
    )
  },
}

export const PagesKeepTheHeight: Story = {
  render: () => <TasksGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = gridOf(canvasElement)
    await canvas.findByText(firstTask().title)
    const gridHeight = grid.getBoundingClientRect().height

    const goTo = async (name: string, page: number) => {
      await userEvent.click(canvas.getByRole('button', { name }))
      await canvas.findByText(pageOf(page)[0]?.title ?? '')
      await expect(grid.getBoundingClientRect().height).toBe(gridHeight)
    }
    await goTo('Próxima página', 2)
    await goTo('Página anterior', 1)
  },
}

export const EmptyShowsTheMessageRow: Story = {
  render: () => <ComposedDataGrid {...dataGridControlArgs} empty />,
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole('grid', {
      name: 'Projetos do trimestre',
    })
    const rows = within(grid).getAllByRole('row')
    const messageRow = rows.find(
      (row) => row.textContent === dataGridControlArgs.emptyMessage,
    )

    await expect(messageRow).toBeDefined()
    await expect(
      within(messageRow as HTMLElement).getAllByRole('gridcell'),
    ).toHaveLength(1)
    await expect(grid.querySelector('[data-slot="data-grid-row"]')).toBeNull()
    await expect(grid).not.toHaveAttribute('aria-busy')
    await expect(grid).toHaveAttribute('aria-rowcount', String(rows.length))
    await expect(grid).toHaveAttribute('tabindex', '0')
  },
}
