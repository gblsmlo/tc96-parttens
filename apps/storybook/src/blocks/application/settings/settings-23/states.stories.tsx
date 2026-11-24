import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  type Settings23Controls,
  settings23ControlArgs,
} from './settings-23-controls.ts'
import { ComposedSettings23 } from './settings-23-layouts.tsx'

const meta = {
  args: { ...settings23ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings23 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings23/States',
} satisfies Meta<
  Settings23Controls & {
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
      within(canvasElement).getByLabelText('Carregando cobrança'),
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
  args: { emptyInvoices: true },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-kind="empty"]'),
    ).toBeInTheDocument()
  },
}
