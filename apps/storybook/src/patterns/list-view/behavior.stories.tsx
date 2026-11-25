import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { initialTasks, type Task } from '../collection/fixtures/tasks'
import { ListCanvas } from './list-canvas.tsx'
import { listControlArgs } from './list-controls.ts'
import { tasksWithoutInProgress } from './list-data.ts'
import { ComposedList, DocumentRow, TasksList } from './list-layouts.tsx'

interface ListBehaviorArgs {
  onRecordAdd: (groupId: string) => void
  onCollapsedGroupIdsChange: (groupIds: readonly string[]) => void
  onMenu: () => void
  onOpen: () => void
  onOpenTask: (task: Task) => void
}

const meta = {
  args: {
    onRecordAdd: fn(),
    onCollapsedGroupIdsChange: fn(),
    onMenu: fn(),
    onOpen: fn(),
    onOpenTask: fn(),
  },
  decorators: [ListCanvas],
  render: ({ onMenu, onOpen }) => (
    <DocumentRow onMenu={onMenu} onOpen={onOpen} />
  ),
  tags: ['!autodocs'],
  title: 'Patterns/ListView/Behavior',
} satisfies Meta<ListBehaviorArgs>

export default meta

type Story = StoryObj<ListBehaviorArgs>

const listIn = (canvasElement: HTMLElement) => {
  const list = canvasElement.querySelector<HTMLElement>(
    '[data-slot="list-view"]',
  )
  if (!list) throw new Error('The story did not render the list.')
  return list
}

const required = <T,>(node: T | null | undefined, name: string): T => {
  if (!node) throw new Error(`The story did not render ${name}.`)
  return node
}

const tooltipText = (canvasElement: HTMLElement) =>
  canvasElement.ownerDocument.querySelector('[data-slot="tooltip-popup"]')
    ?.textContent

const dateSurface = (canvasElement: HTMLElement) =>
  required(
    within(canvasElement)
      .getByText('há 4 dias')
      .closest<HTMLElement>('[data-slot="property-surface"]'),
    'the date surface',
  )

const contractTrigger = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', {
    name: 'Contrato de prestação de serviços',
  })

export const LoadingKeepsGroupsOpen: Story = {
  render: () => <TasksList collapseEmptyGroups grouping="assignee" loading />,
  play: async ({ canvasElement }) => {
    const list = listIn(canvasElement)
    const canvas = within(list)

    await expect(list).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getAllByRole('status', { name: 'Carregando tarefa' }),
    ).toHaveLength(list.querySelectorAll('[data-slot="list-group"]').length)
    await expect(canvas.queryByText('Nenhuma tarefa neste grupo.')).toBeNull()
    await expect(
      canvas.queryAllByRole('button', { name: /^Expand / }),
    ).toHaveLength(0)
  },
}

export const LoadingHidesGroupActions: Story = {
  render: ({ onRecordAdd }) => (
    <TasksList grouping="status" loading onRecordAdd={onRecordAdd} />
  ),
  play: async ({ args, canvasElement }) => {
    await expect(
      within(canvasElement).queryAllByRole('button', { name: /^Add item to/ }),
    ).toHaveLength(0)
    await expect(args.onRecordAdd).not.toHaveBeenCalled()
  },
}

export const AddActionReportsTheGroup: Story = {
  render: ({ onRecordAdd }) => (
    <TasksList grouping="status" onRecordAdd={onRecordAdd} />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Add item to A fazer',
      }),
    )

    await expect(args.onRecordAdd).toHaveBeenCalledOnce()
    await expect(args.onRecordAdd).toHaveBeenLastCalledWith('status:todo')
  },
}

export const EmptyGroupStartsCollapsed: Story = {
  render: () => (
    <TasksList
      collapseEmptyGroups
      grouping="status"
      startingTasks={tasksWithoutInProgress}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('button', { name: 'Expand Em andamento' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Collapse A fazer' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Nenhuma tarefa neste grupo.')).toBeNull()
  },
}

