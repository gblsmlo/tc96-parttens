import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Flow2Actions,
  Flow2Menu,
} from '@tc96/ui/blocks/application/flow/flow-2/partials'
import { fn } from 'storybook/test'
import { withAppShell } from '../../../../../templates/fixtures/app-shell'

const meta = {
  args: {
    breadcrumbs: [{ href: '/agents', label: 'Agentes' }],
    name: 'Agente de cobrança',
    onAddStep: fn(),
    onAskAi: fn(),
    onRun: fn(),
  },
  component: Flow2Actions,
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <Flow2Actions {...args}>
      <Flow2Menu
        onClearResults={fn()}
        onCopyJson={fn()}
        onRestoreExample={fn()}
      />
    </Flow2Actions>
  ),
  tags: ['!autodocs'],
  title: 'Blocks/Application/Flow/Flow2/Partials/Actions',
} satisfies Meta<typeof Flow2Actions>

export default meta

type Story = StoryObj<typeof meta>

export const InPage: Story = {}

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
}

export const Running: Story = {
  args: { running: true },
}

export const Locked: Story = {
  args: { addStepDisabled: true },
}
