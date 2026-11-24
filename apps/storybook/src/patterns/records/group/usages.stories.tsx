import {
  BuildingsIcon,
  CalendarDotIcon,
  CalendarPlusIcon,
  ClipboardTextIcon,
  ClockCounterClockwiseIcon,
  EnvelopeSimpleIcon,
  FileTextIcon,
  HandshakeIcon,
  PercentIcon,
  type Icon as PhosphorIcon,
  PlusIcon,
  ReceiptIcon,
  SealCheckIcon,
  SignatureIcon,
  TargetIcon,
  UserPlusIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Checklist,
  type ChecklistItem,
  DateProperty,
  PeopleProperty,
  type PeoplePropertyOption,
  RecordGroup,
  RecordGroupAction,
  RecordGroupItem,
  RecordGroupLink,
  RecordGroupMetric,
  RecordGroupMetrics,
  RecordGroupRow,
  RecordPreview,
  RecordStatusBadge,
  SelectProperty,
  type SelectPropertyOption,
  TextProperty,
} from '@tc96/parttens'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { type ReactNode, useState } from 'react'

import { expect, within } from 'storybook/test'
import { sleep } from '../../../test-utils/sleep'
import { usageParameters } from '../../../test-utils/usage-kit'
import { NoteDialog } from '../dialog/note-dialog'
import {
  initialNotes,
  type Note,
  noteAge,
  noteAuthor,
  noteAuthors,
  notePreview,
  noteRecordName,
  notesNow,
  noteTitle,
} from '../dialog/note-record'

const today = '09/10/2026'

const yesNoOptions: readonly SelectPropertyOption[] = [
  { label: 'Sim', value: 'yes' },
  { label: 'Não', value: 'no' },
]

const peopleOptions: readonly PeoplePropertyOption[] = [
  { label: 'Ana Souza', value: 'ana' },
  { label: 'Gabriel Melo', value: 'gabriel' },
  { label: 'Pedro Rocha', value: 'pedro' },
]

interface BriefValues {
  expectedTarget: string | null
  primaryObjective: string | null
  secondaryObjective: string | null
}

interface BriefVersion {
  number: number
  savedAt: string
  status: 'draft' | 'published'
  values: BriefValues
}

const objectiveOptions: readonly SelectPropertyOption[] = [
  { label: 'Gerar novas consultas', value: 'new-appointments' },
  { label: 'Divulgar área de atuação', value: 'practice-area' },
  { label: 'Fortalecer indicação', value: 'referrals' },
]

const targetOptions: readonly SelectPropertyOption[] = [
  { label: 'Consulta agendada', value: 'booked-appointment' },
  { label: 'Conversa no WhatsApp', value: 'whatsapp-conversation' },
]

const briefFields: readonly {
  key: keyof BriefValues
  label: string
  empty: string
  options: readonly SelectPropertyOption[]
}[] = [
  {
    empty: 'Sem objetivo 1',
    key: 'primaryObjective',
    label: 'Objetivo 1',
    options: objectiveOptions,
  },
  {
    empty: 'Sem objetivo 2',
    key: 'secondaryObjective',
    label: 'Objetivo 2',
    options: objectiveOptions,
  },
  {
    empty: 'Sem alvo esperado',
    key: 'expectedTarget',
    label: 'Alvo esperado',
    options: targetOptions,
  },
]

const initialVersions: readonly BriefVersion[] = [
  {
    number: 2,
    savedAt: '08/10/2026',
    status: 'draft',
    values: {
      expectedTarget: 'whatsapp-conversation',
      primaryObjective: 'new-appointments',
      secondaryObjective: null,
    },
  },
  {
    number: 1,
    savedAt: '26/09/2026',
    status: 'published',
    values: {
      expectedTarget: 'booked-appointment',
      primaryObjective: 'new-appointments',
      secondaryObjective: null,
    },
  },
]

