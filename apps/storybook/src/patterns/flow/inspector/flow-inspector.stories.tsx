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
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Textarea } from '@tc96/ui/textarea'
import { MailIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'

const usage = `
import {
  FlowInspector,
  FlowInspectorDetails,
  FlowInspectorLogs,
  FlowInspectorStatus,
} from '@acme/patterns'

<FlowInspector
  badge="Ação · send_email"
  build={<FlowInspectorDetails items={details} />}
  icon={<MailIcon />}
  logs={<FlowInspectorLogs entries={entries} filter={filter} onFilterChange={setFilter} />}
  onClose={() => setOpen(false)}
  onTabChange={setTab}
  open={open}
  status={<FlowInspectorStatus status="success" stats={stats} />}
  tab={tab}
  title="Enviar e-mail"
>
  <Button variant="outline">Editar passo</Button>
</FlowInspector>
`

const docs = {
  api: [
    {
      description:
        'The panel of a step. From `md` it is an `aside` named `Detalhes do passo` that docks to the right with the width of `--flow-inspector-width` (`width`, `24rem` by default); closed it has zero width and is `inert`. Below `md` it opens a COSS `Sheet` with the same content and `onClose` runs when the Sheet is dismissed. The header takes the `icon`, the `title`, a `badge` and the consumer `headerActions`, and always ends with the close button. The COSS `Tabs` are controlled by `tab` and `onTabChange`; `disabledTabs` disables some of them. `build`, `status` and `logs` are the content of each tab, `children` is the footer and `unconnected` shows the alert in Build.',
      name: 'FlowInspector',
    },
    {
      description:
        'The Detalhes list: `items` are label and value pairs, an item with an `owner` shows an avatar and the name, and an item with neither value nor owner is not rendered.',
      name: 'FlowInspectorDetails',
    },
    {
      description:
        'The Última execução group (`status`, `durationMs`, `runId`) and the Execuções de teste group (`stats`: entered and completed, with the abandonment computed). Each group renders only when it receives data; a step no run reached shows the note.',
      name: 'FlowInspectorStatus',
    },
    {
      description:
        'The log list for a step or for every step. `entries` arrive already filtered; `filter` and `onFilterChange` drive the Este passo and Todos os passos toggle. With no entries it shows the empty state, and the action runs `onEmptyAction`.',
      name: 'FlowInspectorLogs',
    },
  ],
  description: {
    component:
      'A controlled side panel for the details of a flow step. The consumer owns the open state, the tab, the filter, the form and every action; the pattern renders the frame and the read-only views.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const typeOptions = [
  { label: 'Enviar e-mail', value: 'send-email' },
  { label: 'Filtrar', value: 'filter' },
  { label: 'Aguardar', value: 'delay' },
]

const ownerOptions = [
  { label: 'Ana Souza', value: 'ana' },
  { label: 'Bruno Lima', value: 'bruno' },
]

const entries: FlowLogEntry[] = [
  {
    description: 'Passed: 1.842 tokens, USD 0,031',
    id: 'log-1',
    sequence: 1,
    status: 'success',
    stepId: 'model',
    stepName: 'Claude',
  },
  {
    description: 'Falhou: caixa de entrada inválida',
    id: 'log-2',
    sequence: 2,
    status: 'failed',
    stepId: 'send-email',
    stepName: 'Enviar e-mail',
  },
  {
    description: 'Branch not taken',
    id: 'log-3',
    sequence: 3,
    status: 'skipped',
    stepId: 'slack',
    stepName: 'Avisar no Slack',
  },
]

const onFilterChange = fn((_filter: FlowLogFilter) => {})
const onEmptyAction = fn(() => {})

function StepForm({
  name = '',
  autoFocus = false,
}: Readonly<{ autoFocus?: boolean; name?: string }>) {
  return (
    <form className="flex flex-col gap-4" noValidate>
      <Field>
        <FieldLabel>Tipo</FieldLabel>
        <Select defaultValue="send-email" items={typeOptions}>
          <SelectTrigger autoFocus={autoFocus}>
            <SelectValue />
          </SelectTrigger>
          <SelectPopup alignItemWithTrigger={false}>
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </Field>
      <Field>
        <FieldLabel>Nome</FieldLabel>
        <Input defaultValue={name} required />
      </Field>
      <Field>
        <FieldLabel>Descrição</FieldLabel>
        <Textarea defaultValue="" />
      </Field>
      <Field>
        <FieldLabel>Responsável</FieldLabel>
        <Select defaultValue="ana" items={ownerOptions}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectPopup alignItemWithTrigger={false}>
            {ownerOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </Field>
    </form>
  )
}

function LogsPanel({
  items = entries,
  withAction = false,
}: Readonly<{ items?: readonly FlowLogEntry[]; withAction?: boolean }>) {
  const [filter, setFilter] = useState<FlowLogFilter>('step')
  return (
    <FlowInspectorLogs
      emptyActionLabel="Executar uma vez"
      entries={items}
      filter={filter}
      onEmptyAction={withAction ? onEmptyAction : undefined}
      onFilterChange={(next) => {
        onFilterChange(next)
        setFilter(next)
      }}
    />
  )
}

const details = (
  <FlowInspectorDetails
    items={[
      { id: 'type', label: 'Tipo', value: 'Enviar e-mail' },
      { id: 'name', label: 'Nome', value: 'Enviar cobrança' },
      {
        id: 'description',
        label: 'Descrição',
        value:
          'Envia ao cliente um e-mail com o link de pagamento e o resumo das faturas em aberto, e tenta de novo depois de uma hora se o provedor recusar a entrega.',
      },
      {
        id: 'owner',
        label: 'Responsável',
        owner: { name: 'Ana Souza' },
      },
      { id: 'inputs', label: 'Entradas', value: '1 passo' },
      { id: 'outputs', label: 'Saídas', value: '2 passos' },
    ]}
  />
)

const status = (
  <FlowInspectorStatus
    durationMs={1800}
    runId="run_8f21"
    stats={{ completed: 6, entered: 8 }}
    status="failed"
  />
)

const viewFooter = (
  <>
    <Button variant="outline">Editar passo</Button>
    <Button>Próximo passo →</Button>
  </>
)

const formFooter = (label: string) => (
  <>
    <Button variant="outline">Cancelar</Button>
    <Button>{label}</Button>
  </>
)

const meta = {
  args: {
    badge: 'Visualizando',
    build: details,
    children: viewFooter,
    headerActions: (
      <Button aria-label="Excluir passo" size="icon-sm" variant="ghost">
        <Trash2Icon aria-hidden="true" />
      </Button>
    ),
    icon: <MailIcon />,
    logs: <LogsPanel />,
    onClose: fn(() => {}),
    onTabChange: fn((_tab: FlowInspectorTab) => {}),
    open: true,
    status,
    tab: 'build',
    title: 'Enviar cobrança',
  },
  argTypes: {
    tab: { control: 'inline-radio', options: ['build', 'status', 'logs'] },
    open: { control: 'boolean' },
    unconnected: { control: 'boolean' },
    width: { control: 'text' },
  },
  component: FlowInspector,
  decorators: [
    (Story) => (
      <div className="flex h-160 justify-end overflow-hidden rounded-lg border">
        <Story />
      </div>
    ),
  ],
  globals: { viewport: { isRotated: false, value: 'desktop' } },
  parameters: { docs, layout: 'padded' },
  render: function Inspector({
    onClose,
    onTabChange,
    open: initialOpen,
    tab: initialTab,
    ...args
  }: FlowInspectorProps) {
    const [tab, setTab] = useState(initialTab)
    const [open, setOpen] = useState(initialOpen)
    return (
      <FlowInspector
        key={`${initialTab}-${initialOpen}`}
        {...args}
        onClose={() => {
          onClose()
          setOpen(false)
        }}
        onTabChange={(next) => {
          onTabChange(next)
          setTab(next)
        }}
        open={open}
        tab={tab}
      />
    )
  },
  title: 'Patterns/Flow/Inspector',
} satisfies Meta<typeof FlowInspector>

export default meta

type Story = StoryObj<typeof meta>

const screen = () => within(document.body)

export const View: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const aside = canvas.getByRole('complementary', {
      name: 'Detalhes do passo',
    })
    await expect(aside).toHaveAttribute('data-docked', 'true')
    await expect(canvas.getByText('Ana Souza')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Fechar detalhes do passo' }),
    ).toBeVisible()
  },
}

export const Edit: Story = {
  args: {
    badge: 'Enviar e-mail · send-email',
    build: <StepForm autoFocus name="Enviar cobrança" />,
    children: formFooter('Salvar passo'),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() =>
      expect(canvas.getByRole('combobox', { name: 'Tipo' })).toHaveFocus(),
    )
    await expect(canvas.getByRole('textbox', { name: 'Nome' })).toBeRequired()

    const build = canvas.getByRole('tab', { name: 'Build' })
    build.focus()
    await userEvent.keyboard('{ArrowRight}{Enter}')
    await expect(args.onTabChange).toHaveBeenCalledWith('status')
    await waitFor(() =>
      expect(canvas.getByRole('tab', { name: 'Status' })).toHaveAttribute(
        'aria-selected',
        'true',
      ),
    )
  },
}

