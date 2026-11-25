import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog6 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-6'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { settingsCatalog6Data } from '../../fixtures/settings-catalog-6.ts'
import {
  type SettingsCatalog6Controls,
  settingsCatalog6ControlArgs,
} from './settings-catalog-6-controls.ts'
import { ComposedSettingsCatalog6 } from './settings-catalog-6-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settingsCatalog6ControlArgs,
    onBlockStageChangesChange: fn(),
    onCreate: fn(),
    onNextActionAction: fn(),
    onRequiredChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings6/Behavior',
} satisfies Meta<
  SettingsCatalog6Controls & {
    onBlockStageChangesChange: (checked: boolean) => void
    onCreate: () => void
    onNextActionAction: (actionId: string, action: string) => void
    onRequiredChange: (actionId: string, required: boolean) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const BlockStageChangesSwitchCallsOnChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('switch', {
        name: 'Bloquear mudança de etapa',
      }),
    )
    await expect(args.onBlockStageChangesChange).toHaveBeenCalledWith(
      true,
      expect.anything(),
    )
  },
}

export const BlockStageChangesSwitchShowsItsValue: Story = {
  args: { blockStageChanges: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('switch', {
        name: 'Bloquear mudança de etapa',
      }),
    ).toBeChecked()
  },
}

export const RequiredSwitchCallsOnRequiredChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('switch', {
        name: 'Obrigatória: Primeiro contato',
      }),
    )
    await expect(args.onRequiredChange).toHaveBeenCalledWith(
      settingsCatalog6Data.stages[0].actions[0].id,
      false,
    )
  },
}

export const NewActionButtonCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Nova ação' }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const NewActionNeedsOnCreate: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: 'Nova ação' })).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
    await expect(
      canvas.getByRole('switch', { name: 'Obrigatória: Primeiro contato' }),
    ).toBeVisible()
  },
}

export const ActionMenuCallsOnNextActionAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Primeiro contato',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Editar',
      'Excluir',
    ])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Editar' }))
    await waitFor(() =>
      expect(args.onNextActionAction).toHaveBeenCalledWith(
        'action-primeiro-contato',
        'edit',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ActionRowShowsItsType: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Ligação')).toBeVisible()
    await expect(canvas.getByText('Reunião')).toBeVisible()
  },
}

export const EmptyStageShowsItsText: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Leads avançam sem ações obrigatórias'),
    ).toBeVisible()
  },
}

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhuma próxima ação ainda')
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <SettingsCatalog6
      blockStageChanges={false}
      labels={{
        gatesTitle: 'Gatilhos',
        leaving: (stage) => `Deixando ${stage}`,
        newAction: 'Criar ação',
        title: 'Ações obrigatórias',
      }}
      onBlockStageChangesChange={args.onBlockStageChangesChange}
      onCreate={args.onCreate}
      onNextActionAction={args.onNextActionAction}
      onRequiredChange={args.onRequiredChange}
      stages={settingsCatalog6Data.stages}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Ações obrigatórias')).toBeVisible()
    await expect(canvas.getByText('Gatilhos')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Criar ação' }),
    ).toBeVisible()
    await expect(canvas.getByText('Deixando Novo lead')).toBeVisible()
    await expect(canvas.queryByText('Próximas ações')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsCatalog6 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando próximas ações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsCatalog6 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettingsCatalog6 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsCatalog6 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando próximas ações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettingsCatalog6 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