const statusBadges = {
  draft: (
    <RecordStatusBadge color="var(--warning-foreground)">
      Rascunho
    </RecordStatusBadge>
  ),
  published: (
    <RecordStatusBadge color="var(--success-foreground)">
      Publicada
    </RecordStatusBadge>
  ),
} satisfies Record<BriefVersion['status'], ReactNode>

const sameValues = (a: BriefValues, b: BriefValues) =>
  briefFields.every(({ key }) => a[key] === b[key])

const installments = [
  { id: 'parcela-1', name: 'Parcela 1', status: 'Paga · 10/09/2026' },
  { id: 'parcela-2', name: 'Parcela 2', status: 'Prevista · 10/10/2026' },
  { id: 'parcela-3', name: 'Parcela 3', status: 'Prevista · 10/11/2026' },
]

const paymentMethodOptions: readonly SelectPropertyOption[] = [
  { label: 'Boleto', value: 'boleto' },
  { label: 'Pix', value: 'pix' },
  { label: 'Cartão', value: 'card' },
]

const sourceOptions: readonly SelectPropertyOption[] = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'Indicação', value: 'referral' },
  { label: 'Google', value: 'google' },
]

const interestOptions: readonly SelectPropertyOption[] = [
  { label: 'Revisional bancária', value: 'banking' },
  { label: 'Trabalhista', value: 'labor' },
  { label: 'Família', value: 'family' },
]

const urgencyOptions: readonly SelectPropertyOption[] = [
  { label: 'Alta', value: 'high' },
  { label: 'Média', value: 'medium' },
  { label: 'Baixa', value: 'low' },
]

interface RecordTrigger {
  icon: PhosphorIcon
  id: string
  label: string
  meta: ReactNode
}

const initialTriggers: readonly RecordTrigger[] = [
  {
    icon: SignatureIcon,
    id: 'contract',
    label: 'Gerar contrato',
    meta: null,
  },
  {
    icon: EnvelopeSimpleIcon,
    id: 'documents',
    label: 'Solicitar documentos',
    meta: null,
  },
  {
    icon: CalendarPlusIcon,
    id: 'appointment',
    label: 'Agendar consulta',
    meta: null,
  },
  {
    icon: UserPlusIcon,
    id: 'contact',
    label: 'Criar contato',
    meta: null,
  },
  {
    icon: TargetIcon,
    id: 'lead',
    label: 'Criar Lead',
    meta: null,
  },
]

const meta = {
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: usageParameters,
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const describe = (story: string) => ({ docs: { description: { story } } })

const regionOf = (canvasElement: HTMLElement, name: string) =>
  within(within(canvasElement).getByRole('region', { name }))

const expectWholeLabels = async (
  scope: HTMLElement,
  labels: readonly string[],
) => {
  for (const label of labels) {
    const text = within(scope).getByText(label, {
      selector: '[data-slot="record-group-row-label"] > span',
    })
    await expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth)
  }
}

export const Tasks: Story = {
  parameters: describe(
    'Tracks work to do: a `Checklist` in `plain` inside an `inset` `RecordGroup`, so its rows take the 32px row height of the group. Check, rename, reorder, delete and add items.',
  ),
  play: async ({ canvasElement }) => {
    const tasks = regionOf(canvasElement, 'Tarefas')

    await expect(
      tasks.getByRole('checkbox', { name: 'Baixar extratos de 2024' }),
    ).toBeChecked()
    await expect(
      tasks.getByRole('checkbox', { name: 'Redigir contestação' }),
    ).not.toBeChecked()
  },
  render: function Tasks() {
    const [items, setItems] = useState<readonly ChecklistItem[]>([
      { completed: true, id: 'extracts', title: 'Baixar extratos de 2024' },
      { completed: false, id: 'appeal', title: 'Redigir contestação' },
    ])
    const [newItemTitle, setNewItemTitle] = useState('')

    return (
      <RecordGroup title="Tarefas" variant="inset">
        <Checklist
          ariaLabel="Lista de tarefas"
          items={items}
          locale="pt-BR"
          newItemTitle={newItemTitle}
          onCreate={(title, completed) => {
            setItems((current) => [
              ...current,
              { completed, id: `item-${current.length + 1}`, title },
            ])
            setNewItemTitle('')
          }}
          onItemCompletionChange={(id, completed) =>
            setItems((current) =>
              current.map((item) =>
                item.id === id ? { ...item, completed } : item,
              ),
            )
          }
          onItemDelete={(id) =>
            setItems((current) => current.filter((item) => item.id !== id))
          }
          onItemMove={(id, targetIndex) =>
            setItems((current) => {
              const moving = current.find((item) => item.id === id)
              if (!moving) return current
              const rest = current.filter((item) => item.id !== id)
              return [
                ...rest.slice(0, targetIndex),
                moving,
                ...rest.slice(targetIndex),
              ]
            })
          }
          onItemRename={(id, title) =>
            setItems((current) =>
              current.map((item) =>
                item.id === id ? { ...item, title } : item,
              ),
            )
          }
          onNewItemTitleChange={setNewItemTitle}
          variant="plain"
        />
      </RecordGroup>
    )
  },
}

