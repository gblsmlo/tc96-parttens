import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checklist } from '@tc96/parttens'
import {
  expect,
  fn,
  mocked,
  screen,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import { ChecklistCanvas } from './checklist-canvas.tsx'
import {
  authorOptions,
  behaviorItems,
  dueDateFromToday,
} from './checklist-data.ts'

const ignore = () => undefined

const meta = {
  args: {
    ariaLabel: 'Checklist',
    items: behaviorItems,
    newItemTitle: '',
    onCreate: ignore,
    onItemCompletionChange: ignore,
    onItemMove: ignore,
    onItemRename: ignore,
    onNewItemTitleChange: ignore,
    title: 'Etapas',
  },
  component: Checklist,
  decorators: [ChecklistCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Checklist/Behavior',
} satisfies Meta<typeof Checklist>

export default meta

type Story = StoryObj<typeof meta>

const disabledState = 'data-disabled'

const submitDraft = (canvasElement: HTMLElement) =>
  within(canvasElement)
    .getByRole('textbox', { name: 'Novo item' })
    .closest('form')
    ?.requestSubmit()

export const DelegatesChangesToConsumer: Story = {
  args: {
    newItemTitle: 'Nova etapa',
    onCreate: fn(),
    onItemCompletionChange: fn(),
    onItemDelete: fn(),
    onItemMove: fn(),
    onItemRename: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Primeira etapa' })

    await userEvent.click(checkbox)
    const title = canvas.getByRole('textbox', {
      name: 'Título: Primeira etapa',
    })
    await userEvent.clear(title)
    await userEvent.type(title, 'Etapa revisada')
    await userEvent.click(canvasElement.ownerDocument.body)
    const handle = canvas.getByLabelText('Reordenar Primeira etapa')
    handle.dispatchEvent(
      new KeyboardEvent('keydown', {
        altKey: true,
        bubbles: true,
        key: 'ArrowDown',
      }),
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Excluir Primeira etapa' }),
    )
    submitDraft(canvasElement)

    await expect(args.onItemCompletionChange).toHaveBeenCalledOnce()
    await expect(args.onItemCompletionChange).toHaveBeenLastCalledWith(
      'first',
      true,
    )
    await expect(args.onItemRename).toHaveBeenCalledOnce()
    await expect(args.onItemRename).toHaveBeenLastCalledWith(
      'first',
      'Etapa revisada',
    )
    await expect(args.onItemMove).toHaveBeenCalledOnce()
    await expect(args.onItemMove).toHaveBeenLastCalledWith('first', 1)
    await expect(args.onItemDelete).toHaveBeenCalledOnce()
    await expect(args.onItemDelete).toHaveBeenLastCalledWith('first')
    await expect(args.onCreate).toHaveBeenCalledOnce()
    await expect(args.onCreate).toHaveBeenLastCalledWith('Nova etapa', false)
    const callOrder = [
      args.onItemCompletionChange,
      args.onItemRename,
      args.onItemMove,
      args.onItemDelete,
      args.onCreate,
    ].map((spy) => (spy ? mocked(spy).mock.invocationCallOrder[0] : 0) ?? 0)
    await expect(callOrder).toEqual([...callOrder].sort((a, b) => a - b))

    await expect(checkbox).not.toBeChecked()
    await expect(
      canvas
        .getAllByRole('checkbox', { name: /etapa$/ })
        .map((box) => box.getAttribute('aria-label')),
    ).toEqual(['Primeira etapa', 'Segunda etapa'])
  },
}

export const ProgressCountsCompleted: Story = {
  args: { progress: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const progressbar = canvas.getByRole('progressbar', {
      name: '1 de 2 concluídos',
    })

    await expect(canvas.getByText('1 de 2 concluídos')).toBeVisible()
    await expect(progressbar).toHaveAttribute('aria-valuenow', '1')
    await expect(progressbar).toHaveAttribute('aria-valuemax', '2')
  },
}

export const ReadOnlyWithoutEditingControls: Story = {
  args: { onItemDelete: ignore, readOnly: true, title: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkboxes = canvas.getAllByRole('checkbox')

    await expect(checkboxes).toHaveLength(2)
    for (const checkbox of checkboxes) {
      await expect(checkbox).toHaveAttribute(disabledState)
    }
    await expect(canvas.queryByRole('textbox')).toBeNull()
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="checklist-delete"]'),
    ).toBeNull()
    await expect(canvas.queryByText('1 de 2 concluídos')).toBeNull()
  },
}

