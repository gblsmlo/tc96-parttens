import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings10 } from '@tc96/ui/blocks/application/settings/settings-10'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { phases, stages } from '../fixtures/settings-10.ts'
import {
  type Settings10Controls,
  settings10ControlArgs,
} from './settings-10-controls.ts'
import { ComposedSettings10 } from './settings-10-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: { ...settings10ControlArgs, onStageAction: fn(), onStageCreate: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings10 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings10/Behavior',
} satisfies Meta<
  Settings10Controls & {
    onStageAction: (stageId: string, action: string) => void
    onStageCreate: (name: string, phaseId: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const StageDescriptionShowsLeadsAndClosing: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('4 leads')).toBeVisible()
    await expect(canvas.getByText('12 leads · Fecha como ganho')).toBeVisible()
    await expect(canvas.getByText('Fecha como perdido')).toBeVisible()
  },
}

export const NewStageButtonNeedsOnStageCreate: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Nova etapa' }),
    ).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
  },
}

export const StageMenuEditCallsOnStageAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Qualificação',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Editar',
      'Mover para cima',
      'Mover para baixo',
      'Excluir',
    ])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Editar' }))
    await waitFor(() =>
      expect(args.onStageAction).toHaveBeenCalledWith('qualificacao', 'edit'),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const StageMenuMoveUpCallsOnStageAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ações de Proposta' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Mover para cima' }),
    )
    await waitFor(() =>
      expect(args.onStageAction).toHaveBeenCalledWith('proposta', 'move-up'),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const StageMenuMoveDownCallsOnStageAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ações de Proposta' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Mover para baixo' }),
    )
    await waitFor(() =>
      expect(args.onStageAction).toHaveBeenCalledWith('proposta', 'move-down'),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const StageMenuDeleteCallsOnStageAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Qualificação',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Excluir' }),
    )
    await waitFor(() =>
      expect(args.onStageAction).toHaveBeenCalledWith('qualificacao', 'delete'),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const FirstAndLastStagesCannotMoveFurther: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Ações de Novo' }))
    await expect(
      await screen.findByRole('menuitem', { name: 'Mover para cima' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ações de Negociação' }),
    )
    await expect(
      await screen.findByRole('menuitem', { name: 'Mover para baixo' }),
    ).toHaveAttribute('aria-disabled', 'true')
  },
}

export const LockedStageHasOnlyEdit: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ações de Ganho' }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual(['Editar'])
  },
}

export const NewStageCallsOnStageCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Nova etapa' }),
    )
    const dialog = await screen.findByRole('dialog', { name: 'Nova etapa' })
    await userEvent.type(
      within(dialog).getByRole('textbox', { name: 'Nome da etapa' }),
      'Contrato',
    )
    await userEvent.click(
      within(dialog).getByRole('combobox', { name: /^Fase/ }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'Ganho' }))
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Criar etapa' }),
    )
    await waitFor(() =>
      expect(args.onStageCreate).toHaveBeenCalledWith('Contrato', 'ganho'),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const NewStageRejectsTakenName: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Nova etapa' }),
    )
    const dialog = await screen.findByRole('dialog', { name: 'Nova etapa' })
    const submit = within(dialog).getByRole('button', { name: 'Criar etapa' })
    await expect(submit).toBeDisabled()
    await userEvent.type(
      within(dialog).getByRole('textbox', { name: 'Nome da etapa' }),
      'proposta',
    )
    await expect(submit).toBeDisabled()
    await expect(args.onStageCreate).not.toHaveBeenCalled()
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <Settings10
      labels={{
        actions: (name) => `Opções de ${name}`,
        description: 'Cada etapa é um passo do funil.',
        newStage: 'Criar etapa',
        title: 'Funil de vendas',
      }}
      onStageAction={args.onStageAction}
      onStageCreate={args.onStageCreate}
      phases={phases}
      stages={stages}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Funil de vendas')).toBeVisible()
    await expect(
      canvas.getByText('Cada etapa é um passo do funil.'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Criar etapa' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Opções de Proposta' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Etapas do funil')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettings10 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando etapas'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettings10 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettings10 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings10 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando etapas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}
