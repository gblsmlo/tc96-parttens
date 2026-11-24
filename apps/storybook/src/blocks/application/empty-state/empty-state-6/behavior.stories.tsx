import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState6 } from '@tc96/blocks/application/empty-state/empty-state-6'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { tabs } from '../fixtures/empty-state-6.ts'
import {
  type EmptyState6Controls,
  emptyState6ControlArgs,
} from './empty-state-6-controls.ts'
import { ComposedEmptyState6 } from './empty-state-6-layouts.tsx'

const meta = {
  args: emptyState6ControlArgs,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedEmptyState6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState6/Behavior',
} satisfies Meta<EmptyState6Controls>

export default meta

type Story = StoryObj<typeof meta>

export const EachTabIsInTheTabList: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('tablist', { name: 'Configurações' }),
    ).toBeVisible()
    await expect(canvas.getAllByRole('tab')).toHaveLength(3)
  },
}

export const TheSelectedTabShowsItsOwnPrompt: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('tab', { name: 'Notificações' }),
    ).toHaveAttribute('aria-selected', 'true')
    await expect(
      canvas.getByText('Nenhuma notificação configurada'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Configurar notificações' }),
    ).toBeVisible()
  },
}

export const ChoosingATabSwapsThePrompt: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Segurança' }))
    await expect(
      canvas.getByText('Sua conta ainda não tem proteção extra'),
    ).toBeVisible()
    await waitFor(() => expect(canvas.getAllByRole('tabpanel')).toHaveLength(1))
  },
}

const onTabChange = fn()

export const ChoosingATabCallsOnTabChange: Story = {
  render: () => (
    <EmptyState6
      onSetup={() => {}}
      onTabChange={onTabChange}
      tab="notifications"
      tabs={tabs}
    />
  ),
  play: async ({ canvasElement }) => {
    onTabChange.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('tab', { name: 'Integrações' }),
    )
    await expect(onTabChange).toHaveBeenCalledWith('integrations')
  },
}

const onSetup = fn()

export const TheActionCallsOnSetupWithTheTabId: Story = {
  render: () => (
    <EmptyState6
      onSetup={onSetup}
      onTabChange={() => {}}
      tab="security"
      tabs={tabs}
    />
  ),
  play: async ({ canvasElement }) => {
    onSetup.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ativar verificação em duas etapas',
      }),
    )
    await expect(onSetup).toHaveBeenCalledWith('security')
  },
}

export const TheTabIsControlled: Story = {
  render: () => (
    <EmptyState6
      onSetup={() => {}}
      onTabChange={() => {}}
      tab="integrations"
      tabs={tabs}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Segurança' }))
    await expect(
      canvas.getByRole('tab', { name: 'Integrações' }),
    ).toHaveAttribute('aria-selected', 'true')
  },
}

export const LabelsOverrideTexts: Story = {
  args: { tabs: 'Preferências' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('tablist', { name: 'Preferências' }),
    ).toBeVisible()
  },
}