export const Triggers: Story = {
  parameters: describe(
    'Runs commands on the record: each row is a trigger (icon and command) rendered as a `button`, with the `meta` slot on the right left empty for now. The row is busy while its command runs and keeps focus.',
  ),
  play: async ({ canvasElement }) => {
    await expect(
      Array.from(
        canvasElement.querySelectorAll('[data-slot="record-group-link"]'),
        (row) => row.textContent,
      ),
    ).toEqual([
      'Gerar contrato',
      'Solicitar documentos',
      'Agendar consulta',
      'Criar contato',
      'Criar Lead',
    ])
    await expect(
      regionOf(canvasElement, 'Ações').getByRole('button', {
        name: 'Gerar contrato',
      }),
    ).toBeVisible()
  },
  render: function Triggers() {
    const [runningId, setRunningId] = useState<string | null>(null)

    const run = async (id: string) => {
      if (runningId) return
      setRunningId(id)
      await sleep(400)
      setRunningId(null)
    }

    return (
      <RecordGroup title="Ações" variant="plain">
        {initialTriggers.map(({ icon: Icon, id, label, meta }) => (
          <RecordGroupLink
            aria-busy={runningId === id}
            key={id}
            leading={<Icon aria-hidden />}
            meta={meta}
            onClick={() => run(id)}
            render={<button type="button" />}
          >
            {label}
          </RecordGroupLink>
        ))}
      </RecordGroup>
    )
  },
}

export const Access: Story = {
  parameters: describe(
    'Sets who sees the record: field rows with a label and a `properties` value in `plain`, edited in place.',
  ),
  play: async ({ canvasElement }) => {
    const access = regionOf(canvasElement, 'Acesso')

    await expect(access.getByText('Privado')).toBeVisible()
    await expect(
      access.getByRole('combobox', { name: /^Privado/ }),
    ).toHaveTextContent('Não')
  },
  render: function Access() {
    const [isPrivate, setIsPrivate] = useState<string | null>('no')
    const [participants, setParticipants] = useState<readonly string[]>([
      'ana',
      'gabriel',
    ])

    return (
      <RecordGroup title="Acesso" variant="plain">
        <RecordGroupRow label="Privado">
          <SelectProperty
            ariaLabel="Privado"
            onValueChange={setIsPrivate}
            options={yesNoOptions}
            value={isPrivate}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Participantes">
          <PeopleProperty
            ariaLabel="Participantes"
            onValueChange={setParticipants}
            options={peopleOptions}
            value={participants}
          />
        </RecordGroupRow>
      </RecordGroup>
    )
  },
}

