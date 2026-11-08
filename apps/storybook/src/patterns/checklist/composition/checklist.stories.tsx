import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checklist, type ChecklistItem } from '@tc96/parttens'
import { expect, fn, mocked, screen, userEvent, within } from 'storybook/test'

const items: ChecklistItem[] = [
  { completed: false, id: 'first', title: 'Primeira etapa' },
  { completed: true, id: 'second', title: 'Segunda etapa' },
]

const utcNoonToday = () => {
  const today = new Date()
  return Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
    12,
  )
}

const meta = {
  args: {
    ariaLabel: 'Checklist',
    items,
    newItemTitle: '',
    onCreate: fn(),
    onItemCompletionChange: fn(),
    onItemMove: fn(),
    onItemRename: fn(),
    onNewItemTitleChange: fn(),
    title: 'Etapas',
  },
  component: Checklist,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-2xl p-8">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Checklist/Composition/Checklist',
} satisfies Meta<typeof Checklist>

export default meta
type Story = StoryObj<typeof meta>

export const DelegatesChangesToConsumer: Story = {
  args: {
    newItemTitle: 'Nova etapa',
    onItemDelete: fn(),
    progress: true,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('1 de 2 concluídos')).toBeVisible()
    await expect(canvas.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '1',
    )

    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Primeira etapa' }),
    )
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
    canvas
      .getByRole('textbox', { name: 'Novo item' })
      .closest('form')
      ?.requestSubmit()

    await expect(args.onItemCompletionChange).toHaveBeenCalledTimes(1)
    await expect(args.onItemCompletionChange).toHaveBeenCalledWith(
      'first',
      true,
    )
    await expect(args.onItemRename).toHaveBeenCalledTimes(1)
    await expect(args.onItemRename).toHaveBeenCalledWith(
      'first',
      'Etapa revisada',
    )
    await expect(args.onItemMove).toHaveBeenCalledTimes(1)
    await expect(args.onItemMove).toHaveBeenCalledWith('first', 1)
    await expect(args.onItemDelete).toHaveBeenCalledTimes(1)
    await expect(args.onItemDelete).toHaveBeenCalledWith('first')
    await expect(args.onCreate).toHaveBeenCalledTimes(1)
    await expect(args.onCreate).toHaveBeenCalledWith('Nova etapa', false)
    const callOrder = [
      args.onItemCompletionChange,
      args.onItemRename,
      args.onItemMove,
      args.onItemDelete,
      args.onCreate,
    ].map((spy) => (spy ? mocked(spy).mock.invocationCallOrder[0] : 0) ?? 0)
    await expect(callOrder).toEqual([...callOrder].sort((a, b) => a - b))
  },
}

export const ReadOnlyWithoutEditingControls: Story = {
  args: { readOnly: true, title: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByRole('checkbox')).toHaveLength(2)
    await expect(canvas.queryByRole('textbox')).toBeNull()
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(canvas.queryByText('1 de 2 concluídos')).toBeNull()
  },
}

export const FlatRowsInsideOneOutlinedList: Story = {
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('[data-slot="checklist-items"]')
    const card = list?.parentElement

    await expect(list?.tagName).toBe('OL')
    await expect(card).toHaveAttribute('data-slot', 'card')
    await expect(
      canvasElement.querySelectorAll(
        'section[data-slot="checklist"] [data-slot="card"]',
      ),
    ).toHaveLength(1)
  },
}

export const OpensItemSeparatelyFromCompletion: Story = {
  args: { onItemClick: fn(), title: undefined },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Abrir Primeira etapa' }),
    )
    await expect(args.onItemClick).toHaveBeenCalledTimes(1)
    await expect(args.onItemClick).toHaveBeenCalledWith(items[0])
    await expect(args.onItemCompletionChange).not.toHaveBeenCalled()

    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Primeira etapa' }),
    )
    await expect(args.onItemCompletionChange).toHaveBeenCalledTimes(1)
    await expect(args.onItemCompletionChange).toHaveBeenCalledWith(
      'first',
      true,
    )
    await expect(args.onItemClick).toHaveBeenCalledTimes(1)
    await expect(args.onItemRename).not.toHaveBeenCalled()
    await expect(canvas.queryByRole('button', { name: /Ações de/ })).toBeNull()
  },
}