export const UntouchedGroupReopensWithItems: Story = {
  render: () => (
    <TasksList
      collapseEmptyGroups
      grouping="status"
      startingTasks={tasksWithoutInProgress}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const [status] = within(
      canvas.getByRole('region', { name: 'A fazer' }),
    ).getAllByRole('combobox', { name: /^Status/ })

    await userEvent.click(required(status, 'a task in A fazer'))
    await userEvent.click(
      await body.findByRole('option', { name: 'Em andamento' }),
    )

    await expect(
      await canvas.findByRole('button', { name: 'Collapse Em andamento' }),
    ).toBeVisible()
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull())
  },
}

export const ReportsTheCollapsedGroups: Story = {
  render: ({ onCollapsedGroupIdsChange }) => (
    <TasksList
      collapseEmptyGroups
      grouping="status"
      onCollapsedGroupIdsChange={onCollapsedGroupIdsChange}
      startingTasks={tasksWithoutInProgress}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Collapse A fazer' }),
    )
    await expect(args.onCollapsedGroupIdsChange).toHaveBeenCalledOnce()
    await expect(args.onCollapsedGroupIdsChange).toHaveBeenLastCalledWith([
      'status:todo',
      'status:in-progress',
    ])

    await userEvent.click(
      await canvas.findByRole('button', { name: 'Expand Em andamento' }),
    )
    await expect(args.onCollapsedGroupIdsChange).toHaveBeenCalledTimes(2)
    await expect(args.onCollapsedGroupIdsChange).toHaveBeenLastCalledWith([
      'status:todo',
    ])
  },
}

export const GroupCollapsesAndExpands: Story = {
  render: () => <TasksList grouping="status" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const todo = canvas.getByRole('region', { name: 'A fazer' })

    await expect(within(todo).getAllByRole('article').length).toBeGreaterThan(0)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Collapse A fazer' }),
    )
    await canvas.findByRole('button', { name: 'Expand A fazer' })
    await waitFor(() =>
      expect(within(todo).queryAllByRole('article')).toHaveLength(0),
    )

    await userEvent.click(
      canvas.getByRole('button', { name: 'Expand A fazer' }),
    )
    await canvas.findByRole('button', { name: 'Collapse A fazer' })
    await waitFor(() =>
      expect(within(todo).getAllByRole('article').length).toBeGreaterThan(0),
    )
  },
}

export const GroupToggleTakesTheConsumerLabel: Story = {
  render: () => (
    <TasksList
      getGroupToggleLabel={(group, collapsed) =>
        collapsed ? `Mostrar ${group}` : `Ocultar ${group}`
      }
      grouping="status"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.queryAllByRole('button', { name: /^(Expand|Collapse) / }),
    ).toHaveLength(0)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ocultar A fazer' }),
    )
    await expect(
      await canvas.findByRole('button', { name: 'Mostrar A fazer' }),
    ).toHaveAttribute('aria-expanded', 'false')
  },
}

export const GroupCountIsRound: Story = {
  render: () => <TasksList grouping="status" />,
  play: async ({ canvasElement }) => {
    const count = required(
      canvasElement.querySelector<HTMLElement>(
        '[data-slot="list-group-count"]',
      ),
      'a group count',
    )
    const box = count.getBoundingClientRect()

    await expect(box.width).toBeGreaterThan(0)
    await expect(box.width).toBe(box.height)
  },
}

export const TitleLevelFollowsGrouping: Story = {
  render: () => (
    <div className="grid gap-4">
      <ComposedList {...listControlArgs} grouped={false} />
      <ComposedList {...listControlArgs} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [flat, grouped] = [
      ...canvasElement.querySelectorAll<HTMLElement>('[data-slot="list-view"]'),
    ]

    await expect(
      within(required(flat, 'the flat list')).getByRole('heading', {
        level: 2,
        name: 'Primeiro registro',
      }),
    ).toBeVisible()
    await expect(
      within(required(grouped, 'the grouped list')).getByRole('heading', {
        level: 3,
        name: 'Primeiro registro',
      }),
    ).toBeVisible()
  },
}

export const EmptyFlatListShowsMessage: Story = {
  render: () => <ComposedList {...listControlArgs} empty grouped={false} />,
  play: async ({ canvasElement }) => {
    const list = listIn(canvasElement)

    await expect(
      within(list).getByText(listControlArgs.emptyMessage),
    ).toBeVisible()
    await expect(within(list).queryAllByRole('article')).toHaveLength(0)
    await expect(list.querySelector('[data-slot="list-group"]')).toBeNull()
  },
}