export const Briefing: Story = {
  parameters: describe(
    'Edits a form behind one row: the row (icon, title, status badge) opens a `RecordPreview` with the fields, the save state in its description and the commands that save a draft or publish a version in its footer.',
  ),
  play: async ({ canvasElement }) => {
    const trigger = regionOf(canvasElement, 'Briefing').getByRole('button', {
      name: 'Briefing Rascunho',
    })
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveAttribute('data-slot', 'record-group-link')
  },
  render: function Briefing() {
    const [versions, setVersions] = useState(initialVersions)
    const latest = versions[0] as BriefVersion
    const [brief, setBrief] = useState<BriefValues>(latest.values)
    const [open, setOpen] = useState(false)
    const dirty = !sameValues(brief, latest.values)

    const commit = (status: BriefVersion['status']) =>
      setVersions((current) => {
        const [head, ...rest] = current as [BriefVersion, ...BriefVersion[]]
        const next = { savedAt: today, status, values: brief }
        return head.status === 'draft'
          ? [{ ...head, ...next }, ...rest]
          : [{ ...next, number: head.number + 1 }, ...current]
      })

    const status = dirty
      ? 'Alterações não salvas'
      : latest.status === 'draft'
        ? `Rascunho salvo em ${latest.savedAt}`
        : `Versão ${latest.number} publicada em ${latest.savedAt}`

    return (
      <>
        <RecordGroup title="Briefing" variant="plain">
          <RecordGroupLink
            leading={<ClipboardTextIcon aria-hidden />}
            meta={statusBadges[latest.status]}
            onClick={() => setOpen(true)}
            render={<button type="button" />}
          >
            Briefing
          </RecordGroupLink>
        </RecordGroup>
        <RecordPreview
          closeLabel="Fechar"
          description={
            <span aria-live="polite" data-testid="brief-status">
              {status}
            </span>
          }
          footer={
            <>
              <Button
                disabled={!dirty}
                onClick={() => commit('draft')}
                variant="outline"
              >
                Salvar rascunho
              </Button>
              <Button
                disabled={!dirty && latest.status === 'published'}
                onClick={() => commit('published')}
              >
                Publicar versão
              </Button>
            </>
          }
          onOpenChange={setOpen}
          open={open}
          title="Briefing"
        >
          {briefFields.map((field) => (
            <RecordGroupRow key={field.key} label={field.label}>
              <SelectProperty
                ariaLabel={field.label}
                fallback={field.empty}
                onValueChange={(value) =>
                  setBrief((current) => ({ ...current, [field.key]: value }))
                }
                options={field.options}
                value={brief[field.key]}
                variant="plain"
              />
            </RecordGroupRow>
          ))}
        </RecordPreview>
      </>
    )
  },
}

export const Versions: Story = {
  parameters: describe(
    'Lists the history of a record: each version is a trigger row (icon, title, status badge) that opens its fields, read-only, in a `RecordPreview`.',
  ),
  play: async ({ canvasElement }) => {
    const versions = regionOf(canvasElement, 'Versões')
    const first = versions.getByRole('button', { name: 'Versão 1 Publicada' })

    await expect(
      versions.getByRole('button', { name: 'Versão 2 Rascunho' }),
    ).toBeVisible()
    await expect(first).toBeVisible()
  },
  render: function Versions() {
    const [open, setOpen] = useState(false)
    const [previewNumber, setPreviewNumber] = useState(1)
    const previewed = initialVersions.find(
      (version) => version.number === previewNumber,
    ) as BriefVersion

    return (
      <>
        <RecordGroup title="Versões" variant="plain">
          {initialVersions.map((version) => (
            <RecordGroupLink
              key={version.number}
              leading={<ClockCounterClockwiseIcon aria-hidden />}
              meta={statusBadges[version.status]}
              onClick={() => {
                setPreviewNumber(version.number)
                setOpen(true)
              }}
              render={<button type="button" />}
            >
              {`Versão ${version.number}`}
            </RecordGroupLink>
          ))}
        </RecordGroup>
        <RecordPreview
          closeLabel="Fechar"
          description={
            previewed.status === 'draft'
              ? `Rascunho salvo em ${previewed.savedAt}`
              : `Publicada em ${previewed.savedAt}`
          }
          onOpenChange={setOpen}
          open={open}
          title={`Versão ${previewed.number}`}
        >
          {briefFields.map((field) => (
            <RecordGroupRow key={field.key} label={field.label}>
              <SelectProperty
                ariaLabel={`${field.label} da versão ${previewed.number}`}
                fallback={field.empty}
                options={field.options}
                readOnly
                value={previewed.values[field.key]}
                variant="plain"
              />
            </RecordGroupRow>
          ))}
        </RecordPreview>
      </>
    )
  },
}

