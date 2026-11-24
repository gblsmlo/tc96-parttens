import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings16 } from '@tc96/ui/blocks/application/settings/settings-16'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { settings16CostCenters } from '../fixtures/settings-16.ts'
import {
  type Settings16Controls,
  settings16ControlArgs,
} from './settings-16-controls.ts'
import { ComposedSettings16 } from './settings-16-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settings16ControlArgs,
    onCostCenterAction: fn(),
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings16 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings16/Behavior',
} satisfies Meta<
  Settings16Controls & {
    onCostCenterAction: (costCenterId: string, action: string) => void
    onCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhum centro de custo ainda')
  },
}

export const NewCostCenterButtonCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Novo centro de custo',
      }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const NewCostCenterButtonNeedsOnCreate: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Novo centro de custo' }),
    ).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
  },
}

export const RowMenuCallsOnCostCenterAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Advocacia cível',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Editar',
      'Arquivar',
    ])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Editar' }))
    await waitFor(() =>
      expect(args.onCostCenterAction).toHaveBeenCalledWith(
        'cc-advocacia-civel',
        'edit',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ArchiveCallsOnCostCenterAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Administrativo',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Arquivar' }),
    )
    await waitFor(() =>
      expect(args.onCostCenterAction).toHaveBeenCalledWith(
        'cc-administrativo',
        'archive',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ArchivedCostCentersStayCollapsed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Arquivados')).toBeVisible()
    await expect(canvas.queryByText('Escritório antigo')).toBeNull()
    await userEvent.click(canvas.getByText('Arquivados'))
    await expect(canvas.getByText('Escritório antigo')).toBeVisible()
  },
}

export const RestoreCallsOnCostCenterAction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Arquivados'))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ações de Escritório antigo' }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual(['Restaurar'])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Restaurar' }))
    await waitFor(() =>
      expect(args.onCostCenterAction).toHaveBeenCalledWith(
        'cc-escritorio-antigo',
        'restore',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const NoArchivedSectionWithoutArchivedCostCenters: Story = {
  args: { withArchived: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByText('Arquivados')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <Settings16
      costCenters={settings16CostCenters}
      labels={{
        actions: (name) => `Opções de ${name}`,
        entries: (count) => `${count} registros`,
        newCostCenter: 'Criar centro',
        title: 'Áreas de custo',
      }}
      onCostCenterAction={args.onCostCenterAction}
      onCreate={args.onCreate}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Áreas de custo')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Criar centro' }),
    ).toBeVisible()
    await expect(canvas.getByText('34 registros')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Opções de Advocacia cível' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Centros de custo')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettings16 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando centros de custo'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettings16 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettings16 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings16 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando centros de custo'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettings16 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
