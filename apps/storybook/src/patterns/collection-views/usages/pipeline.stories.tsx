import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { PipelineUsage } from '../fixtures/pipeline-usage'

const meta = {
  component: PipelineUsage,
  parameters: {
    docs: {
      description: {
        component: [
          'A sales pipeline as a `KanbanView` alone: one column per stage, projected from the `stage` grouping with `projectCollection`.',
          'The toolbar follows the Tasks usage: a saved-view picker, search, a `ViewSettingsMenu` filter by owner and a create action. Each column title carries the stage total, and a drop writes the new stage through `setGroupId`, so totals follow the card.',
        ].join('\n\n'),
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Usages/Pipeline',
} satisfies Meta<typeof PipelineUsage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { initialDeals: [] },
}

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

const stage = (canvasElement: HTMLElement, name: string) =>
  within(
    within(canvasElement).getByRole('region', {
      name: new RegExp(`^${name}`),
    }),
  )

export const WinWithKeyboard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'From the handle: Space picks up Banco Aurora, the arrow moves it from Negociação to Ganho and Space drops it. The Ganho column total grows by the deal value.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      stage(canvasElement, 'Ganho').getByText(/190 mil/),
    ).toBeTruthy()

    const handle = within(canvasElement).getByRole('button', {
      name: 'Mover card Banco Aurora',
    })
    handle.focus()
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).not.toBeEmptyDOMElement())
    await userEvent.keyboard('[ArrowRight]')
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())

    await waitFor(() =>
      expect(
        stage(canvasElement, 'Ganho').getByText('Banco Aurora'),
      ).toBeTruthy(),
    )
    await expect(
      stage(canvasElement, 'Negociação').queryByText('Banco Aurora'),
    ).toBeNull()
    await expect(
      stage(canvasElement, 'Ganho').getByText(/670 mil/),
    ).toBeTruthy()
  },
}

export const AdvanceWithPointer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The pointer grabs the whole card and drops it over a card in the next stage.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await dragWithPointer(
      stage(canvasElement, 'Lead').getByText('Marcos Tavares'),
      stage(canvasElement, 'Qualificado').getByText('Paulo Nunes'),
    )
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())
    await waitFor(() =>
      expect(
        stage(canvasElement, 'Qualificado').getByText('Padaria Estrela'),
      ).toBeTruthy(),
    )
    await expect(
      stage(canvasElement, 'Lead').queryByText('Padaria Estrela'),
    ).toBeNull()
  },
}