export const Create: Story = {
  args: {
    badge: 'Ainda não adicionado',
    build: <StepForm autoFocus />,
    children: formFooter('Adicionar passo'),
    headerActions: undefined,
    title: 'Novo passo',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('tab', { name: 'Status' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    await expect(canvas.getByRole('tab', { name: 'Logs' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    canvas.getByRole('tab', { name: 'Build' }).focus()
    await userEvent.keyboard('{ArrowRight}{Enter}')
    await expect(args.onTabChange).not.toHaveBeenCalled()
  },
  render: (args) => (
    <FlowInspector
      {...args}
      disabledTabs={['status', 'logs']}
      onClose={args.onClose}
      onTabChange={args.onTabChange}
    />
  ),
}

export const StatusTab: Story = {
  args: { tab: 'status' },
  name: 'Status',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Falhou')).toBeVisible()
    await expect(canvas.getByText('1,8 s')).toBeVisible()
    await expect(canvas.getByText('25%')).toBeVisible()
  },
}

export const Logs: Story = {
  args: { tab: 'logs' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('3 entradas')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Todos os passos' }),
    )
    await expect(onFilterChange).toHaveBeenCalledWith('all')
  },
}

export const LogsEmpty: Story = {
  args: { logs: <LogsPanel items={[]} withAction />, tab: 'logs' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Sem logs ainda')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Executar uma vez' }),
    )
    await expect(onEmptyAction).toHaveBeenCalled()
  },
}

export const WithAlert: Story = {
  args: { unconnected: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Nada chega a este passo.',
    )
  },
}

export const Sheet: Story = {
  args: {
    badge: 'Enviar e-mail · send-email',
    build: <StepForm name="Enviar cobrança" />,
    children: formFooter('Salvar passo'),
  },
  decorators: [],
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  parameters: { layout: 'fullscreen' },
  play: async ({ args }) => {
    const dialog = await screen().findByRole('dialog', {
      name: 'Detalhes do passo',
    })
    await expect(within(dialog).getAllByRole('tab')).toHaveLength(3)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(args.onClose).toHaveBeenCalled())
    await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())
  },
}