export const OpensItemSeparatelyFromCompletion: Story = {
  args: {
    onItemClick: fn(),
    onItemCompletionChange: fn(),
    onItemRename: fn(),
    title: undefined,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Abrir Primeira etapa' }),
    )
    await expect(args.onItemClick).toHaveBeenCalledOnce()
    await expect(args.onItemClick).toHaveBeenLastCalledWith(behaviorItems[0])
    await expect(args.onItemCompletionChange).not.toHaveBeenCalled()

    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Primeira etapa' }),
    )
    await expect(args.onItemCompletionChange).toHaveBeenCalledOnce()
    await expect(args.onItemCompletionChange).toHaveBeenLastCalledWith(
      'first',
      true,
    )
    await expect(args.onItemClick).toHaveBeenCalledOnce()
    await expect(args.onItemRename).not.toHaveBeenCalled()
    await expect(canvas.queryByRole('textbox', { name: /^Título/ })).toBeNull()
    await expect(canvas.queryByRole('button', { name: /Ações de/ })).toBeNull()
  },
}

export const IgnoresEmptyRename: Story = {
  args: { onItemRename: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByRole('textbox', {
      name: 'Título: Primeira etapa',
    })

    await userEvent.clear(title)
    await userEvent.type(title, '   ')
    await userEvent.click(canvasElement.ownerDocument.body)

    await expect(args.onItemRename).not.toHaveBeenCalled()
    await expect(title).toHaveValue('Primeira etapa')
  },
}

export const DelegatesAuthorChange: Story = {
  args: {
    authorOptions,
    items: [{ ...behaviorItems[0], authorId: 'gabriel' }],
    onItemAuthorChange: fn(),
    title: undefined,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Author: Gabriel Melo' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Ana Souza' }),
    )
    await expect(args.onItemAuthorChange).toHaveBeenCalledOnce()
    await expect(args.onItemAuthorChange).toHaveBeenLastCalledWith(
      'first',
      'ana',
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const DelegatesDueDateChange: Story = {
  args: {
    items: [{ ...behaviorItems[0], dueDate: '2026-10-01T12:00:00.000Z' }],
    onItemDueDateChange: fn(),
    title: undefined,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /^Due date:/ }))
    await userEvent.click(
      await screen.findByRole('button', { name: 'Limpar data' }),
    )
    await expect(args.onItemDueDateChange).toHaveBeenCalledOnce()
    await expect(args.onItemDueDateChange).toHaveBeenLastCalledWith(
      'first',
      null,
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const MetadataFollowsThreeStates: Story = {
  args: {
    authorOptions,
    items: [
      { completed: false, id: 'bare', title: 'Sem metadados' },
      {
        authorId: null,
        completed: false,
        dueDate: null,
        id: 'empty',
        title: 'Metadados vazios',
      },
    ],
    readOnly: true,
    title: undefined,
  },
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-slot="checklist-row"]')
    const [bare, empty] = Array.from(rows) as HTMLElement[]

    await expect(rows).toHaveLength(2)
    await expect(bare?.querySelector('[data-slot="checklist-actions"]')).toBe(
      null,
    )
    await expect(
      within(empty as HTMLElement).getByText('No due date'),
    ).toBeVisible()
    await expect(
      within(empty as HTMLElement).getByRole('img', { name: /^Author:/ }),
    ).toBeVisible()
  },
}

