import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { rangeModes } from '../../fixtures/calendar-toolbar'
import { CalendarWorkspace } from '../../fixtures/calendar-workspace'

const meta = {
  argTypes: {
    defaultMode: {
      control: 'inline-radio',
      options: rangeModes.map((mode) => mode.value),
    },
  },
  component: CalendarWorkspace,
  parameters: {
    docs: {
      description: {
        component: [
          'Interaction coverage for `CalendarView` over a team mock: meetings, customer visits, focus blocks, deadlines and all-day absences in one collection.',
          'The toolbar owns the period: "Hoje" and the arrows move the `anchor`, the Dia/Semana/Mês toggle sets `mode`, and the `ViewSettingsMenu` filters by owner and type. A drop calls `onItemReschedule`, which writes the new window, and the "+N" of a full month cell opens that day through `onSelectDay`.',
        ].join('\n\n'),
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Views/Calendar/Interactions',
} satisfies Meta<typeof CalendarWorkspace>

export default meta

type Story = StoryObj<typeof meta>

const period = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="calendar-period"]')?.textContent ??
  ''

const cellOf = (canvasElement: HTMLElement, id: string) =>
  canvasElement
    .querySelector(`[data-calendar-item-id="${id}"]`)
    ?.closest('[data-calendar-date]')
    ?.getAttribute('data-calendar-date')

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

const blockHeight = (canvasElement: HTMLElement, id: string) =>
  Number.parseFloat(
    canvasElement.querySelector<HTMLElement>(`[data-calendar-item-id="${id}"]`)
      ?.parentElement?.style.height ?? '0',
  )

const HOUR_PCT = 100 / 24

export const Week: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-calendar-mode="week"]'),
    ).not.toBeNull()
    await expect(cellOf(canvasElement, 'EVT-312')).toBe('2026-10-14')
    await expect(
      canvasElement.querySelector(
        '[data-calendar-all-day-date="2026-10-15"] [data-calendar-item-id="EVT-316"]',
      ),
    ).not.toBeNull()
  },
}

export const Month: Story = {
  args: { defaultMode: 'month' },
}

export const Day: Story = {
  args: { defaultMode: 'day' },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { initialEvents: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum compromisso com esses filtros.'),
    ).toBeInTheDocument()
  },
}

export const NavigatePeriod: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The next arrow moves the anchor one week ahead and shows the customer visit on the 20th; "Hoje" brings the week of the 14th back.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const current = period(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Próximo período' }),
    )
    await waitFor(() => expect(period(canvasElement)).not.toBe(current))
    await expect(cellOf(canvasElement, 'EVT-320')).toBe('2026-10-20')
    await expect(
      canvasElement.querySelector('[data-calendar-item-id="EVT-312"]'),
    ).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Hoje' }))
    await waitFor(() => expect(period(canvasElement)).toBe(current))
    await expect(cellOf(canvasElement, 'EVT-312')).toBe('2026-10-14')
  },
}

export const SwitchRange: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The toggle switches the same collection between month, day and week.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const [label, mode] of [
      ['Mês', 'month'],
      ['Dia', 'day'],
      ['Semana', 'week'],
    ] as const) {
      await userEvent.click(canvas.getByRole('button', { name: label }))
      await waitFor(() =>
        expect(
          canvasElement.querySelector(`[data-calendar-mode="${mode}"]`),
        ).not.toBeNull(),
      )
    }
  },
}

export const OpenDayFromOverflow: Story = {
  args: { defaultMode: 'month' },
  parameters: {
    docs: {
      description: {
        story:
          'The 14th holds four events and the month shows three. The "+1" calls `onSelectDay`, and the calendar opens that day in the time grid with every event.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', {
        name: /^Mostrar todos os 4 itens de quarta/,
      }),
    )
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-calendar-mode="day"]'),
      ).not.toBeNull(),
    )
    for (const id of ['EVT-303', 'EVT-312', 'EVT-313', 'EVT-314']) {
      await expect(cellOf(canvasElement, id)).toBe('2026-10-14')
    }
  },
}

export const RescheduleWithKeyboard: Story = {
  args: { defaultMode: 'month' },
  parameters: {
    docs: {
      description: {
        story:
          'From the handle: Space picks up the customer demo, ArrowRight moves it one cell ahead (10px per press) and Space drops it. `onItemReschedule` writes the new day and the time stays the same.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const overlay = () =>
      canvasElement.ownerDocument.querySelector('[data-dnd-overlay]')

    await expect(cellOf(canvasElement, 'EVT-311')).toBe('2026-10-13')
    within(canvasElement)
      .getByRole('button', { name: 'Mover Demo para Banco Aurora' })
      .focus()
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(overlay()).not.toBeEmptyDOMElement())
    const cellWidth =
      canvasElement
        .querySelector('[data-calendar-date="2026-10-13"]')
        ?.getBoundingClientRect().width ?? 0
    for (let step = 0; step < Math.round(cellWidth / 10); step += 1) {
      await userEvent.keyboard('[ArrowRight]')
    }
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(overlay()).toBeEmptyDOMElement())

    await waitFor(() =>
      expect(cellOf(canvasElement, 'EVT-311')).toBe('2026-10-14'),
    )
    await expect(
      within(
        canvasElement.querySelector(
          '[data-calendar-item-id="EVT-311"]',
        ) as HTMLElement,
      ).getByText('10:00'),
    ).toBeInTheDocument()
  },
}

