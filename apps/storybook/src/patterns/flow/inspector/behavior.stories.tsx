import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FlowInspector,
  FlowInspectorDetails,
  FlowInspectorLogs,
  type FlowInspectorProps,
  FlowInspectorStatus,
  type FlowInspectorTab,
  type FlowLogEntry,
  type FlowLogFilter,
} from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  desktop,
  InspectorFrame,
  mobile,
  RendererFrame,
} from './inspector-frame.tsx'
import { StatefulInspector } from './inspector-layouts.tsx'

interface BehaviorArgs {
  onClose: () => void
  onEmptyAction: () => void
  onFilterChange: (filter: FlowLogFilter) => void
  onTabChange: (tab: FlowInspectorTab) => void
}

const meta = {
  args: {
    onClose: fn(),
    onEmptyAction: fn(),
    onFilterChange: fn(),
    onTabChange: fn(),
  },
  argTypes: {
    onClose: { control: false },
    onEmptyAction: { control: false },
    onFilterChange: { control: false },
    onTabChange: { control: false },
  },
  globals: desktop,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Inspector/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const timeout = 5000

const frame = {
  build: <p>Conteúdo do build</p>,
  children: <button type="button">Salvar passo</button>,
  logs: <p>Conteúdo dos logs</p>,
  status: <p>Conteúdo do status</p>,
  title: 'Enviar mensagem',
} satisfies Partial<FlowInspectorProps>

const Frame = ({
  onClose,
  onTabChange,
  open = true,
  tab = 'build',
  ...props
}: Readonly<
  Partial<FlowInspectorProps> & Pick<BehaviorArgs, 'onClose' | 'onTabChange'>
>) => (
  <FlowInspector
    {...frame}
    {...props}
    onClose={onClose}
    onTabChange={onTabChange}
    open={open}
    tab={tab}
  />
)

const aside = (canvasElement: HTMLElement, name = 'Detalhes do passo') =>
  within(canvasElement).getByRole('complementary', { name })

const logEntries: FlowLogEntry[] = [
  {
    description: 'Passed: 1.842 tokens',
    id: 'a',
    sequence: 1,
    status: 'success',
    stepId: 's1',
    stepName: 'Claude',
  },
  {
    description: 'Falhou ao enviar',
    id: 'b',
    sequence: 2,
    status: 'failed',
    stepId: 's2',
    stepName: 'Resend',
  },
]

export const DocksNamedAside: Story = {
  decorators: [InspectorFrame],
  render: (args) => <Frame {...args} />,
  play: async ({ canvasElement }) => {
    const panel = aside(canvasElement)
    await expect(panel).toHaveAttribute('data-docked', 'true')
    await expect(panel).not.toHaveAttribute('inert')
    await expect(panel.style.getPropertyValue('--flow-inspector-width')).toBe(
      '24rem',
    )
  },
}

export const ClosedAsideIsInert: Story = {
  decorators: [InspectorFrame],
  render: (args) => <Frame {...args} open={false} />,
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector('aside') as HTMLElement
    await expect(panel).toHaveAttribute('data-docked', 'false')
    await expect(panel).toHaveAttribute('inert')
    await expect(panel.getBoundingClientRect().width).toBe(0)
  },
}

export const WidthFromProp: Story = {
  decorators: [InspectorFrame],
  render: (args) => <Frame {...args} width="30rem" />,
  play: async ({ canvasElement }) => {
    await expect(
      aside(canvasElement).style.getPropertyValue('--flow-inspector-width'),
    ).toBe('30rem')
  },
}