export const LinkedRecords: Story = {
  parameters: describe(
    'Follows records tied to this one: each row is a link (entity icon, name, status and date) that opens the linked record.',
  ),
  play: async ({ canvasElement }) => {
    const links = regionOf(canvasElement, 'Parcelas').getAllByRole('link')

    await expect(links.map((link) => link.textContent)).toEqual([
      'Parcela 1Paga · 10/09/2026',
      'Parcela 2Prevista · 10/10/2026',
      'Parcela 3Prevista · 10/11/2026',
    ])
    await expect(links[1]).toHaveAttribute('href', '#/lancamentos/parcela-2')
  },
  render: function LinkedRecords() {
    return (
      <RecordGroup title="Parcelas" variant="plain">
        {installments.map((installment) => (
          <RecordGroupLink
            href={`#/lancamentos/${installment.id}`}
            key={installment.id}
            leading={<ReceiptIcon aria-hidden />}
            meta={installment.status}
          >
            {installment.name}
          </RecordGroupLink>
        ))}
      </RecordGroup>
    )
  },
}

export const Document: Story = {
  parameters: describe(
    'Shows the file attached to the record: a link row with the type icon, the file name, and the type and date.',
  ),
  play: async ({ canvasElement }) => {
    await expect(
      regionOf(canvasElement, 'Documento').getByRole('link', {
        name: 'contrato-assinado.pdf PDF · 12/08/2026',
      }),
    ).toHaveAttribute('href', '#/documentos/contrato-assinado.pdf')
  },
  render: function Document() {
    return (
      <RecordGroup title="Documento" variant="plain">
        <RecordGroupLink
          href="#/documentos/contrato-assinado.pdf"
          leading={<FileTextIcon aria-hidden />}
          meta="PDF · 12/08/2026"
        >
          contrato-assinado.pdf
        </RecordGroupLink>
      </RecordGroup>
    )
  },
}

export const Empty: Story = {
  parameters: describe(
    'Shows that the record has no file yet: the group starts closed while empty, and opening it shows the absence as text at the start of the content, with no vertical padding and no footer.',
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Documento',
    })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  },
  render: function Empty() {
    return (
      <RecordGroup empty title="Documento" variant="plain">
        <p className="text-muted-foreground text-sm">Sem documento assinado</p>
      </RecordGroup>
    )
  },
}

export const Billing: Story = {
  parameters: describe(
    'Fills a form and runs its command: field rows, with the command that issues the charge in the group footer, inside the same group.',
  ),
  play: async ({ canvasElement }) => {
    const charge = regionOf(canvasElement, 'Cobrança')
    await expect(charge.getByText('Não emitida')).toBeVisible()
    await expect(
      charge.getByRole('button', { name: 'Emitir cobrança' }),
    ).toBeDisabled()
  },
  render: function Billing() {
    const [method, setMethod] = useState<string | null>(null)
    const [issuedAt, setIssuedAt] = useState<string | null>(null)

    return (
      <RecordGroup
        footer={
          <Button
            disabled={method === null}
            onClick={() => setIssuedAt(today)}
            size="sm"
            variant={issuedAt ? 'outline' : 'default'}
          >
            {issuedAt ? 'Emitir segunda via' : 'Emitir cobrança'}
          </Button>
        }
        title="Cobrança"
        variant="plain"
      >
        <RecordGroupRow label="Meio">
          <SelectProperty
            ariaLabel="Meio"
            fallback="Sem meio"
            onValueChange={setMethod}
            options={paymentMethodOptions}
            value={method}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Vencimento">
          <DateProperty
            ariaLabel="Vencimento"
            locale="pt-BR"
            readOnly
            timeZone="UTC"
            value="2026-10-10T12:00:00.000Z"
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Emissão">
          <TextProperty
            ariaLabel="Emissão"
            fallback="Não emitida"
            value={issuedAt ? `Emitida em ${issuedAt}` : null}
            variant="plain"
          />
        </RecordGroupRow>
      </RecordGroup>
    )
  },
}

