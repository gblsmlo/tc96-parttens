import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings18 } from '@tc96/blocks/application/settings/settings-18'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { capabilities, roles } from '../fixtures/settings-18.ts'
import {
  type Settings18Controls,
  settings18ControlArgs,
} from './settings-18-controls.ts'
import { ComposedSettings18 } from './settings-18-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settings18ControlArgs,
    onCapabilityChange: fn(),
    onRoleChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings18 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings18/Behavior',
} satisfies Meta<
  Settings18Controls & {
    onCapabilityChange: (capabilityId: string, checked: boolean) => void
    onRoleChange: (role: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const CapabilitySwitchCallsOnCapabilityChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('switch', { name: 'Gerenciar membros' })
    await expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    await expect(args.onCapabilityChange).toHaveBeenCalledWith(
      'manage-members',
      true,
    )
    await expect(toggle).toBeChecked()
  },
}

export const CardsShowCapabilityTitleAndDescription: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4)
    await expect(canvas.getByText('Editar leads')).toBeVisible()
    await expect(
      canvas.getByText('Alterar plano, cartão e notas fiscais.'),
    ).toBeVisible()
  },
}

export const RoleSelectCallsOnRoleChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Função' }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Administrador' }),
    )
    await waitFor(() => expect(args.onRoleChange).toHaveBeenCalledWith('admin'))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expect(
      canvas.getByRole('switch', { name: 'Gerenciar membros' }),
    ).toBeChecked()
  },
}

export const RoleSelectShowsRoleValue: Story = {
  render: () => (
    <Settings18
      capabilities={capabilities}
      roles={roles}
      selectedRole="viewer"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'Função' }),
    ).toHaveTextContent('Leitor')
  },
}

export const EmptyCapabilitiesShowStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhuma capacidade')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Settings18
      capabilities={capabilities}
      labels={{ role: 'Papel', title: 'Acessos' }}
      roles={roles}
      selectedRole="editor"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Acessos')).toBeVisible()
    await expect(canvas.getByRole('combobox', { name: 'Papel' })).toBeVisible()
    await expect(canvas.queryByText('Permissões')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettings18 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando permissões'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettings18 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettings18 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings18 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando permissões'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettings18 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
