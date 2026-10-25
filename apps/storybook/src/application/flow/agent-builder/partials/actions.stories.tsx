import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AgentBuilderActions,
  AgentBuilderMenu,
} from '@tc96/templates/application/flow/agent-builder/partials'
import { expect, fn, within } from 'storybook/test'
import { withAppShell } from '../../../../templates/fixtures/app-shell'

const meta = {
  args: {
    breadcrumbs: [{ href: '/agents', label: 'Agentes' }],
    name: 'Agente de cobrança',
    onAddStep: fn(),
    onAskAi: fn(),
    onRun: fn(),
  },
  component: AgentBuilderActions,
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <AgentBuilderActions {...args}>
      <AgentBuilderMenu
        onClearResults={fn()}
        onCopyJson={fn()}
        onRestoreExample={fn()}
      />
    </AgentBuilderActions>
  ),
  tags: ['!autodocs'],
  title: 'Application/Flow/AgentBuilder/Partials/Actions',
} satisfies Meta<typeof AgentBuilderActions>

export default meta

type Story = StoryObj<typeof meta>

export const InPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Agente de cobrança')).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(
      canvas.getByRole('button', { name: 'Executar teste' }),
    ).toBeEnabled()
  },
}

export const InAppHeader: Story = {
  decorators: [
    withAppShell({
      actionsArg: 'actionsContainer',
      breadcrumbs: [
        { href: '/agents', label: 'Agentes' },
        { label: 'Agente de cobrança' },
      ],
      href: '/agents',
      padded: false,
      root: false,
    }),
  ],
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getAllByRole('banner')[0]
    await expect(
      await within(header).findByRole('button', { name: 'Executar teste' }),
    ).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-slot="flow-page-header"]'),
    ).toBeNull()
  },
}

export const Running: Story = {
  args: { running: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Executar teste' }),
    ).toBeDisabled()
  },
}

export const Locked: Story = {
  args: { addStepDisabled: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Adicionar passo' }),
    ).toBeDisabled()
  },
}
