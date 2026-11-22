import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowInspectorDetails, FlowInspectorStatus } from '@tc96/parttens'
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
import { MailIcon } from 'lucide-react'
import { expect, screen, within } from 'storybook/test'
import {
  lastRun,
  logEntries,
  stepDetails,
  testRunStats,
} from './inspector-data.ts'
import { desktop, InspectorFrame, mobile } from './inspector-frame.tsx'
import {
  DeleteStepButton,
  LogsPanel,
  StatefulInspector,
} from './inspector-layouts.tsx'

const meta = {
  decorators: [InspectorFrame],
  globals: desktop,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Inspector/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const typeOptions = [
  { label: 'Enviar e-mail', value: 'send-email' },
  { label: 'Filtrar', value: 'filter' },
  { label: 'Aguardar', value: 'delay' },
]

const ownerOptions = [
  { label: 'Ana Souza', value: 'ana' },
  { label: 'Bruno Lima', value: 'bruno' },
]

function StepForm({
  autoFocus = false,
  name = '',
}: Readonly<{ autoFocus?: boolean; name?: string }>) {
  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={(event) => event.preventDefault()}
    >
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

const status = (
  <FlowInspectorStatus {...lastRun} stats={testRunStats} status="failed" />
)

const logs = <LogsPanel entries={logEntries} stepId="send-email" />

const formFooter = (label: string) => (
  <>
    <Button variant="outline">Cancelar</Button>
    <Button>{label}</Button>
  </>
)

export const ViewStep: Story = {
  render: () => (
    <StatefulInspector
      badge="Visualizando"
      build={<FlowInspectorDetails items={stepDetails} />}
      headerActions={<DeleteStepButton />}
      icon={<MailIcon />}
      logs={logs}
      status={status}
      title="Enviar cobrança"
    >
      <Button variant="outline">Editar passo</Button>
      <Button>Próximo passo</Button>
    </StatefulInspector>
  ),
  play: async ({ canvasElement }) => {
    const panel = within(canvasElement).getByRole('complementary', {
      name: 'Detalhes do passo',
    })
    await expect(within(panel).getByText('Ana Souza')).toBeVisible()
  },
}

export const EditStep: Story = {
  render: () => (
    <StatefulInspector
      badge="Enviar e-mail · send-email"
      build={<StepForm autoFocus name="Enviar cobrança" />}
      headerActions={<DeleteStepButton />}
      icon={<MailIcon />}
      logs={logs}
      status={status}
      title="Enviar cobrança"
    >
      {formFooter('Salvar passo')}
    </StatefulInspector>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Nome' }),
    ).toHaveValue('Enviar cobrança')
  },
}

export const CreateStep: Story = {
  render: () => (
    <StatefulInspector
      badge="Ainda não adicionado"
      build={<StepForm autoFocus />}
      disabledTabs={['status', 'logs']}
      icon={<MailIcon />}
      title="Novo passo"
    >
      {formFooter('Adicionar passo')}
    </StatefulInspector>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', { name: 'Novo passo' }),
    ).toBeVisible()
  },
}

export const EditOnMobile: Story = {
  globals: mobile,
  parameters: { layout: 'fullscreen' },
  render: () => (
    <StatefulInspector
      badge="Enviar e-mail · send-email"
      build={<StepForm name="Enviar cobrança" />}
      icon={<MailIcon />}
      logs={logs}
      status={status}
      title="Enviar cobrança"
    >
      {formFooter('Salvar passo')}
    </StatefulInspector>
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog', {
      name: 'Detalhes do passo',
    })
    await expect(
      within(dialog).getByRole('button', { name: 'Salvar passo' }),
    ).toBeVisible()
  },
}