export const DelegatesAuthorAndDueDateChanges: Story = {
  args: {
    authorOptions: [
      { value: 'gabriel', label: 'Gabriel Melo', fallback: 'GM' },
      { value: 'ana', label: 'Ana Souza', fallback: 'AS' },
    ],
    items: [
      {
        completed: false,
        id: 'first',
        title: 'Primeira etapa',
        authorId: 'gabriel',
        dueDate: '2026-10-01T12:00:00.000Z',
      },
    ],
    onItemAuthorChange: fn(),
    onItemDueDateChange: fn(),
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
    await expect(args.onItemAuthorChange).toHaveBeenCalledTimes(1)
    await expect(args.onItemAuthorChange).toHaveBeenCalledWith('first', 'ana')

    await userEvent.click(canvas.getByRole('button', { name: /^Due date:/ }))
    await userEvent.click(
      await screen.findByRole('button', { name: 'Limpar data' }),
    )
    await expect(args.onItemDueDateChange).toHaveBeenCalledTimes(1)
    await expect(args.onItemDueDateChange).toHaveBeenCalledWith('first', null)
  },
}

export const RelativeDueDatesNearToday: Story = {
  args: { readOnly: true, title: undefined },
  render: (args) => {
    const utcDay = utcNoonToday()

    return (
      <Checklist
        {...args}
        items={[
          { ...items[0], dueDate: new Date(utcDay).toISOString() },
          {
            ...items[1],
            dueDate: new Date(utcDay - 86_400_000).toISOString(),
          },
        ]}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Today')).toBeVisible()
    await expect(canvas.getByText('Yesterday')).toBeVisible()
  },
}

export const CardFramesListWithHandleOutsideRow: Story = {
  args: { onItemDelete: fn(), title: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const section = canvas.getByRole('region', { name: 'Checklist' })
    const list = section.querySelector('[data-slot="checklist-items"]')
    const card = list?.parentElement as HTMLElement
    const handle = canvas.getByLabelText('Reordenar Primeira etapa')
    const item = section.querySelector(
      '[data-slot="checklist-item"]',
    ) as HTMLElement
    const cardBox = card.getBoundingClientRect()
    const itemBox = item.getBoundingClientRect()

    await expect(section).toHaveAttribute('data-variant', 'card')
    await expect(card).toHaveAttribute('data-slot', 'card')
    await expect(getComputedStyle(card).overflow).toBe('visible')
    await expect(itemBox.left).toBeGreaterThanOrEqual(cardBox.left)
    await expect(itemBox.right).toBeLessThanOrEqual(cardBox.right)
    await expect(handle.closest('[data-slot="checklist-row"]')).toBeNull()
    await expect(handle.getBoundingClientRect().right).toBeGreaterThan(
      cardBox.right,
    )
  },
}

export const PlainPutsHandleAtRowEnd: Story = {
  args: { onItemDelete: fn(), title: undefined, variant: 'plain' },
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
    await expect(section.querySelector('[data-slot="card"]')).toBeNull()
    await expect(row.contains(handle)).toBe(true)
    await expect(row.lastElementChild?.contains(handle)).toBe(true)
    const rowBox = row.getBoundingClientRect()
    const handleBox = handle.getBoundingClientRect()
    await expect(handleBox.left).toBeGreaterThanOrEqual(rowBox.left)
    await expect(handleBox.right).toBeLessThanOrEqual(rowBox.right)

    section.style.setProperty('--record-group-hover-offset', '8px')
    section.style.setProperty('--record-group-row-height', '32px')
    const listBox = (list as HTMLElement).getBoundingClientRect()
    const itemBox = item.getBoundingClientRect()
    await expect(listBox.left - itemBox.left).toBeCloseTo(8, 0)
    await expect(itemBox.right - listBox.right).toBeCloseTo(8, 0)
    await expect(row.getBoundingClientRect().height).toBeCloseTo(32, 0)
  },
}
