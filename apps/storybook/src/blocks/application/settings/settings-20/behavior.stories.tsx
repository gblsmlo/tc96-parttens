import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings20 } from '@tc96/blocks/application/settings/settings-20'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  settings20Categories,
  settings20Channels,
  settings20Matrix,
} from '../fixtures/settings-20.ts'
import {
  type Settings20Controls,
  settings20ControlArgs,
} from './settings-20-controls.ts'
import { ComposedSettings20 } from './settings-20-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: { ...settings20ControlArgs, onChange: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings20 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings20/Behavior',
} satisfies Meta<Settings20Controls & { onChange: () => void }>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhum evento de notificação')
  },
}

export const FirstCategoryStartsSelected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('tab', { name: 'Leads' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(canvas.getByText('Novo lead atribuído')).toBeVisible()
    await expect(canvas.queryByText('Tarefa vence hoje')).toBeNull()
  },
}

export const TabsSwitchEvents: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Financeiro' }))
    await expect(await canvas.findByText('Fatura paga')).toBeVisible()
    await expect(canvas.queryByText('Novo lead atribuído')).toBeNull()
  },
}

export const MatrixDrivesCheckboxes: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('checkbox', { name: 'Novo lead atribuído por E-mail' }),
    ).toBeChecked()
    await expect(
      canvas.getByRole('checkbox', {
        name: 'Lead mudou de etapa por E-mail',
      }),
    ).not.toBeChecked()
  },
}

export const CheckboxCallsOnChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('checkbox', {
        name: 'Lead mudou de etapa por Push',
      }),
    )
    await expect(args.onChange).toHaveBeenCalledWith('lead-stage', 'push', true)
  },
}

export const WithoutOnChangeCheckboxesAreDisabled: Story = {
  args: { readOnly: true },
  play: async ({ canvasElement }) => {
    const boxes = within(canvasElement).getAllByRole('checkbox')
    await expect(boxes.length).toBe(6)
    for (const box of boxes)
      await expect(box).toHaveAttribute('aria-disabled', 'true')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Settings20
      categories={settings20Categories}
      channels={settings20Channels}
      labels={{
        cell: (event, channel) => `${channel}: ${event}`,
        event: 'Quando',
        title: 'Avisos',
      }}
      matrix={settings20Matrix}
      onChange={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Avisos')).toBeVisible()
    await expect(canvas.getByText('Quando')).toBeVisible()
    await expect(
      canvas.getByRole('checkbox', { name: 'Push: Novo lead atribuído' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Canais de notificação')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettings20 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando notificações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettings20 {...args} error onRetry={retryHandler} />
  ),
  play: async ({ canvasElement }) => {
    retryHandler.mockClear()
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retryHandler).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: (args) => <ComposedSettings20 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings20 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando notificações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettings20 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
