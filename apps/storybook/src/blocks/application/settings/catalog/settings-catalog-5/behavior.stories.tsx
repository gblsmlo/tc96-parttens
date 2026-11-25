import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog5 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-5'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { settingsCatalog5Groups } from '../../fixtures/settings-catalog-5.ts'
import {
  type SettingsCatalog5Controls,
  settingsCatalog5ControlArgs,
} from './settings-catalog-5-controls.ts'
import { ComposedSettingsCatalog5 } from './settings-catalog-5-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settingsCatalog5ControlArgs,
    onCreate: fn(),
    onStatusAction: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings5/Behavior',
} satisfies Meta<
  SettingsCatalog5Controls & {
    onCreate: () => void
    onStatusAction: (statusId: string, action: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const NewStatusButtonCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Novo status' }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const NewStatusNeedsOnCreate: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Novo status' }),
    ).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
  },
}

export const StatusMenuCallsOnStatusAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Em andamento',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Editar',
      'Excluir',
    ])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Excluir' }))
    await waitFor(() =>
      expect(args.onStatusAction).toHaveBeenCalledWith(
        'status-em-andamento',
        'delete',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ProjectsCountFollowsTheNumber: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('12 projetos')).toBeVisible()
    await expect(canvas.getByText('1 projeto')).toBeVisible()
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <SettingsCatalog5
      groups={settingsCatalog5Groups}
      labels={{
        actions: (name) => `Opções de ${name}`,
        newStatus: 'Criar status',
        projects: (count) => `${count} em uso`,
        title: 'Etapas',
      }}
      onCreate={args.onCreate}
      onStatusAction={args.onStatusAction}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Etapas')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Criar status' }),
    ).toBeVisible()
    await expect(canvas.getByText('12 em uso')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Opções de Em andamento' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Status de projetos')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsCatalog5 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando status'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsCatalog5 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettingsCatalog5 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsCatalog5 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando status')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}
