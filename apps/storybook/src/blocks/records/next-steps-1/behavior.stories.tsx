import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { NextSteps1Canvas } from './next-steps-1-canvas.tsx'
import {
  type NextSteps1Controls,
  nextSteps1ControlArgs,
} from './next-steps-1-controls.ts'
import { ComposedNextSteps1 } from './next-steps-1-layouts.tsx'

type BehaviorArgs = NextSteps1Controls & {
  onAction: (id: string) => void
  onDismiss: () => void
  onTask: (id: string) => void
}

const meta = {
  args: {
    ...nextSteps1ControlArgs,
    onAction: fn(),
    onDismiss: fn(),
    onTask: fn(),
  },
  decorators: [NextSteps1Canvas],
  render: (args) => <ComposedNextSteps1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Records/NextSteps1/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const regionOf = (canvasElement: HTMLElement) =>
  within(within(canvasElement).getByRole('region', { name: 'Próximos passos' }))

export const DismissCallsOnDismiss: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      regionOf(canvasElement).getByRole('button', { name: 'Dispensar' }),
    )
    await expect(args.onDismiss).toHaveBeenCalledOnce()
  },
}

export const NoDismissWithoutOnDismiss: Story = {
  args: { dismiss: false },
  play: async ({ canvasElement }) => {
    await expect(
      regionOf(canvasElement).queryByRole('button', { name: 'Dispensar' }),
    ).toBeNull()
  },
}

export const RowActionRunsFromTheList: Story = {
  play: async ({ args, canvasElement }) => {
    const list = regionOf(canvasElement).getByRole('list', {
      name: 'Andamento do cadastro',
    })
    await userEvent.click(
      within(list).getByRole('button', { name: 'Tentar de novo' }),
    )
    await expect(args.onAction).toHaveBeenCalledWith('billing')
  },
}

export const TaskCallsOnTaskWithItsId: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      regionOf(canvasElement).getByRole('button', { name: 'Convidar' }),
    )
    await expect(args.onTask).toHaveBeenCalledWith('invite')
  },
}

export const NoTasksWithoutThem: Story = {
  args: { tasks: false },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="next-steps-tasks"]'),
    ).toBeNull()
  },
}