export const Details: Story = {
  parameters: describe(
    'Keeps secondary data: field rows edited in place, with “Sem …” for an empty value.',
  ),
  play: async ({ canvasElement }) => {
    await expectWholeLabels(
      within(canvasElement).getByRole('region', { name: 'Mais informações' }),
      ['Nascimento', 'CPF', 'Profissão', 'Origem'],
    )
    const details = regionOf(canvasElement, 'Mais informações')
    await expect(details.getByRole('textbox', { name: 'CPF' })).toHaveValue(
      '123.456.789-09',
    )

    await expect(
      details.getByRole('textbox', { name: 'Profissão' }),
    ).toHaveAttribute('placeholder', 'Sem profissão')
  },
  render: function Details() {
    const [birthDate, setBirthDate] = useState<string | null>(
      '1988-03-14T12:00:00.000Z',
    )
    const [cpf, setCpf] = useState<string | null>('123.456.789-09')
    const [occupation, setOccupation] = useState<string | null>(null)
    const [source, setSource] = useState<string | null>('referral')

    return (
      <RecordGroup title="Mais informações" variant="plain">
        <RecordGroupRow label="Nascimento">
          <DateProperty
            ariaLabel="Nascimento"
            locale="pt-BR"
            onValueChange={setBirthDate}
            timeZone="UTC"
            value={birthDate}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="CPF">
          <TextProperty
            ariaLabel="CPF"
            editing="inline"
            onCommit={setCpf}
            value={cpf}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Profissão">
          <TextProperty
            ariaLabel="Profissão"
            editing="inline"
            fallback="Sem profissão"
            onCommit={setOccupation}
            value={occupation}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Origem">
          <SelectProperty
            ariaLabel="Origem"
            onValueChange={setSource}
            options={sourceOptions}
            value={source}
            variant="plain"
          />
        </RecordGroupRow>
      </RecordGroup>
    )
  },
}

export const Stage: Story = {
  parameters: describe(
    'Holds the work of the current stage: field rows and a link to a record the stage produced, such as the scheduled appointment.',
  ),
  play: async ({ canvasElement }) => {
    const stage = regionOf(canvasElement, 'Novo Lead')
    await expect(stage.getByText('Sem urgência')).toBeVisible()
    await expect(
      stage.getByRole('link', {
        name: 'Consulta inicial Agendada · 14/10 às 10:00',
      }),
    ).toHaveAttribute('href', '#/agenda/consulta-inicial')
  },
  render: function Stage() {
    const [interest, setInterest] = useState<string | null>('banking')
    const [urgency, setUrgency] = useState<string | null>(null)

    return (
      <RecordGroup title="Novo Lead" variant="plain">
        <RecordGroupRow label="Interesse">
          <SelectProperty
            ariaLabel="Interesse"
            onValueChange={setInterest}
            options={interestOptions}
            value={interest}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Urgência">
          <SelectProperty
            ariaLabel="Urgência"
            fallback="Sem urgência"
            onValueChange={setUrgency}
            options={urgencyOptions}
            value={urgency}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupLink
          href="#/agenda/consulta-inicial"
          leading={<CalendarDotIcon aria-hidden />}
          meta="Agendada · 14/10 às 10:00"
        >
          Consulta inicial
        </RecordGroupLink>
      </RecordGroup>
    )
  },
}