export const RescheduleWithPointer: Story = {
  args: { defaultMode: 'month' },
  parameters: {
    docs: {
      description: {
        story:
          'The pointer grabs the event itself, with no handle, and drops it on Saturday. A plain click on the same event still opens it, because the drag starts only after 5px.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const overlay = () =>
      canvasElement.ownerDocument.querySelector('[data-dnd-overlay]')
    const target = canvasElement.querySelector(
      '[data-calendar-date="2026-10-17"]',
    )
    if (!target) throw new Error('The Saturday cell did not render.')

    await expect(
      canvasElement.querySelector('[data-calendar-item-drag-handle]'),
    ).not.toBeVisible()
    await dragWithPointer(
      within(canvasElement).getByRole('button', {
        name: 'Abrir Demo para Banco Aurora',
      }),
      target,
    )
    await waitFor(() => expect(overlay()).toBeEmptyDOMElement())
    await waitFor(() =>
      expect(cellOf(canvasElement, 'EVT-311')).toBe('2026-10-17'),
    )
  },
}

export const ResizeWithPointer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The bottom edge of the customer demo is dragged down one hour, so it ends at 12:00 instead of 11:00. The top edge moves the start the same way. The moved edge lands on the 15-minute wall-clock grid of `timeZone`, and the change goes through `onItemReschedule`. The edges are pointer-only and take no tab stop.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(blockHeight(canvasElement, 'EVT-311')).toBeCloseTo(HOUR_PCT, 1)

    const handle = canvasElement.querySelector(
      '[data-calendar-item-id="EVT-311"] [data-calendar-item-resize="end"]',
    )
    if (!handle) throw new Error('The end edge did not render.')
    const column = handle.closest('[data-calendar-date]')
    if (!column) throw new Error('The day column did not render.')
    const hourPx = column.getBoundingClientRect().height / 24
    const start = center(handle)
    const pointer = {
      bubbles: true,
      button: 0,
      buttons: 1,
      cancelable: true,
      clientX: start.clientX,
      composed: true,
      isPrimary: true,
      pointerId: 1,
      pointerType: 'mouse',
    }

    handle.dispatchEvent(
      new PointerEvent('pointerdown', { ...pointer, clientY: start.clientY }),
    )
    for (let step = 1; step <= 4; step += 1) {
      handle.dispatchEvent(
        new PointerEvent('pointermove', {
          ...pointer,
          clientY: start.clientY + (hourPx * step) / 4,
        }),
      )
      await nextFrame()
    }
    handle.dispatchEvent(
      new PointerEvent('pointerup', {
        ...pointer,
        buttons: 0,
        clientY: start.clientY + hourPx,
      }),
    )

    await waitFor(() =>
      expect(blockHeight(canvasElement, 'EVT-311')).toBeCloseTo(
        HOUR_PCT * 2,
        1,
      ),
    )
  },
}

export const ResizeWithKeyboard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Keyboard resize lives on the move handle, so an event keeps two tab stops: Alt+ArrowUp/ArrowDown moves the start and Shift+ArrowUp/ArrowDown moves the end, one grid line at a time. Two Alt+ArrowUp presses start the demo at 09:30.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const handle = within(canvasElement).getByRole('button', {
      name: 'Mover Demo para Banco Aurora',
    })
    await expect(handle).toHaveAttribute(
      'aria-keyshortcuts',
      'Alt+ArrowUp Alt+ArrowDown Shift+ArrowUp Shift+ArrowDown',
    )
    handle.focus()
    await userEvent.keyboard('{Alt>}[ArrowUp][ArrowUp]{/Alt}')

    await waitFor(() =>
      expect(blockHeight(canvasElement, 'EVT-311')).toBeCloseTo(
        HOUR_PCT * 1.5,
        1,
      ),
    )
    await expect(
      within(
        canvasElement.querySelector(
          '[data-calendar-item-id="EVT-311"]',
        ) as HTMLElement,
      ).getByText('09:30'),
    ).toBeInTheDocument()
  },
}

export const FilterByType: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The type filter lives in the consumer: only customer events reach the collection, and the calendar never filters on its own.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Tipo' }))
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Cliente' }),
    )
    await userEvent.keyboard('[Escape]')

    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-calendar-item-id="EVT-312"]'),
      ).toBeNull(),
    )
    await expect(cellOf(canvasElement, 'EVT-311')).toBe('2026-10-13')
  },
}
