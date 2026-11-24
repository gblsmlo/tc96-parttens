import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  type Settings7Controls,
  settings7ControlArgs,
} from './settings-7-controls.ts'
import { ComposedSettings7 } from './settings-7-layouts.tsx'

const meta = {
  args: { ...settings7ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings7/States',
} satisfies Meta<
  Settings7Controls & {
    error?: boolean
    onRetry: () => void
    pending?: boolean
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const [heading] = within(canvasElement).getAllByRole('heading')
    await expect(heading).toBeVisible()
    await expect(canvasElement.querySelector('[aria-busy]')).toBeNull()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando tags'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

export const Empty: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-kind="empty"]'),
    ).toBeInTheDocument()
  },
}