export const HeaderPanelAndFooter: Story = {
  decorators: [InspectorFrame],
  render: (args) => (
    <Frame
      {...args}
      badge="Ação · send"
      icon={<svg aria-hidden="true" data-testid="icon" />}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Enviar mensagem' }),
    ).toBeVisible()
    await expect(canvas.getByText('Ação · send')).toBeVisible()
    await expect(canvas.getByTestId('icon')).toBeInTheDocument()
    await expect(canvas.getByText('Conteúdo do build')).toBeVisible()
    await expect(canvas.queryByText('Conteúdo dos logs')).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="flow-inspector-footer"]'),
    ).toContainElement(canvas.getByRole('button', { name: 'Salvar passo' }))
  },
}

export const CloseButtonCallsOnClose: Story = {
  decorators: [InspectorFrame],
  render: (args) => <Frame {...args} />,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Fechar detalhes do passo',
      }),
    )
    await expect(args.onClose).toHaveBeenCalledOnce()
  },
}

export const TabsReportChange: Story = {
  decorators: [InspectorFrame],
  render: (args) => <Frame {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      within(canvas.getByRole('tablist', { name: 'Seções do passo' }))
        .getAllByRole('tab')
        .map((tab) => tab.textContent),
    ).toEqual(['Build', 'Status', 'Logs'])
    await expect(canvas.getByRole('tab', { name: 'Build' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await userEvent.click(canvas.getByRole('tab', { name: 'Status' }))
    await expect(args.onTabChange).toHaveBeenCalledOnce()
    await expect(args.onTabChange).toHaveBeenLastCalledWith('status')
  },
}

export const TabsByKeyboard: Story = {
  decorators: [InspectorFrame],
  render: (args) => <Frame {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('tab', { name: 'Build' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: 'Status' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onTabChange).toHaveBeenCalledOnce()
    await expect(args.onTabChange).toHaveBeenLastCalledWith('status')
  },
}

export const ControlledTabPanel: Story = {
  decorators: [InspectorFrame],
  render: (args) => <Frame {...args} tab="logs" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('tab', { name: 'Logs' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(canvas.getByText('Conteúdo dos logs')).toBeVisible()
    await expect(canvas.queryByText('Conteúdo do build')).toBeNull()
  },
}

export const DisabledTabsDoNotReport: Story = {
  decorators: [InspectorFrame],
  render: (args) => <Frame {...args} disabledTabs={['status', 'logs']} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const status = canvas.getByRole('tab', { name: 'Status' })
    await expect(status).toHaveAttribute('aria-disabled', 'true')
    await expect(canvas.getByRole('tab', { name: 'Logs' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    status.click()
    canvas.getByRole('tab', { name: 'Build' }).focus()
    await userEvent.keyboard('{ArrowRight}{Enter}')
    await expect(args.onTabChange).not.toHaveBeenCalled()
  },
}

export const UnconnectedAlertInBuild: Story = {
  decorators: [InspectorFrame],
  render: (args) => <Frame {...args} unconnected />,
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(
      within(alert).getByText('Nada chega a este passo.'),
    ).toBeVisible()
    await expect(
      within(alert).getByText('Conecte um passo a este.'),
    ).toBeVisible()
  },
}

export const UnconnectedAlertOnlyInBuild: Story = {
  decorators: [InspectorFrame],
  render: (args) => <Frame {...args} tab="status" unconnected />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('alert')).toBeNull()
  },
}

export const FooterOmittedWithoutChildren: Story = {
  decorators: [InspectorFrame],
  render: (args) => <Frame {...args}>{undefined}</Frame>,
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="flow-inspector-footer"]'),
    ).toBeNull()
  },
}

