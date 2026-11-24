import { BellIcon, TagIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings9 } from '@tc96/blocks/application/settings/settings-9'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { rules } from '../fixtures/settings-9.ts'
import {
  type Settings9Controls,
  settings9ControlArgs,
} from './settings-9-controls.ts'
import { ComposedSettings9 } from './settings-9-layouts.tsx'

const meta = {
  args: { ...settings9ControlArgs, onCreate: fn(), onRuleAction: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings9/Behavior',
} satisfies Meta<
  Settings9Controls & {
    onCreate: () => void
    onRuleAction: (ruleId: string, action: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhuma regra ainda')
  },
}

export const AddRuleButtonCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar regra' }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const AddRuleNeedsOnCreate: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Adicionar regra' }),
    ).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
  },
}

export const RuleMenuEditCallsOnRuleAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Prioridade é Alta',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Editar',
      'Excluir',
    ])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Editar' }))
    await waitFor(() =>
      expect(args.onRuleAction).toHaveBeenCalledWith(
        'rule-prioridade-alta',
        'edit',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const RuleMenuDeleteCallsOnRuleAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Etapa é igual a Proposta',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Excluir' }),
    )
    await waitFor(() =>
      expect(args.onRuleAction).toHaveBeenCalledWith('rule-proposta', 'delete'),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ConditionShowsValueIcon: Story = {
  render: (args) => (
    <Settings9
      onCreate={args.onCreate}
      onRuleAction={args.onRuleAction}
      rules={[
        {
          action: { icon: BellIcon, text: 'Adicionar SLA de 2 dias úteis' },
          field: 'Etapa',
          id: 'rule-proposta',
          operator: 'é igual a',
          value: { icon: TagIcon, label: 'Proposta' },
        },
        ...rules.slice(1),
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Proposta').querySelector('svg'),
    ).not.toBeNull()
    await expect(canvas.getByText('Alta').querySelector('svg')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <Settings9
      labels={{
        actions: (field) => `Opções de ${field}`,
        addRule: 'Criar regra',
        condition: 'Critério',
        thenLabel: 'Depois',
        title: 'Automações',
        whenLabel: 'Se',
      }}
      onCreate={args.onCreate}
      onRuleAction={args.onRuleAction}
      rules={rules}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Automações')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Criar regra' }),
    ).toBeVisible()
    await expect(
      canvas.getAllByRole('group', { name: 'Critério' }),
    ).toHaveLength(3)
    await expect(canvas.getAllByText('Se')).toHaveLength(3)
    await expect(canvas.getAllByText('Depois')).toHaveLength(3)
    await expect(
      canvas.getByRole('button', { name: 'Opções de Etapa' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Regras de automação')).toBeNull()
  },
}