export const MarksDueStatus: Story = {
  args: { readOnly: true, title: undefined },
  render: (args) => (
    <Checklist
      {...args}
      items={[
        { ...behaviorItems[0], dueDate: dueDateFromToday(-3), id: 'late' },
        { ...behaviorItems[0], dueDate: dueDateFromToday(0), id: 'today' },
        { ...behaviorItems[0], dueDate: dueDateFromToday(3), id: 'soon' },
        { ...behaviorItems[0], dueDate: null, id: 'none' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const statuses = Array.from(
      canvasElement.querySelectorAll('[data-slot="checklist-actions"]'),
      (actions) => actions.getAttribute('data-due'),
    )

    await expect(statuses).toEqual(['overdue', 'today', 'upcoming', 'upcoming'])
  },
}

export const RelativeDueDatesNearToday: Story = {
  args: { readOnly: true, title: undefined },
  render: (args) => (
    <Checklist
      {...args}
      items={[
        { ...behaviorItems[0], dueDate: dueDateFromToday(0) },
        { ...behaviorItems[1], dueDate: dueDateFromToday(-1) },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Today')).toBeVisible()
    await expect(canvas.getByText('Yesterday')).toBeVisible()
  },
}

export const SingleItemCannotMove: Story = {
  args: { items: [behaviorItems[0]] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Reordenar Primeira etapa'),
    ).toBeDisabled()
  },
}

export const ReportsDraftText: Story = {
  args: { onNewItemTitleChange: fn() },
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Novo item',
    })

    await userEvent.type(input, 'Ab')

    await expect(args.onNewItemTitleChange).toHaveBeenCalledTimes(2)
    await expect(args.onNewItemTitleChange).toHaveBeenNthCalledWith(1, 'A')
    await expect(args.onNewItemTitleChange).toHaveBeenNthCalledWith(2, 'b')
    await expect(input).toHaveValue('')
  },
}

export const DraftCheckboxCreatesCompleted: Story = {
  args: { newItemTitle: '  Nova etapa  ', onCreate: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('checkbox', {
        name: 'Concluir novo item',
      }),
    )

    await expect(args.onCreate).toHaveBeenCalledOnce()
    await expect(args.onCreate).toHaveBeenLastCalledWith('Nova etapa', true)
  },
}

export const IgnoresBlankDraft: Story = {
  args: { newItemTitle: '   ', onCreate: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    submitDraft(canvasElement)

    await expect(args.onCreate).not.toHaveBeenCalled()
    await expect(
      canvas.getByRole('checkbox', { name: 'Concluir novo item' }),
    ).toHaveAttribute(disabledState)
  },
}

export const CreatingDisablesDraft: Story = {
  args: { creating: true, newItemTitle: 'Nova etapa', onCreate: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Novo item' })

    await expect(input).toBeDisabled()
    await expect(
      canvas.getByRole('checkbox', { name: 'Concluir novo item' }),
    ).toHaveAttribute(disabledState)
    submitDraft(canvasElement)
    await expect(args.onCreate).not.toHaveBeenCalled()
  },
}

export const EmptyListHasNoDraftCheckbox: Story = {
  args: { items: [], newItemTitle: 'Nova etapa', onCreate: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('checkbox')).toBeNull()
    await expect(canvas.getByText('Etapas')).toBeVisible()
    await expect(canvas.queryByText(/concluído/)).toBeNull()
    await userEvent.click(canvas.getByRole('textbox', { name: 'Novo item' }))
    await userEvent.keyboard('{Enter}')
    await expect(args.onCreate).toHaveBeenCalledOnce()
    await expect(args.onCreate).toHaveBeenLastCalledWith('Nova etapa', false)
  },
}

const focusedElement = (canvasElement: HTMLElement) =>
  canvasElement.ownerDocument.activeElement

const tabSkippingDragHandle = async (canvasElement: HTMLElement) => {
  await userEvent.tab()
  if (
    focusedElement(canvasElement)?.getAttribute('data-slot') ===
    'checklist-drag-handle'
  ) {
    await userEvent.tab()
  }
}

export const KeyboardReachesRowControls: Story = {
  args: { onItemDelete: ignore },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const expected = [
      canvas.getByRole('checkbox', { name: 'Primeira etapa' }),
      canvas.getByRole('textbox', { name: 'Título: Primeira etapa' }),
      canvas.getByRole('button', { name: 'Excluir Primeira etapa' }),
      canvas.getByRole('checkbox', { name: 'Segunda etapa' }),
      canvas.getByRole('textbox', { name: 'Título: Segunda etapa' }),
      canvas.getByRole('button', { name: 'Excluir Segunda etapa' }),
      canvas.getByRole('textbox', { name: 'Novo item' }),
    ]

    ;(focusedElement(canvasElement) as HTMLElement | null)?.blur()
    for (const element of expected) {
      await tabSkippingDragHandle(canvasElement)
      await expect(element).toHaveFocus()
    }
  },
}

