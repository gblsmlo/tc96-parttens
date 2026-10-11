import {
  Checklist,
  type ChecklistItem,
  DateProperty,
  PeopleProperty,
  type PeoplePropertyOption,
  RecordGroup,
  RecordGroupLink,
  RecordGroupRow,
  RecordPreview,
  SelectProperty,
  type SelectPropertyOption,
  TextProperty,
} from '@tc96/parttens'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  CalendarClockIcon,
  ClipboardListIcon,
  FileTextIcon,
  HistoryIcon,
  ReceiptTextIcon,
} from 'lucide-react'
import { useState } from 'react'

const today = '09/10/2026'

export function TasksBlock() {
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
            current.map((item) => (item.id === id ? { ...item, title } : item)),
          )
        }
        onNewItemTitleChange={setNewItemTitle}
        variant="plain"
      />
    </RecordGroup>
  )
}

const yesNoOptions: readonly SelectPropertyOption[] = [
  { label: 'Sim', value: 'yes' },
  { label: 'Não', value: 'no' },
]

const peopleOptions: readonly PeoplePropertyOption[] = [
  { label: 'Ana Souza', value: 'ana' },
  { label: 'Gabriel Melo', value: 'gabriel' },
  { label: 'Pedro Rocha', value: 'pedro' },
]

export function AccessBlock() {
  const [isPrivate, setIsPrivate] = useState<string | null>('no')
  const [participants, setParticipants] = useState<readonly string[]>([
    'ana',
    'gabriel',
  ])

  return (
    <RecordGroup title="Acesso">
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
}

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
    empty: 'Sem objetivo primário',
    key: 'primaryObjective',
    label: 'Objetivo primário',
    options: objectiveOptions,
  },
  {
    empty: 'Sem objetivo secundário',
    key: 'secondaryObjective',
    label: 'Objetivo secundário',
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

function StatusBadge({ status }: Readonly<{ status: BriefVersion['status'] }>) {
  return status === 'draft' ? (
    <Badge variant="warning">Rascunho</Badge>
  ) : (
    <Badge variant="success">Publicada</Badge>
  )
}

const sameValues = (a: BriefValues, b: BriefValues) =>
  briefFields.every(({ key }) => a[key] === b[key])

export function BriefingBlock() {
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
      <RecordGroup title="Briefing">
        <RecordGroupLink
          leading={<ClipboardListIcon aria-hidden="true" />}
          meta={<StatusBadge status={latest.status} />}
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
}

export function VersionsBlock() {
  const [open, setOpen] = useState(false)
  const [previewNumber, setPreviewNumber] = useState(1)
  const previewed = initialVersions.find(
    (version) => version.number === previewNumber,
  ) as BriefVersion

  return (
    <>
      <RecordGroup title="Versões">
        {initialVersions.map((version) => (
          <RecordGroupLink
            key={version.number}
            leading={<HistoryIcon aria-hidden="true" />}
            meta={<StatusBadge status={version.status} />}
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
}

const installments = [
  { id: 'parcela-1', name: 'Parcela 1', status: 'Paga · 10/09/2026' },
  { id: 'parcela-2', name: 'Parcela 2', status: 'Prevista · 10/10/2026' },
  { id: 'parcela-3', name: 'Parcela 3', status: 'Prevista · 10/11/2026' },
]

export function LinkedRecordsBlock() {
  return (
    <RecordGroup title="Parcelas">
      {installments.map((installment) => (
        <RecordGroupLink
          href={`#/lancamentos/${installment.id}`}
          key={installment.id}
          leading={<ReceiptTextIcon aria-hidden="true" />}
          meta={installment.status}
        >
          {installment.name}
        </RecordGroupLink>
      ))}
    </RecordGroup>
  )
}

export function DocumentBlock({
  onAttachDocument,
  signed = true,
}: Readonly<{ onAttachDocument?: () => void; signed?: boolean }>) {
  return (
    <RecordGroup
      empty={!signed}
      footer={
        signed ? undefined : (
          <Button onClick={onAttachDocument} size="sm" variant="outline">
            Anexar documento
          </Button>
        )
      }
      title="Documento"
    >
      {signed ? (
        <RecordGroupLink
          href="#/documentos/contrato-assinado.pdf"
          leading={<FileTextIcon aria-hidden="true" />}
          meta="PDF · 12/08/2026"
        >
          contrato-assinado.pdf
        </RecordGroupLink>
      ) : (
        <p className="text-muted-foreground text-sm">Sem documento assinado</p>
      )}
    </RecordGroup>
  )
}

const paymentMethodOptions: readonly SelectPropertyOption[] = [
  { label: 'Boleto', value: 'boleto' },
  { label: 'Pix', value: 'pix' },
  { label: 'Cartão', value: 'card' },
]

export function BillingBlock() {
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
}

const sourceOptions: readonly SelectPropertyOption[] = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'Indicação', value: 'referral' },
  { label: 'Google', value: 'google' },
]

export function DetailsBlock() {
  const [birthDate, setBirthDate] = useState<string | null>(
    '1988-03-14T12:00:00.000Z',
  )
  const [cpf, setCpf] = useState<string | null>('123.456.789-09')
  const [occupation, setOccupation] = useState<string | null>(null)
  const [source, setSource] = useState<string | null>('referral')

  return (
    <RecordGroup title="Mais informações">
      <RecordGroupRow label="Data de nascimento">
        <DateProperty
          ariaLabel="Data de nascimento"
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
}

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

export function StageBlock() {
  const [interest, setInterest] = useState<string | null>('banking')
  const [urgency, setUrgency] = useState<string | null>(null)

  return (
    <RecordGroup title="Novo Lead">
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
        leading={<CalendarClockIcon aria-hidden="true" />}
        meta="Agendada · 14/10 às 10:00"
      >
        Consulta inicial
      </RecordGroupLink>
    </RecordGroup>
  )
}
