import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings13 } from '@tc96/blocks/application/settings/settings-13'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { settings13Data } from '../fixtures/settings-13.ts'
import {
  type Settings13Controls,
  settings13ControlArgs,
} from './settings-13-controls.ts'
import { ComposedSettings13 } from './settings-13-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settings13ControlArgs,
    onAllowCustomReasonChange: fn(),
    onCreate: fn(),
    onReasonAction: fn(),
    onRequireReasonChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings13 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings13/Behavior',
} satisfies Meta<
  Settings13Controls & {
    onAllowCustomReasonChange: (checked: boolean) => void
    onCreate: () => void
    onReasonAction: (reasonId: string, action: string) => void
    onRequireReasonChange: (checked: boolean) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const RequireReasonSwitchCallsOnRequireReasonChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('switch', {
        name: 'Exigir motivo de perda',
      }),
    )
    await expect(args.onRequireReasonChange).toHaveBeenCalledWith(
      true,
      expect.anything(),
    )
  },
}

export const AllowCustomReasonSwitchCallsOnChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('switch', {
        name: 'Permitir motivo personalizado',
      }),
    )
    await expect(args.onAllowCustomReasonChange).toHaveBeenCalledWith(
      false,
      expect.anything(),
    )
  },
}

export const NewReasonButtonCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Novo motivo' }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const NewReasonNeedsOnCreate: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Novo motivo' }),
    ).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
    await expect(
      canvas.getByRole('switch', { name: 'Exigir motivo de perda' }),
    ).toBeVisible()
  },
}

export const ReasonMenuCallsOnReasonAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Preço acima do orçamento',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Editar',
      'Arquivar',
      'Excluir',
    ])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Arquivar' }))
    await waitFor(() =>
      expect(args.onReasonAction).toHaveBeenCalledWith(
        'reason-preco',
        'archive',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ArchivedReasonsStartCollapsed: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Arquivados' }),
    ).toHaveAttribute('aria-expanded', 'false')
  },
}

export const ArchivedReasonMenuRestoresOnReasonAction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Arquivados' }))
    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Ações de Sem interesse no momento',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Restaurar',
      'Excluir',
    ])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Restaurar' }))
    await waitFor(() =>
      expect(args.onReasonAction).toHaveBeenCalledWith(
        'reason-sem-interesse',
        'restore',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ArchivedCollapsibleNeedsArchivedReasons: Story = {
  args: { withArchived: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Arquivados' }),
    ).toBeNull()
  },
}

export const ReasonRowsShowTheLeadsLost: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('14 leads perdidos')).toBeVisible()
    await expect(canvas.getByText('1 lead perdido')).toBeVisible()
  },
}

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true, withArchived: false },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhum motivo de perda ainda')
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <Settings13
      allowCustomReason={true}
      archivedReasons={settings13Data.archivedReasons}
      labels={{
        actions: (name) => `Opções de ${name}`,
        allowCustomReason: 'Motivo livre',
        archived: 'Descartados',
        newReason: 'Criar motivo',
        title: 'Perdas',
      }}
      onAllowCustomReasonChange={args.onAllowCustomReasonChange}
      onCreate={args.onCreate}
      onReasonAction={args.onReasonAction}
      onRequireReasonChange={args.onRequireReasonChange}
      reasons={settings13Data.reasons}
      requireReason={false}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Perdas')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Criar motivo' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('switch', { name: 'Motivo livre' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Descartados' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Opções de Sem resposta' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Motivos de perda')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettings13 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando motivos'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettings13 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettings13 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings13 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando motivos')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettings13 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