export const LabelsFromProp: Story = {
  decorators: [InspectorFrame],
  render: (args) => (
    <Frame
      {...args}
      labels={{ close: 'Close step details', title: 'Step details' }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(aside(canvasElement, 'Step details')).toBeVisible()
    await expect(
      within(canvasElement).getByRole('button', { name: 'Close step details' }),
    ).toBeVisible()
  },
}

export const RenderersTakeInspectorLabels: Story = {
  decorators: [InspectorFrame],
  render: (args) => (
    <Frame
      {...args}
      build={
        <FlowInspectorDetails
          items={[{ id: 'type', label: 'Type', value: 'Action' }]}
        />
      }
      labels={{ details: 'Details' }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Details' }),
    ).toBeVisible()
  },
}

export const SheetBelowMd: Story = {
  globals: mobile,
  render: ({ onClose, onTabChange }) => (
    <StatefulInspector {...frame} onClose={onClose} onTabChange={onTabChange} />
  ),
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog', {
      name: 'Detalhes do passo',
    })
    await expect(document.querySelector('aside')).toBeNull()
    await expect(within(dialog).getByText('Conteúdo do build')).toBeVisible()
    await expect(within(dialog).getAllByRole('tab')).toHaveLength(3)
    await expect(
      within(dialog).getByRole('button', { name: 'Salvar passo' }),
    ).toBeVisible()

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Fechar detalhes do passo' }),
    )
    await expect(args.onClose).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), {
      timeout,
    })
  },
}

export const ClosedBelowMdRendersNothing: Story = {
  globals: mobile,
  render: (args) => <Frame {...args} open={false} />,
  play: async () => {
    await expect(screen.queryByRole('dialog')).toBeNull()
    await expect(document.querySelector('aside')).toBeNull()
  },
}

export const SheetEscapeCallsOnClose: Story = {
  globals: mobile,
  render: ({ onClose, onTabChange }) => (
    <StatefulInspector {...frame} onClose={onClose} onTabChange={onTabChange} />
  ),
  play: async ({ args }) => {
    await screen.findByRole('dialog', { name: 'Detalhes do passo' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(args.onClose).toHaveBeenCalledOnce())
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), {
      timeout,
    })
  },
}

export const DetailsListPairsInOrder: Story = {
  decorators: [RendererFrame],
  render: () => (
    <FlowInspectorDetails
      items={[
        { id: 'type', label: 'Tipo', value: 'Ação' },
        { id: 'name', label: 'Nome', value: 'Enviar mensagem' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', {
      name: 'Detalhes',
    })
    await expect(
      within(section)
        .getAllByRole('term')
        .map((term) => term.textContent),
    ).toEqual(['Tipo', 'Nome'])
    await expect(within(section).getByText('Enviar mensagem')).toBeVisible()
  },
}

export const DetailsSkipItemsWithoutValue: Story = {
  decorators: [RendererFrame],
  render: () => (
    <FlowInspectorDetails
      items={[
        { id: 'type', label: 'Tipo', value: 'Ação' },
        { id: 'description', label: 'Descrição' },
        { id: 'inputs', label: 'Entradas', value: null },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('Descrição')).toBeNull()
    await expect(canvas.queryByText('Entradas')).toBeNull()
    await expect(canvas.getByText('Tipo')).toBeVisible()
  },
}

export const DetailsOwnerWithInitials: Story = {
  decorators: [RendererFrame],
  render: () => (
    <FlowInspectorDetails
      items={[
        { id: 'owner', label: 'Responsável', owner: { name: 'Ana Souza' } },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Ana Souza')).toBeVisible()
    await expect(canvas.getByText('AS')).toBeVisible()
  },
}

export const DetailsHeadingFromLabels: Story = {
  decorators: [RendererFrame],
  render: () => (
    <FlowInspectorDetails
      items={[{ id: 'type', label: 'Type', value: 'Action' }]}
      labels={{ details: 'Details' }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Details' }),
    ).toBeVisible()
  },
}

export const StatusLastRunAndTestRuns: Story = {
  decorators: [RendererFrame],
  render: () => (
    <FlowInspectorStatus
      durationMs={1500}
      runId="run_1"
      stats={{ completed: 6, entered: 8 }}
      status="failed"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const last = canvas.getByRole('region', { name: 'Última execução' })
    await expect(within(last).getByText('Falhou')).toBeVisible()
    await expect(within(last).getByText('1,5 s')).toBeVisible()
    await expect(within(last).getByText('run_1')).toBeVisible()
    const tests = canvas.getByRole('region', { name: 'Execuções de teste' })
    await expect(within(tests).getByText('8')).toBeVisible()
    await expect(within(tests).getByText('6')).toBeVisible()
    await expect(within(tests).getByText('25%')).toBeVisible()
    await expect(
      canvas.queryByText('Nenhuma execução chegou a este passo.'),
    ).toBeNull()
  },
}

export const StatusOnlyGroupsItReceives: Story = {
  decorators: [RendererFrame],
  render: () => <FlowInspectorStatus status="success" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Última execução' }),
    ).toBeVisible()
    await expect(
      canvas.queryByRole('region', { name: 'Execuções de teste' }),
    ).toBeNull()
    await expect(canvas.queryByText('Duração')).toBeNull()
  },
}

export const StatusNoRunReachedStep: Story = {
  decorators: [RendererFrame],
  render: () => (
    <FlowInspectorStatus
      stats={{ completed: 0, entered: 0 }}
      status="not-run"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Nenhuma execução chegou a este passo.'),
    ).toBeVisible()
    await expect(canvas.getByText('—')).toBeVisible()
  },
}

export const LogsListEntries: Story = {
  decorators: [RendererFrame],
  render: ({ onFilterChange }) => (
    <FlowInspectorLogs
      entries={logEntries}
      filter="all"
      onFilterChange={onFilterChange}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('2 entradas')).toBeVisible()
    const items = canvas.getAllByRole('listitem')
    await expect(items).toHaveLength(2)
    const [first, second] = items as [HTMLElement, HTMLElement]
    await expect(within(first).getByText('Claude')).toBeVisible()
    await expect(within(first).getByText('#1')).toBeVisible()
    await expect(within(first).getByText('Passed: 1.842 tokens')).toBeVisible()
    await expect(
      within(second).getByRole('img', { name: 'Falhou' }),
    ).toBeInTheDocument()
  },
}