export const PlainFieldAreaOpensTheRow: Story = {
  render: ({ onOpenTask }) => (
    <TasksList grouping="status" onOpen={onOpenTask} />
  ),
  play: async ({ args, canvasElement }) => {
    const field = required(
      canvasElement.querySelector('[data-slot="list-row-field"]'),
      'a row field',
    )
    const [first, second] = [...field.querySelectorAll('button')]
    const left = required(
      first,
      'the first field control',
    ).getBoundingClientRect()
    const right = required(
      second,
      'the second field control',
    ).getBoundingClientRect()
    const gap = required(
      canvasElement.ownerDocument.elementFromPoint(
        (left.right + right.left) / 2,
        left.top + left.height / 2,
      ),
      'an element between the fields',
    )

    await userEvent.click(gap)
    await expect(args.onOpenTask).toHaveBeenCalledOnce()
    const title = field
      .closest('[data-slot="list-row"]')
      ?.querySelector('[data-slot="list-row-title"]')?.textContent
    await expect(args.onOpenTask).toHaveBeenLastCalledWith(
      expect.objectContaining({ title }),
    )
  },
}

export const FieldControlKeepsItsClick: Story = {
  render: ({ onOpenTask }) => (
    <TasksList grouping="status" onOpen={onOpenTask} />
  ),
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const [status] = within(canvasElement).getAllByRole('combobox', {
      name: /^Status/,
    })

    await userEvent.click(required(status, 'a status field'))
    await expect(await body.findByRole('listbox')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull())
    await expect(args.onOpenTask).not.toHaveBeenCalled()
  },
}

export const LoadingRowKeepsHeight: Story = {
  render: () => (
    <div className="grid gap-4">
      <DocumentRow loading />
      <DocumentRow />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [loadingView, loadedView] = [
      ...canvasElement.querySelectorAll<HTMLElement>('[data-slot="list-view"]'),
    ]
    const rowIn = (view: Element | undefined) =>
      required(view?.querySelector('[data-slot="list-row"]'), 'a row')
    const skeleton = within(
      required(loadingView, 'the loading list'),
    ).getByRole('status', { name: 'Carregando documento' })

    await expect(skeleton).toHaveAttribute('data-media', 'icon')
    await expect(skeleton).toHaveAttribute('data-lines', '2')
    await expect(skeleton).toHaveAttribute('data-pills', '1')
    await expect(rowIn(loadingView).getBoundingClientRect().height).toBe(
      rowIn(loadedView).getBoundingClientRect().height,
    )
  },
}

export const WholeRowOpens: Story = {
  play: async ({ args, canvasElement }) => {
    const description = within(canvasElement).getByText('Mariana Souza')
    const { height, left, top, width } = description.getBoundingClientRect()

    await userEvent.click(
      required(
        canvasElement.ownerDocument.elementFromPoint(
          left + width / 2,
          top + height / 2,
        ),
        'an element over the description',
      ),
    )
    await expect(args.onOpen).toHaveBeenCalledOnce()
  },
}

export const TriggerOpensWithTheKeyboard: Story = {
  render: ({ onOpenTask }) => (
    <TasksList grouping="status" onOpen={onOpenTask} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const firstBacklog = initialTasks.find((task) => task.status === 'backlog')
    const backlog = within(canvas.getByRole('region', { name: 'Backlog' }))

    canvas.getByRole('button', { name: 'Collapse Backlog' }).focus()
    await userEvent.tab()
    await expect(
      backlog.getByRole('button', { name: firstBacklog?.title }),
    ).toHaveFocus()
    await userEvent.keyboard('{Enter}')

    await expect(args.onOpenTask).toHaveBeenCalledOnce()
    await expect(args.onOpenTask).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: firstBacklog?.id }),
    )
  },
}

export const FocusablePropertyForwardsTheClick: Story = {
  play: async ({ args, canvasElement }) => {
    const date = dateSurface(canvasElement)

    await userEvent.hover(date)
    await waitFor(() => expect(tooltipText(canvasElement)).toBeTruthy())
    await userEvent.click(date)
    await expect(args.onOpen).toHaveBeenCalledOnce()

    await userEvent.unhover(date)
    date.blur()
    await waitFor(() => expect(tooltipText(canvasElement)).toBeFalsy())
  },
}

