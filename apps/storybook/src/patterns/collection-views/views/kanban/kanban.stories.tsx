import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { renderTaskKanbanCard } from '../../fixtures/task-renderers'
import { initialTasks } from '../../fixtures/tasks'
import { TaskBoard } from './kanban-tasks'

const meta = {
  component: TaskBoard,
  parameters: {
    docs: {
      description: {
        component:
          'Task board by status over the shared collection-views mock.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
  title: 'Patterns/CollectionViews/Views/Kanban/Usages/Todo',
} satisfies Meta<typeof TaskBoard>

export default meta

type Story = StoryObj<typeof meta>

export const Card: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <div className="w-80 p-4">
      {renderTaskKanbanCard('status', () => undefined)(initialTasks[0])}
    </div>
  ),
}

export const Board: Story = {}

const nextFrame = () =>
  new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)))

function center(element: Element) {
  const { height, left, top, width } = element.getBoundingClientRect()
  return { clientX: left + width / 2, clientY: top + height / 2 }
}

async function dragWithPointer(from: Element, to: Element) {
  const pointer = {
    bubbles: true,
    button: 0,
    buttons: 1,
    cancelable: true,
    composed: true,
    isPrimary: true,
    pointerId: 1,
    pointerType: 'mouse',
  }
  const start = center(from)
  const end = center(to)
  const steps = 12

  from.dispatchEvent(new PointerEvent('pointerdown', { ...pointer, ...start }))
  for (let step = 1; step <= steps; step += 1) {
    document.dispatchEvent(
      new PointerEvent('pointermove', {
        ...pointer,
        clientX: start.clientX + ((end.clientX - start.clientX) * step) / steps,
        clientY: start.clientY + ((end.clientY - start.clientY) * step) / steps,
      }),
    )
    await nextFrame()
    await nextFrame()
  }
  document.dispatchEvent(
    new PointerEvent('pointerup', { ...pointer, buttons: 0, ...end }),
  )
}

const dragOverlay = () => document.querySelector('[data-dnd-overlay]')

function cardHandles(canvasElement: HTMLElement, column: string) {
  return within(
    within(canvasElement).getByRole('region', { name: column }),
  ).queryAllByRole('button', { name: /^Mover card / })
}

async function expectColumnCards(
  canvasElement: HTMLElement,
  column: string,
  cards: string[],
) {
  await waitFor(() =>
    expect(
      cardHandles(canvasElement, column)
        .map((handle) => handle.getAttribute('aria-label'))
        .sort(),
    ).toEqual(cards.map((card) => `Mover card ${card}`).sort()),
  )
}

const BACKLOG_AFTER_MOVE = ['Instrumentar analytics']
const TODO_AFTER_MOVE = [
  'Notificações push',
  'Entregar design do checkout',
  'Testes E2E do checkout',
  'Code freeze da versão 2.0',
  'Material das lojas',
  'Demo da beta',
]

export const MoveWithKeyboard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'From the handle: Space picks up the card, the arrow moves it to the neighbouring column and Space drops it.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const handle = within(canvasElement).getByRole('button', {
      name: 'Mover card Notificações push',
    })

    handle.focus()
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).not.toBeEmptyDOMElement())
    await userEvent.keyboard('[ArrowRight]')
    await expectColumnCards(canvasElement, 'A fazer', TODO_AFTER_MOVE)
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())
    await expectColumnCards(canvasElement, 'Backlog', BACKLOG_AFTER_MOVE)
    await expectColumnCards(canvasElement, 'A fazer', TODO_AFTER_MOVE)
  },
}

export const MoveWithPointer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The pointer grabs the whole card and drops it over a card in another column.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await dragWithPointer(
      within(canvas.getByRole('region', { name: 'Backlog' })).getByText(
        'Disparo de push transacional para pedidos e lembretes.',
      ),
      within(canvas.getByRole('region', { name: 'A fazer' })).getByText(
        'Telas finais de checkout e estados de erro no Figma.',
      ),
    )
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())
    await expectColumnCards(canvasElement, 'Backlog', BACKLOG_AFTER_MOVE)
    await expect(
      cardHandles(canvasElement, 'A fazer').map((handle) =>
        handle.getAttribute('aria-label'),
      ),
    ).toContain('Mover card Notificações push')
  },
}
