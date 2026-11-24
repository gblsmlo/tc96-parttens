import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings12 } from '@tc96/blocks/application/settings/settings-12'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { settings12Data } from '../fixtures/settings-12.ts'
import {
  type Settings12Controls,
  settings12ControlArgs,
} from './settings-12-controls.ts'
import { ComposedSettings12 } from './settings-12-layouts.tsx'

const meta = {
  args: {
    ...settings12ControlArgs,
    onBlockStageChangesChange: fn(),
    onCreate: fn(),
    onNextActionAction: fn(),
    onRequiredChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings12 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings12/Behavior',
} satisfies Meta<
  Settings12Controls & {
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
      settings12Data.stages[0].actions[0].id,
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
    <Settings12
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
      stages={settings12Data.stages}
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