export const LogsCountOneInSingular: Story = {
  decorators: [RendererFrame],
  render: ({ onFilterChange }) => (
    <FlowInspectorLogs
      entries={logEntries.slice(0, 1)}
      filter="step"
      onFilterChange={onFilterChange}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('1 entrada')).toBeVisible()
  },
}

export const LogsFilterPressedAndReported: Story = {
  decorators: [RendererFrame],
  render: ({ onFilterChange }) => (
    <FlowInspectorLogs
      entries={logEntries}
      filter="step"
      onFilterChange={onFilterChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Filtrar logs',
    })
    const step = within(group).getByRole('button', { name: 'Este passo' })
    const all = within(group).getByRole('button', { name: 'Todos os passos' })
    await expect(step).toHaveAttribute('aria-pressed', 'true')
    await expect(all).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(all)
    await expect(args.onFilterChange).toHaveBeenCalledOnce()
    await expect(args.onFilterChange).toHaveBeenLastCalledWith('all')
  },
}

export const LogsEmptyRunsAction: Story = {
  decorators: [RendererFrame],
  render: ({ onEmptyAction, onFilterChange }) => (
    <FlowInspectorLogs
      emptyActionLabel="Executar uma vez"
      entries={[]}
      filter="all"
      onEmptyAction={onEmptyAction}
      onFilterChange={onFilterChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Sem logs ainda')).toBeVisible()
    await expect(canvas.getByText('0 entradas')).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Executar uma vez' }),
    )
    await expect(args.onEmptyAction).toHaveBeenCalledOnce()
  },
}

export const LogsEmptyActionNeedsCallback: Story = {
  decorators: [RendererFrame],
  render: ({ onFilterChange }) => (
    <FlowInspectorLogs
      emptyActionLabel="Executar uma vez"
      entries={[]}
      filter="all"
      onFilterChange={onFilterChange}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', {
        name: 'Executar uma vez',
      }),
    ).toBeNull()
  },
}