export const Indicators: Story = {
  parameters: describe(
    'Follows the numbers of a campaign pipeline: leads against the planned leads, with a meter, and plain counts for conversion, success and the deals in negotiation. The consumer computes and formats every number.',
  ),
  play: async ({ canvasElement }) => {
    const indicators = regionOf(canvasElement, 'Indicadores')
    const terms = indicators
      .getAllByRole('term')
      .map((term) => term.textContent)

    await expect(terms).toEqual([
      'Leads',
      'Conversão',
      'Sucesso',
      'Em negociação',
    ])
    await expect(indicators.getByText('de 120 planejados')).toBeVisible()
    await expect(
      indicators.getByRole('meter', { name: 'Leads' }),
    ).toHaveAttribute('aria-valuenow', '70')
    for (const label of terms) {
      const text = indicators.getByText(label as string)
      await expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth)
    }
  },
  render: function Indicators() {
    const leads = 84
    const plannedLeads = 120

    return (
      <RecordGroup title="Indicadores" variant="plain">
        <RecordGroupMetrics>
          <RecordGroupMetric
            icon={<UsersIcon aria-hidden />}
            label="Leads"
            progress={leads / plannedLeads}
            target={`de ${plannedLeads} planejados`}
            value={leads}
          />
          <RecordGroupMetric
            icon={<PercentIcon aria-hidden />}
            label="Conversão"
            value="18,5%"
          />
          <RecordGroupMetric
            icon={<SealCheckIcon aria-hidden />}
            label="Sucesso"
            target="vendas"
            value={12}
          />
          <RecordGroupMetric
            icon={<HandshakeIcon aria-hidden />}
            label="Em negociação"
            value={9}
          />
        </RecordGroupMetrics>
      </RecordGroup>
    )
  },
}

interface ActivityEntry {
  actor: { initials: string; name: string }
  ago: string
  at: string
  id: string
  summary: ReactNode
}

const gabriel = { initials: 'G', name: 'Gabriel Melo' }

const activityEntries: readonly ActivityEntry[] = [
  {
    actor: gabriel,
    ago: 'há 1 mês',
    at: '2026-09-09T14:20',
    id: 'company',
    summary: (
      <>
        <span className="text-muted-foreground">alterou</span> Empresa{' '}
        <span className="text-muted-foreground">para</span>{' '}
        <span className="inline-flex items-center gap-1 align-bottom">
          <BuildingsIcon aria-hidden className="size-4 text-muted-foreground" />
          PayPal
        </span>
      </>
    ),
  },
  {
    actor: gabriel,
    ago: 'há 1 mês',
    at: '2026-09-09T14:18',
    id: 'attributes',
    summary: (
      <>
        <span className="text-muted-foreground">alterou</span> 2 atributos
      </>
    ),
  },
  {
    actor: gabriel,
    ago: 'há 1 mês',
    at: '2026-09-09T14:15',
    id: 'created',
    summary: (
      <>
        <span className="text-muted-foreground">criou</span> Pessoa
      </>
    ),
  },
]

export const Activity: Story = {
  parameters: describe(
    'Shows what changed on the record, newest first: each entry is a `RecordGroupItem` with the author avatar, a sentence with the names in ink and the verbs muted, and the relative date as a `time` in the trailing slot. `Ver tudo` in `actions` opens the full history.',
  ),
  play: async ({ canvasElement }) => {
    const activity = regionOf(canvasElement, 'Atividade')

    await expect(
      Array.from(
        canvasElement.querySelectorAll('[data-slot="record-group-item-title"]'),
        (title) => title.textContent,
      ),
    ).toEqual([
      'Gabriel Melo alterou Empresa para PayPal',
      'Gabriel Melo alterou 2 atributos',
      'Gabriel Melo criou Pessoa',
    ])
    await expect(
      Array.from(canvasElement.querySelectorAll('time'), (time) =>
        time.getAttribute('datetime'),
      ),
    ).toEqual(['2026-09-09T14:20', '2026-09-09T14:18', '2026-09-09T14:15'])
    await expect(
      activity.getByRole('button', { name: 'Ver tudo' }),
    ).toBeVisible()
  },
  render: function Activity() {
    return (
      <RecordGroup
        actions={
          <Button size="xs" variant="ghost">
            Ver tudo
          </Button>
        }
        title="Atividade"
        variant="inset"
      >
        {activityEntries.map(({ actor, ago, at, id, summary }) => (
          <RecordGroupItem
            key={id}
            leading={
              <Avatar
                aria-hidden
                className="[--avatar-size:--spacing(4)] text-[0.625rem]"
              >
                <AvatarFallback>{actor.initials}</AvatarFallback>
              </Avatar>
            }
            title={
              <>
                {actor.name} {summary}
              </>
            }
          >
            <time className="text-muted-foreground" dateTime={at}>
              {ago}
            </time>
          </RecordGroupItem>
        ))}
      </RecordGroup>
    )
  },
}