export const PlainHandleMovesByKeyboard: Story = {
  args: { onItemMove: fn(), variant: 'plain' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('button', {
      name: 'Reordenar Primeira etapa',
    })

    ;(focusedElement(canvasElement) as HTMLElement | null)?.blur()
    await userEvent.tab()
    await expect(
      canvas.getByRole('checkbox', { name: 'Primeira etapa' }),
    ).toHaveFocus()
    await userEvent.tab()
    await userEvent.tab()
    await expect(handle).toHaveFocus()
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}')

    await expect(args.onItemMove).toHaveBeenCalledOnce()
    await expect(args.onItemMove).toHaveBeenLastCalledWith('first', 1)

    await userEvent.tab()
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull())
  },
}

export const FlatRowsInsideOneOutlinedList: Story = {
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('[data-slot="checklist-items"]')
    const card = list?.parentElement

    await expect(list?.tagName).toBe('OL')
    await expect(card).toHaveAttribute('data-slot', 'card')
    await expect(card?.className).toContain('rounded-2xl')
    await expect(card?.className).not.toContain('overflow-hidden')
    await expect(list?.hasAttribute('class')).toBe(false)
    for (const frameClass of ['rounded', 'border', 'bg-card', 'shadow']) {
      await expect(list?.className ?? '').not.toContain(frameClass)
    }
    await expect(
      canvasElement.querySelectorAll(
        'section[data-slot="checklist"] [data-slot="card"]',
      ),
    ).toHaveLength(1)
    const firstRow = list?.querySelector('li')
    await expect(firstRow?.className).toContain('hover:bg-muted/60')
    await expect(firstRow?.className).toContain(
      'first:rounded-t-[calc(var(--card-surface-radius,var(--radius-2xl))-1px)]',
    )
    await expect(firstRow?.className).toContain(
      'last:rounded-b-[calc(var(--card-surface-radius,var(--radius-2xl))-1px)]',
    )
    await expect(firstRow?.className).not.toContain('rounded-xl')
  },
}

export const CardFramesListWithHandleOutsideRow: Story = {
  args: { title: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const section = canvas.getByRole('region', { name: 'Checklist' })
    const list = section.querySelector('[data-slot="checklist-items"]')
    const card = list?.parentElement
    const handle = canvas.getByLabelText('Reordenar Primeira etapa')

    await expect(section).toHaveAttribute('data-variant', 'card')
    await expect(section.className).toContain('pt-2 pb-4')
    await expect(card).toHaveAttribute('data-slot', 'card')
    await expect(card?.className).toContain('border')
    await expect(card?.className).not.toContain('overflow-hidden')
    await expect(
      section.querySelector('[data-slot="checklist-item"]')?.className,
    ).not.toContain('hover-offset')
    await expect(handle.closest('[data-slot="checklist-row"]')).toBeNull()
    await expect(handle.className).toContain('-right-6')
  },
}

export const PlainPutsHandleAtRowEnd: Story = {
  args: { onItemDelete: ignore, title: undefined, variant: 'plain' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const section = canvas.getByRole('region', { name: 'Checklist' })
    const list = section.querySelector('[data-slot="checklist-items"]')
    const row = canvas
      .getByRole('checkbox', { name: 'Primeira etapa' })
      .closest('[data-slot="checklist-row"]') as HTMLElement
    const handle = canvas.getByRole('button', {
      name: 'Reordenar Primeira etapa',
    })
    const item = row.closest('[data-slot="checklist-item"]') as HTMLElement

    await expect(section).toHaveAttribute('data-variant', 'plain')
    await expect(section.className).not.toContain('pt-2')
    await expect(list?.className).not.toContain('border')
    await expect(section.querySelector('[data-slot="card"]')).toBeNull()
    await expect(item.className).toContain('rounded-md')
    await expect(item.className).toContain(
      '-mx-[var(--record-group-hover-offset,0px)]',
    )
    await expect(row.className).toContain(
      'h-[var(--record-group-row-height,calc(var(--spacing)*9))] px-2',
    )
    await expect(row.contains(handle)).toBe(true)
    await expect(row.lastElementChild?.contains(handle)).toBe(true)
    await expect(
      within(row)
        .getByRole('button', { name: 'Excluir Primeira etapa' })
        .compareDocumentPosition(handle) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(handle.className.split(' ')).not.toContain('absolute')
  },
}