export const PropertyTooltipOnKeyboardFocus: Story = {
  play: async ({ args, canvasElement }) => {
    const date = dateSurface(canvasElement)

    contractTrigger(canvasElement).focus()
    await userEvent.tab()
    await expect(date).toHaveFocus()
    await waitFor(() => expect(tooltipText(canvasElement)).toBeTruthy())
    await expect(date).toHaveAccessibleDescription(
      tooltipText(canvasElement) ?? '',
    )
    await expect(args.onOpen).not.toHaveBeenCalled()

    date.blur()
    await waitFor(() => expect(tooltipText(canvasElement)).toBeFalsy())
  },
}

export const ActionKeepsItsClick: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Mais ações' }),
    )

    await expect(args.onMenu).toHaveBeenCalledOnce()
    await expect(args.onOpen).not.toHaveBeenCalled()
  },
}

export const DisabledTriggerOpensNothing: Story = {
  render: ({ onOpen }) => <DocumentRow disabled onOpen={onOpen} />,
  play: async ({ args, canvasElement }) => {
    const trigger = contractTrigger(canvasElement)

    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger)
    const date = dateSurface(canvasElement)
    await userEvent.click(date)
    await expect(args.onOpen).not.toHaveBeenCalled()

    await userEvent.unhover(date)
    date.blur()
    await waitFor(() => expect(tooltipText(canvasElement)).toBeFalsy())
  },
}

const rowOf = (element: HTMLElement) => {
  const row = element.closest<HTMLElement>('[data-slot="list-row"]')
  if (!row) throw new Error('The checkbox is not inside a row.')
  return row
}

const opacityOf = (element: Element | null) =>
  element ? getComputedStyle(element).opacity : 'missing'

export const CheckboxSelectsTheRow: Story = {
  render: () => <ComposedList {...listControlArgs} selection="checkbox" />,
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', {
      name: 'Selecionar Primeiro registro',
    })
    const row = rowOf(checkbox)

    await expect(row).not.toHaveAttribute('data-state')
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await expect(row).toHaveAttribute('data-state', 'selected')

    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
    await expect(row).not.toHaveAttribute('data-state')
  },
}

export const CheckboxOverIconReplacesTheIcon: Story = {
  render: () => <ComposedList {...listControlArgs} selection="icon" />,
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', {
      name: 'Selecionar Primeiro registro',
    })
    const row = rowOf(checkbox)
    const media = row.querySelector('[data-slot="list-row-select-media"]')
    const control = checkbox.parentElement

    await waitFor(() => expect(opacityOf(media)).toBe('1'))
    await expect(opacityOf(control)).toBe('0')

    checkbox.focus()
    await waitFor(() => expect(opacityOf(control)).toBe('1'))
    await expect(opacityOf(media)).toBe('0')

    await userEvent.click(checkbox)
    await userEvent.unhover(row)
    checkbox.blur()
    await expect(checkbox).toBeChecked()
    await waitFor(() => expect(opacityOf(control)).toBe('1'))
    await expect(opacityOf(media)).toBe('0')
  },
}

export const CheckboxSitsSixteenPixelsBeforeTheIcon: Story = {
  render: () => <ComposedList {...listControlArgs} selection="checkbox" />,
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', {
      name: 'Selecionar Primeiro registro',
    })
    const icon = rowOf(checkbox).querySelector('[data-slot="icon-frame"]')
    if (!icon) throw new Error('The row did not render its icon.')

    await expect(
      Math.round(
        icon.getBoundingClientRect().left -
          checkbox.getBoundingClientRect().right,
      ),
    ).toBe(16)
  },
}

export const RowsAreTwoPixelsApart: Story = {
  render: () => <ComposedList {...listControlArgs} />,
  play: async ({ canvasElement }) => {
    const [first, second] = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="list-group-items"] [data-slot="list-row"]',
    )
    if (!first || !second)
      throw new Error('The first group did not render two rows.')

    await expect(
      Math.round(
        second.getBoundingClientRect().top -
          first.getBoundingClientRect().bottom,
      ),
    ).toBe(2)
  },
}