const copyLink = (_id: string) => undefined

const authorInitial = (id: string) =>
  noteAuthors.find((author) => author.value === id)?.label.charAt(0) ?? ''

export const Notes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Keeps the notes of the record, newest first: the title carries the count, and each note is a `RecordGroupLink` rendered as a `button` with the author avatar, the title in ink, the first lines of the body muted and the relative date as a `time` in `meta`. A row opens the note in the `NoteDialog` of [Patterns/Records/RecordDialog/Usages, Note](?path=/story/patterns-records-recorddialog-usages--note), + opens it empty, and a save moves the note to the top. One `NoteDialog` serves every request and resets its fields when `note` changes. `Ver tudo` opens the full list.',
      },
      source: { inlineLimit: 250 },
    },
  },
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('region', {
      name: /^Notas/,
    })

    await expect(group).toHaveAccessibleName('Notas 2')
    await expect(
      Array.from(
        group.querySelectorAll('[data-slot="record-group-link-name"]'),
        (name) => name.textContent,
      ),
    ).toEqual([
      'Preferências de contato Prefere contato por WhatsApp depois das 18h.',
      'Nota sem título Esta nota não tem conteúdo',
    ])
    await expect(
      Array.from(group.querySelectorAll('time'), (time) => time.textContent),
    ).toEqual(['há 2 minutos', 'há 3 dias'])
  },
  render: function Notes() {
    const [notes, setNotes] = useState<readonly Note[]>(initialNotes)
    const [editing, setEditing] = useState<Note | null>(null)
    const [open, setOpen] = useState(false)

    const openNote = (note: Note | null) => {
      setEditing(note)
      setOpen(true)
    }

    return (
      <>
        <RecordGroup
          actions={
            <>
              <Button size="xs" variant="ghost">
                Ver tudo
              </Button>
              <RecordGroupAction
                icon={PlusIcon}
                label="Nova nota"
                onClick={() => openNote(null)}
              />
            </>
          }
          title={
            <span className="inline-flex items-center gap-1.5">
              Notas <Badge variant="outline">{notes.length}</Badge>
            </span>
          }
          variant="inset"
        >
          {notes.map((note) => (
            <RecordGroupLink
              key={note.id}
              leading={
                <Avatar
                  aria-hidden
                  className="[--avatar-size:--spacing(4)] text-[0.625rem]"
                >
                  <AvatarFallback>{authorInitial(note.author)}</AvatarFallback>
                </Avatar>
              }
              meta={
                <time dateTime={note.updatedAt}>{noteAge(note.updatedAt)}</time>
              }
              onClick={() => openNote(note)}
              render={<button type="button" />}
            >
              {noteTitle(note)}{' '}
              <span className="text-muted-foreground">{notePreview(note)}</span>
            </RecordGroupLink>
          ))}
        </RecordGroup>
        <NoteDialog
          note={editing}
          onCopyLink={copyLink}
          onOpenChange={setOpen}
          onSave={(values) =>
            setNotes((current) => {
              const saved: Note = {
                author: editing?.author ?? noteAuthor,
                id: editing?.id ?? `note-${current.length + 1}`,
                ...values,
                updatedAt: notesNow,
              }
              return [saved, ...current.filter((note) => note.id !== saved.id)]
            })
          }
          open={open}
          recordName={noteRecordName}
        />
      </>
    )
  },
}
