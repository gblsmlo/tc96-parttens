import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FLOW_STEP_TRANSFER_TYPE,
  FlowCanvas,
  type FlowStepType,
  serializeStepTransfer,
} from '@tc96/parttens'
import { expect, fn, within } from 'storybook/test'
import {
  twoSteps,
  twoStepsConnections,
  twoStepsTypes,
} from './fixtures/two-steps'

const mail: FlowStepType = { group: 'g', id: 'mail', label: 'E-mail' }

function drop(target: Element, payload: Record<string, string>) {
  const dataTransfer = new DataTransfer()
  for (const [format, value] of Object.entries(payload))
    dataTransfer.setData(format, value)
  target.dispatchEvent(
    new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      clientX: 120,
      clientY: 80,
      dataTransfer,
    }),
  )
}

async function pane(canvasElement: HTMLElement): Promise<Element> {
  await within(canvasElement).findByRole('group', {
    name: 'Enviar e-mail, E-mail, Não executado',
  })
  return canvasElement.querySelector('.react-flow') as Element
}

const meta = {
  args: {
    className: 'h-96 rounded-xl border',
    connections: twoStepsConnections,
    onStepDrop: fn(),
    stepTypes: twoStepsTypes,
    steps: twoSteps,
  },
  component: FlowCanvas,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Canvas/Drop',
} satisfies Meta<typeof FlowCanvas>

export default meta
type Story = StoryObj<typeof meta>

export const CallsOnStepDropWithTypeAndPosition: Story = {
  play: async ({ args, canvasElement }) => {
    drop(await pane(canvasElement), {
      [FLOW_STEP_TRANSFER_TYPE]: serializeStepTransfer(mail),
    })
    await expect(args.onStepDrop).toHaveBeenCalledTimes(1)
    await expect(args.onStepDrop).toHaveBeenCalledWith(mail, {
      x: expect.any(Number),
      y: expect.any(Number),
    })
    const position = (args.onStepDrop as ReturnType<typeof fn>).mock
      .calls[0]?.[1] as { x: number; y: number }
    await expect(Number.isFinite(position.x)).toBe(true)
    await expect(Number.isFinite(position.y)).toBe(true)
  },
}

export const IgnoresDropWithoutValidPayload: Story = {
  play: async ({ args, canvasElement }) => {
    const target = await pane(canvasElement)
    drop(target, { 'text/plain': 'x' })
    drop(target, { [FLOW_STEP_TRANSFER_TYPE]: 'not json' })
    await expect(args.onStepDrop).not.toHaveBeenCalled()
  },
}

export const IgnoresDropWhileLocked: Story = {
  args: { locked: true },
  play: async ({ args, canvasElement }) => {
    drop(await pane(canvasElement), {
      [FLOW_STEP_TRANSFER_TYPE]: serializeStepTransfer(mail),
    })
    await expect(args.onStepDrop).not.toHaveBeenCalled()
  },
}
