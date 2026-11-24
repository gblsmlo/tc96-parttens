import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  type Settings13Controls,
  settings13ControlArgs,
} from './settings-13-controls.ts'
import { ComposedSettings13 } from './settings-13-layouts.tsx'

const meta = {
  args: { ...settings13ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings13 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings13/States',
} satisfies Meta<
  Settings13Controls & {
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
      within(canvasElement).getByLabelText('Carregando motivos'),
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
